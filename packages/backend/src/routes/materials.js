const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { sequelize } = require('../models');
const { Material, MaterialView, User, StudentFeature, TutorStudent } = require('../models');
const { authenticate } = require('../middleware/auth');
const { Op } = require('sequelize');
const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads/materials');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for PDF upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.pdf`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Get materials based on user's role and assignments
router.get('/', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let whereClause = { isActive: true };
    let includeClause = [{
      model: User,
      as: 'uploader',
      attributes: ['name', 'email', 'role']
    }];

    // Role-based filtering
    if (user.role === 'STUDENT') {
      // Students see materials from their assigned tutors and ALL admin materials
      const tutorAssignments = await TutorStudent.findAll({
        where: { student_id: user.id },
        attributes: ['tutor_id']
      });

      const tutorIds = tutorAssignments.map(ta => ta.tutor_id);

      // Build OR conditions for materials access
      const orConditions = [
        // All admin materials (regardless of course category)
        { '$uploader.role$': 'ADMIN' }
      ];

      // Add materials from assigned tutors if any
      if (tutorIds.length > 0) {
        orConditions.push({ uploadedBy: tutorIds });
      }

      // Students with course type can also see materials for their course from any tutor
      if (user.courseType) {
        orConditions.push({
          courseCategory: user.courseType,
          '$uploader.role$': 'TUTOR'
        });
      }

      whereClause = {
        isActive: true,
        [Op.or]: orConditions
      };
    } else if (user.role === 'TUTOR') {
      // Tutors see only their own materials
      whereClause.uploadedBy = user.id;
    }
    // Admins see all materials (no additional filtering)

    const materials = await Material.findAll({
      where: whereClause,
      include: includeClause,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      materials: materials
    });
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Upload material (Tutor/Admin only)
router.post('/', authenticate, upload.single('file'), async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user || (user.role !== 'TUTOR' && user.role !== 'ADMIN')) {
      return res.status(403).json({ success: false, message: 'Access denied. Only tutors and admins can upload materials.' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { title, description, courseCategory, tags } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    // Role-based course category validation
    let finalCourseCategory = courseCategory;

    if (user.role === 'TUTOR') {
      // Tutors can only upload for their assigned course type
      if (!user.courseType) {
        return res.status(400).json({ success: false, message: 'Tutor course type not set' });
      }
      // Force tutor's course type
      finalCourseCategory = user.courseType;

      // Validate if provided category matches tutor's course
      if (courseCategory && courseCategory !== user.courseType && courseCategory !== 'ALL') {
        return res.status(403).json({
          success: false,
          message: `You can only upload materials for ${user.courseType} course`
        });
      }
    } else if (user.role === 'ADMIN') {
      // Admins must specify a course category
      if (!courseCategory) {
        return res.status(400).json({ success: false, message: 'Course category is required' });
      }
    }

    const material = await Material.create({
      title,
      description,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      courseCategory: finalCourseCategory,
      uploadedBy: user.id,
      tags: tags ? JSON.parse(tags) : []
    });

    const materialWithUploader = await Material.findByPk(material.id, {
      include: [
        {
          model: User,
          as: 'uploader',
          attributes: ['name', 'email']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Material uploaded successfully',
      material: materialWithUploader
    });
  } catch (error) {
    console.error('Error uploading material:', error);

    // Clean up uploaded file if database operation fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// View/Download material with tracking
router.get('/:id/view', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const material = await Material.findByPk(req.params.id);
    if (!material || !material.isActive) {
      return res.status(404).json({ success: false, message: 'Material not found' });
    }

    // For now, allow all students to view materials
    // Later we can add more granular access control

    // Track the view with detailed logging
    const viewRecord = await MaterialView.create({
      materialId: material.id,
      userId: user.id
    });

    // Log the access for audit trail
    console.log(`[MATERIAL ACCESS] User: ${user.email} (${user.id}) accessed material: ${material.title} (${material.id}) at ${new Date().toISOString()}`);

    // Increment view count
    await material.increment('viewCount');

    // Serve the PDF file
    if (fs.existsSync(material.filePath)) {
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline', // Display in browser instead of download
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });

      res.sendFile(path.resolve(material.filePath));
    } else {
      res.status(404).json({ success: false, message: 'File not found' });
    }
  } catch (error) {
    console.error('Error serving material:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get material details
router.get('/:id', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const material = await Material.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'uploader',
          attributes: ['name', 'email']
        }
      ]
    });

    if (!material || !material.isActive) {
      return res.status(404).json({ success: false, message: 'Material not found' });
    }

    // Check course access for students
    if (user.role === 'STUDENT' && material.courseCategory !== 'ALL') {
      const hasAccess = await StudentFeature.findOne({
        where: {
          studentId: user.id,
          featureName: `${material.courseCategory}_ACCESS`
        }
      });

      if (!hasAccess) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    }

    res.json({
      success: true,
      material: material
    });
  } catch (error) {
    console.error('Error fetching material details:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Delete material (Admin only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Access denied. Only admins can delete materials.' });
    }

    const material = await Material.findByPk(req.params.id);
    if (!material) {
      return res.status(404).json({ success: false, message: 'Material not found' });
    }

    // Delete file from filesystem
    if (fs.existsSync(material.filePath)) {
      fs.unlinkSync(material.filePath);
    }

    // Soft delete - just mark as inactive
    await material.update({ isActive: false });

    res.json({
      success: true,
      message: 'Material deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting material:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get materials analytics (Admin/Tutor only)
router.get('/analytics/stats', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user || (user.role !== 'ADMIN' && user.role !== 'TUTOR')) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const totalMaterials = await Material.count({ where: { isActive: true } });
    const totalViews = await MaterialView.count();

    const materialsByCategory = await Material.findAll({
      where: { isActive: true },
      attributes: [
        'courseCategory',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['courseCategory']
    });

    const popularMaterials = await Material.findAll({
      where: { isActive: true },
      order: [['viewCount', 'DESC']],
      limit: 5,
      include: [
        {
          model: User,
          as: 'uploader',
          attributes: ['name', 'email']
        }
      ]
    });

    res.json({
      success: true,
      analytics: {
        totalMaterials,
        totalViews,
        materialsByCategory,
        popularMaterials
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;