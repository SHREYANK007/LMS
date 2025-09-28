const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');
const { SupportTicket, SupportTicketReply, User, TutorStudent } = require('../models');

// Create a new support ticket (Students only)
const createSupportTicket = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category = 'general',
    priority = 'medium',
    tags = [],
    assignedTutorId: assignedTutorIdFromBody,
    tutorId
  } = req.body;
  const studentId = req.user.id;

  if (!title || !description) {
    return res.status(400).json({
      error: 'Title and description are required'
    });
  }

  // Validate category
  const validCategories = ['technical', 'academic', 'billing', 'general', 'feedback'];
  if (!validCategories.includes(category)) {
    return res.status(400).json({
      error: 'Invalid category. Must be one of: technical, academic, billing, general, feedback'
    });
  }

  // Validate priority
  const validPriorities = ['low', 'medium', 'high', 'urgent'];
  if (!validPriorities.includes(priority)) {
    return res.status(400).json({
      error: 'Invalid priority. Must be one of: low, medium, high, urgent'
    });
  }

  // Only students can create tickets
  if (req.user.role !== 'STUDENT') {
    return res.status(403).json({
      error: 'Only students can create support tickets'
    });
  }

  try {
    const requestedTutorId = assignedTutorIdFromBody || tutorId || null;
    let assignedTutorId = null;

    if (requestedTutorId) {
      const assignment = await TutorStudent.findOne({
        where: {
          student_id: studentId,
          tutor_id: requestedTutorId
        }
      });

      if (!assignment) {
        return res.status(400).json({
          error: 'Selected tutor is not assigned to this student'
        });
      }

      assignedTutorId = requestedTutorId;
    } else {
      const fallbackAssignment = await TutorStudent.findOne({
        where: { student_id: studentId },
        order: [['assigned_at', 'ASC']]
      });

      if (fallbackAssignment) {
        assignedTutorId = fallbackAssignment.tutor_id;
      }
    }

    // Generate ticket number manually
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
    const ticketNumber = `TK-${year}-${randomNum}`;

    const ticket = await SupportTicket.create({
      title,
      description,
      category,
      priority,
      studentId,
      ticketNumber,
      assignedTutorId,
      tags: Array.isArray(tags) ? tags : [],
      metadata: {
        userAgent: req.headers['user-agent'] || '',
        ip: req.ip,
        createdAt: new Date()
      }
    });

    const createdTicket = await SupportTicket.findByPk(ticket.id, {
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'assignedTutor',
          attributes: ['id', 'name', 'email'],
          required: false
        }
      ]
    });

    res.status(201).json({
      success: true,
      ticket: createdTicket
    });
  } catch (error) {
    console.error('Error creating support ticket:', error);
    res.status(500).json({
      error: 'Failed to create support ticket'
    });
  }
});

// Get tickets based on user role
const getSupportTickets = asyncHandler(async (req, res) => {
  const { status, category, priority, limit = 20, offset = 0, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
  const user = req.user;

  let whereClause = {};
  let includeClause = [
    {
      model: User,
      as: 'student',
      attributes: ['id', 'name', 'email']
    },
    {
      model: User,
      as: 'assignedTutor',
      attributes: ['id', 'name', 'email'],
      required: false
    },
    {
      model: User,
      as: 'assignedAdmin',
      attributes: ['id', 'name', 'email'],
      required: false
    }
  ];

  // Role-based filtering
  if (user.role === 'STUDENT') {
    whereClause.studentId = user.id;
  } else if (user.role === 'TUTOR') {
    whereClause.assignedTutorId = user.id;
  }
  // Admins can see all tickets

  // Apply filters
  if (status) {
    whereClause.status = status;
  }
  if (category) {
    whereClause.category = category;
  }
  if (priority) {
    whereClause.priority = priority;
  }

  try {
    const tickets = await SupportTicket.findAndCountAll({
      where: whereClause,
      include: includeClause,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      tickets: tickets.rows,
      pagination: {
        total: tickets.count,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: tickets.count > parseInt(offset) + parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    res.status(500).json({
      error: 'Failed to fetch support tickets'
    });
  }
});

// Get a specific ticket by ID
const getSupportTicketById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  try {
    const ticket = await SupportTicket.findByPk(id, {
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'assignedTutor',
          attributes: ['id', 'name', 'email'],
          required: false
        },
        {
          model: User,
          as: 'assignedAdmin',
          attributes: ['id', 'name', 'email'],
          required: false
        },
        {
          model: SupportTicketReply,
          as: 'replies',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email', 'role']
            }
          ],
          order: [['createdAt', 'ASC']]
        }
      ]
    });

    if (!ticket) {
      return res.status(404).json({
        error: 'Support ticket not found'
      });
    }

    // Check access permissions
    const hasAccess =
      user.role === 'ADMIN' ||
      (user.role === 'STUDENT' && ticket.studentId === user.id) ||
      (user.role === 'TUTOR' && ticket.assignedTutorId === user.id);

    if (!hasAccess) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    res.json({
      success: true,
      ticket
    });
  } catch (error) {
    console.error('Error fetching support ticket:', error);
    res.status(500).json({
      error: 'Failed to fetch support ticket'
    });
  }
});

