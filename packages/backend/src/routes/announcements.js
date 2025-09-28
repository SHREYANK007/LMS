const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { Announcement, AnnouncementView, User } = require('../models');
const { Op } = require('sequelize');

// Get all announcements (for students and general viewing)
router.get('/', authenticate, async (req, res) => {
  try {
    const { type, status, limit = 20, offset = 0, courseType } = req.query;
    const user = req.user;

    let whereClause = {
      status: 'published'
    };

    // Handle expiry date check
    const expiryConditions = [
      { expiryDate: null },
      { expiryDate: { [Op.gt]: new Date() } }
    ];

    // Filter by type if provided
    if (type) {
      whereClause.type = type;
    }

    // Build audience filtering for students
    let audienceConditions = [];
    if (user.role === 'STUDENT') {
      // Always include announcements for 'all'
      audienceConditions.push({ targetAudience: 'all' });

      // Add course-specific conditions if user has a courseType
      if (user.courseType) {
        audienceConditions.push({ targetAudience: user.courseType.toLowerCase() });
        audienceConditions.push({
          [Op.and]: [
            { targetAudience: 'specific' },
            { courseType: user.courseType }
          ]
        });
      } else {
        // If user has no course type, still include general course announcements
        audienceConditions.push({ targetAudience: 'pte' });
        audienceConditions.push({ targetAudience: 'naati' });
      }

      // Combine all conditions
      whereClause = {
        [Op.and]: [
          whereClause,
          { [Op.or]: expiryConditions },
          { [Op.or]: audienceConditions }
        ]
      };
    } else {
      // For non-students, just add expiry condition
      whereClause[Op.or] = expiryConditions;
    }

    const announcements = await Announcement.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email']
        },
        {
          model: AnnouncementView,
          as: 'views',
          where: { userId: user.id },
          required: false,
          attributes: ['viewedAt', 'acknowledged']
        }
      ],
      order: [
        ['priority', 'DESC'],
        ['publishDate', 'DESC'],
        ['createdAt', 'DESC']
      ],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Mark announcements as viewed using individual findOrCreate to avoid SQL conflicts
    const announcementIds = announcements.rows.map(a => a.id);
    if (announcementIds.length > 0) {
      try {
        await Promise.all(
          announcementIds.map(id =>
            AnnouncementView.findOrCreate({
              where: {
                announcementId: id,
                userId: user.id
              },
              defaults: {
                announcementId: id,
                userId: user.id,
                viewedAt: new Date()
              }
            })
          )
        );
      } catch (viewError) {
        console.log('Non-critical: Could not mark announcements as viewed:', viewError.message);
        // Don't fail the entire request if view tracking fails
      }
    }

    res.json({
      success: true,
      announcements: announcements.rows,
      pagination: {
        total: announcements.count,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: announcements.count > parseInt(offset) + parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      sql: error.sql
    });
    res.status(500).json({
      error: 'Failed to fetch announcements'
    });
  }
});

// Get announcement by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const announcement = await Announcement.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email']
        },
        {
          model: AnnouncementView,
          as: 'views',
          where: { userId: req.user.id },
          required: false,
          attributes: ['viewedAt', 'acknowledged']
        }
      ]
    });

    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    // Check if user can view this announcement
    if (announcement.status !== 'published' && req.user.role !== 'ADMIN' && announcement.authorId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Mark as viewed
    await AnnouncementView.findOrCreate({
      where: {
        announcementId: announcement.id,
        userId: req.user.id
      },
      defaults: {
        announcementId: announcement.id,
        userId: req.user.id,
        viewedAt: new Date()
      }
    });

    res.json({
      success: true,
      announcement
    });
  } catch (error) {
    console.error('Error fetching announcement:', error);
    res.status(500).json({
      error: 'Failed to fetch announcement'
    });
  }
});

