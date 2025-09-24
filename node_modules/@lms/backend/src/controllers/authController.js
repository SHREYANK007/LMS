const asyncHandler = require('express-async-handler');
const { User } = require('../models');
const { comparePassword, generateToken } = require('../utils/auth');

const login = asyncHandler(async (req, res) => {
  console.log('Login attempt received:', { email: req.body.email, hasPassword: !!req.body.password });
  const { email, password } = req.body;

  if (!email || !password) {
    console.log('Missing email or password');
    return res.status(400).json({
      error: 'Email and password are required'
    });
  }

  const user = await User.findOne({
    where: { email }
  });

  if (!user) {
    console.log('User not found:', email);
    return res.status(401).json({
      error: 'Invalid credentials'
    });
  }

  console.log('User found, checking password...');
  const isValid = await comparePassword(password, user.passwordHash);

  if (!isValid) {
    console.log('Invalid password for user:', email);
    return res.status(401).json({
      error: 'Invalid credentials'
    });
  }

  const token = generateToken(user);
  console.log('Login successful for:', email, 'Role:', user.role);

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  });
});

module.exports = {
  login
};