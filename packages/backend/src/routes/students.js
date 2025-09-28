const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const {
  createStudent,
  updateStudent,
  getAllStudents,
  getStudent,
  toggleStudentFeature,
  deleteStudent,
  getAllFeatures
} = require('../controllers/studentController');

// All routes require admin authentication
router.use(requireAuth, requireAdmin);

// Get all available features
router.get('/features', getAllFeatures);

// Get all students
router.get('/', getAllStudents);

// Create a new student
router.post('/', createStudent);

// Get a single student
router.get('/:id', getStudent);

// Update a student
router.patch('/:id', updateStudent);

// Toggle a feature for a student
router.patch('/:id/features', toggleStudentFeature);

// Delete a student
router.delete('/:id', deleteStudent);

module.exports = router;