// Create announcement (Tutors and Admins)
router.post('/', authenticate, async (req, res) => {
  try {
    if (!['TUTOR', 'ADMIN'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Only tutors and admins can create announcements' });
    }

    const {
      title,
      content,
      type = 'info',
      priority = 'medium',
      targetAudience = 'all',
      courseType,
      publishDate,
      expiryDate,
      isGlobal = false,
      metadata = {}
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const announcement = await Announcement.create({
      title,
      content,
      type,
      priority,
      status: 'published',
      targetAudience,
      courseType: courseType || null,
      authorId: req.user.id,
      publishDate: publishDate || new Date(),
      expiryDate: expiryDate || null,
      isGlobal: req.user.role === 'ADMIN' ? isGlobal : false,
      metadata
    });

    const createdAnnouncement = await Announcement.findByPk(announcement.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(201).json({
      success: true,
      announcement: createdAnnouncement
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({
      error: 'Failed to create announcement'
    });
  }
});

// Update announcement
router.put('/:id', authenticate, async (req, res) => {
  try {
    const announcement = await Announcement.findByPk(req.params.id);

    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    // Check permissions
    if (req.user.role !== 'ADMIN' && announcement.authorId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const {
      title,
      content,
      type,
      priority,
      status,
      targetAudience,
      courseType,
      publishDate,
      expiryDate,
      isGlobal,
      metadata
    } = req.body;

    // Update allowed fields
    if (title !== undefined) announcement.title = title;
    if (content !== undefined) announcement.content = content;
    if (type !== undefined) announcement.type = type;
    if (priority !== undefined) announcement.priority = priority;
    if (status !== undefined) announcement.status = status;
    if (targetAudience !== undefined) announcement.targetAudience = targetAudience;
    if (courseType !== undefined) announcement.courseType = courseType;
    if (publishDate !== undefined) announcement.publishDate = publishDate;
    if (expiryDate !== undefined) announcement.expiryDate = expiryDate;
    if (metadata !== undefined) announcement.metadata = metadata;

    // Only admins can set global announcements
    if (isGlobal !== undefined && req.user.role === 'ADMIN') {
      announcement.isGlobal = isGlobal;
    }

    await announcement.save();

    const updatedAnnouncement = await Announcement.findByPk(announcement.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.json({
      success: true,
      announcement: updatedAnnouncement
    });
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({
      error: 'Failed to update announcement'
    });
  }
});

// Delete announcement
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const announcement = await Announcement.findByPk(req.params.id);

    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    // Check permissions
    if (req.user.role !== 'ADMIN' && announcement.authorId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await announcement.destroy();

    res.json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({
      error: 'Failed to delete announcement'
    });
  }
});

// Mark announcement as acknowledged
router.post('/:id/acknowledge', authenticate, async (req, res) => {
  try {
    const announcement = await Announcement.findByPk(req.params.id);

    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    const [announcementView, created] = await AnnouncementView.findOrCreate({
      where: {
        announcementId: announcement.id,
        userId: req.user.id
      },
      defaults: {
        announcementId: announcement.id,
        userId: req.user.id,
        viewedAt: new Date(),
        acknowledged: true
      }
    });

    if (!created) {
      announcementView.acknowledged = true;
      announcementView.viewedAt = new Date();
      await announcementView.save();
    }

    res.json({
      success: true,
      message: 'Announcement acknowledged'
    });
  } catch (error) {
    console.error('Error acknowledging announcement:', error);
    res.status(500).json({
      error: 'Failed to acknowledge announcement'
    });
  }
});

// Get announcement analytics (Admin only)
router.get('/analytics/stats', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const totalAnnouncements = await Announcement.count();
    const publishedAnnouncements = await Announcement.count({
      where: { status: 'published' }
    });
    const draftAnnouncements = await Announcement.count({
      where: { status: 'draft' }
    });

    const announcementsByType = await Announcement.findAll({
      attributes: [
        'type',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: 'type'
    });

    const recentAnnouncements = await Announcement.findAll({
      where: {
        createdAt: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      order: [['createdAt', 'DESC']],
      limit: 10,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.json({
      success: true,
      stats: {
        total: totalAnnouncements,
        published: publishedAnnouncements,
        draft: draftAnnouncements,
        byType: announcementsByType.reduce((acc, item) => {
          acc[item.type] = parseInt(item.dataValues.count);
          return acc;
        }, {}),
        recent: recentAnnouncements
      }
    });
  } catch (error) {
    console.error('Error fetching announcement analytics:', error);
    res.status(500).json({
      error: 'Failed to fetch analytics'
    });
  }
});

// Get my announcements (for tutors)
router.get('/my/announcements', authenticate, async (req, res) => {
  try {
    if (!['TUTOR', 'ADMIN'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Only tutors and admins can access this endpoint' });
    }

    const { status, limit = 20, offset = 0 } = req.query;

    const whereClause = { authorId: req.user.id };
    if (status) {
      whereClause.status = status;
    }

    const announcements = await Announcement.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: AnnouncementView,
          as: 'views',
          attributes: ['id', 'userId', 'viewedAt', 'acknowledged'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      announcements: announcements.rows,
      pagination: {
        total: announcements.count,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: announcements.count > parseInt(offset) + parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching my announcements:', error);
    res.status(500).json({
      error: 'Failed to fetch announcements'
    });
  }
});

module.exports = router;