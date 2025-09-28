const asyncHandler = require('express-async-handler');
const { User, Feature } = require('../models');
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

  // First find the user
  let user = await User.findOne({
    where: { email }
  });

  // If user is a student, fetch with features
  if (user && user.role === 'STUDENT') {
    user = await User.findOne({
      where: { email },
      include: [{
        model: Feature,
        as: 'features',
        through: {
          attributes: ['enabled']
        }
      }]
    });
  }

  if (!user) {
    console.log('User not found:', email);
    return res.status(401).json({
      error: 'Invalid credentials'
    });
  }

  // Check if account is active
  if (!user.isActive) {
    console.log('Account is deactivated:', email);
    return res.status(403).json({
      error: 'Your account has been deactivated. Please contact an administrator.',
      code: 'ACCOUNT_DEACTIVATED'
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

  // Build response with features if student
  const userData = {
    id: user.id,
    email: user.email,
    role: user.role
  };

  if (user.role === 'STUDENT' && user.features) {
    userData.enabledFeatures = user.features
      .filter(f => f.StudentFeature.enabled)
      .map(f => f.key);
  }

  res.json({
    success: true,
    token,
    user: userData
  });
});

module.exports = {
  login
};