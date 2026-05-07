// routes/auth.js
const express  = require('express');
const jwt      = require('jsonwebtoken');
const passport = require('passport');
const User     = require('../models/User');
const router   = express.Router();

const ADMIN_EMAILS = [
  '11alex.julio@inscollbato.cat',
  'alex137julio@gmail.com'
];

function generateToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// ── POST /api/auth/login ──
// Login con email + contraseña
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email y contraseña requeridos.' });

  if (!ADMIN_EMAILS.includes(email.toLowerCase()))
    return res.status(403).json({ message: 'Este email no tiene permisos de admin.' });

  try {
    let user = await User.findOne({ email: email.toLowerCase() });

    // Si el usuario no existe, créalo (primera vez)
    if (!user) {
      user = new User({ email: email.toLowerCase(), password, isAdmin: true });
      await user.save();
    } else {
      const match = await user.comparePassword(password);
      if (!match) return res.status(401).json({ message: 'Contraseña incorrecta.' });
    }

    const token = generateToken(user);
    res.json({ token, email: user.email, isAdmin: user.isAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor.' });
  }
});

// ── GET /api/auth/google ──
// Iniciar flujo OAuth con Google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// ── GET /api/auth/google/callback ──
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/?error=google' }),
  (req, res) => {
    const token = generateToken(req.user);
    const isAdmin = ADMIN_EMAILS.includes(req.user.email);
    // Redirigir al frontend con el token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5500';
    res.redirect(`${frontendUrl}?token=${token}&email=${req.user.email}&isAdmin=${isAdmin}`);
  }
);

module.exports = router;
