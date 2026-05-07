// middleware/auth.js
const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const ADMIN_EMAILS = [
  '11alex.julio@inscollbato.cat',
  'alex137julio@gmail.com'
];

// Verificar que el token JWT es válido
exports.protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No autorizado. Token requerido.' });
  }
  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'Usuario no encontrado.' });
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};

// Verificar que el usuario es admin
exports.adminOnly = (req, res, next) => {
  if (!req.user || !ADMIN_EMAILS.includes(req.user.email)) {
    return res.status(403).json({ message: 'Acceso denegado. Solo administradores.' });
  }
  next();
};
