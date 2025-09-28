const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { getTutorAssignedStudents } = require('../controllers/tutorController');
const { SessionRequest, User } = require('../models');

// All routes require tutor authentication
router.use(authenticate);
router.use(authorize('TUTOR'));

// Get assigned students for the current tutor
router.get('/students', getTutorAssignedStudents);

// Get session requests assigned to the current tutor
router.get('/session-requests', async (req, res) => {
  try {
    const requests = await SessionRequest.findAll({
      where: { tutorId: req.user.id },
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, requests });
  } catch (error) {
    console.error('Error fetching tutor session requests:', error);
    res.status(500).json({ error: 'Failed to fetch session requests' });
  }
});

module.exports = router;