// Update ticket status (Tutors and Admins)
const updateSupportTicket = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, assignedTutorId, assignedAdminId, priority, tags } = req.body;
  const user = req.user;

  if (!['TUTOR', 'ADMIN'].includes(user.role)) {
    return res.status(403).json({
      error: 'Only tutors and admins can update support tickets'
    });
  }

  try {
    const ticket = await SupportTicket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({
        error: 'Support ticket not found'
      });
    }

    // Check if tutor can update this ticket
    if (user.role === 'TUTOR' && ticket.assignedTutorId !== user.id) {
      return res.status(403).json({
        error: 'Tutors can only update tickets assigned to them'
      });
    }

    const updateData = {};

    if (status !== undefined) {
      const validStatuses = ['open', 'in_progress', 'waiting_for_response', 'resolved', 'closed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          error: 'Invalid status'
        });
      }
      updateData.status = status;

      // Set timestamps based on status
      if (status === 'resolved') {
        updateData.resolvedAt = new Date();
      } else if (status === 'closed') {
        updateData.closedAt = new Date();
      }
    }

    // Only admins can assign/reassign tickets
    if (user.role === 'ADMIN') {
      if (assignedTutorId !== undefined) updateData.assignedTutorId = assignedTutorId;
      if (assignedAdminId !== undefined) updateData.assignedAdminId = assignedAdminId;
      if (priority !== undefined) updateData.priority = priority;
      if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : [];
    }

    await ticket.update(updateData);

    const updatedTicket = await SupportTicket.findByPk(id, {
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'assignedTutor',
          attributes: ['id', 'name', 'email'],
          required: false
        },
        {
          model: User,
          as: 'assignedAdmin',
          attributes: ['id', 'name', 'email'],
          required: false
        }
      ]
    });

    res.json({
      success: true,
      ticket: updatedTicket
    });
  } catch (error) {
    console.error('Error updating support ticket:', error);
    res.status(500).json({
      error: 'Failed to update support ticket'
    });
  }
});

// Add a reply to a ticket
const addTicketReply = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { message, isInternal = false } = req.body;
  const user = req.user;

  if (!message || message.trim() === '') {
    return res.status(400).json({
      error: 'Message is required'
    });
  }

  try {
    const ticket = await SupportTicket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({
        error: 'Support ticket not found'
      });
    }

    // Check access permissions
    const hasAccess =
      user.role === 'ADMIN' ||
      (user.role === 'STUDENT' && ticket.studentId === user.id) ||
      (user.role === 'TUTOR' && ticket.assignedTutorId === user.id);

    if (!hasAccess) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    // Only staff can create internal replies
    const isInternalReply = isInternal && ['TUTOR', 'ADMIN'].includes(user.role);

    const reply = await SupportTicketReply.create({
      ticketId: id,
      userId: user.id,
      message: message.trim(),
      isInternal: isInternalReply
    });

    // Update ticket status if student replies
    if (user.role === 'STUDENT' && ticket.status === 'waiting_for_response') {
      await ticket.update({ status: 'open' });
    }

    const createdReply = await SupportTicketReply.findByPk(reply.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'role']
        }
      ]
    });

    res.status(201).json({
      success: true,
      reply: createdReply
    });
  } catch (error) {
    console.error('Error adding ticket reply:', error);
    res.status(500).json({
      error: 'Failed to add reply'
    });
  }
});

// Get dashboard stats (Tutors and Admins)
const getSupportStats = asyncHandler(async (req, res) => {
  if (!['TUTOR', 'ADMIN'].includes(req.user.role)) {
    return res.status(403).json({
      error: 'Tutor or admin access required'
    });
  }

  try {
    const totalTickets = await SupportTicket.count();
    const openTickets = await SupportTicket.count({ where: { status: 'open' } });
    const inProgressTickets = await SupportTicket.count({ where: { status: 'in_progress' } });
    const resolvedTickets = await SupportTicket.count({ where: { status: 'resolved' } });
    const closedTickets = await SupportTicket.count({ where: { status: 'closed' } });

    const ticketsByCategory = await SupportTicket.findAll({
      attributes: [
        'category',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: 'category'
    });

    const ticketsByPriority = await SupportTicket.findAll({
      attributes: [
        'priority',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: 'priority'
    });

    const recentTickets = await SupportTicket.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.json({
      success: true,
      stats: {
        total: totalTickets,
        open: openTickets,
        inProgress: inProgressTickets,
        resolved: resolvedTickets,
        closed: closedTickets,
        byCategory: ticketsByCategory.reduce((acc, item) => {
          acc[item.category] = parseInt(item.dataValues.count);
          return acc;
        }, {}),
        byPriority: ticketsByPriority.reduce((acc, item) => {
          acc[item.priority] = parseInt(item.dataValues.count);
          return acc;
        }, {}),
        recent: recentTickets
      }
    });
  } catch (error) {
    console.error('Error fetching support stats:', error);
    res.status(500).json({
      error: 'Failed to fetch support statistics'
    });
  }
});

module.exports = {
  createSupportTicket,
  getSupportTickets,
  getSupportTicketById,
  updateSupportTicket,
  addTicketReply,
  getSupportStats
};
