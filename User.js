// models/User.js
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const ADMIN_EMAILS = [
  '11alex.julio@inscollbato.cat',
  'alex137julio@gmail.com'
];

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    // No requerido para usuarios Google
  },
  googleId: String,
  isAdmin: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Hashear contraseña antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  // Auto-asignar admin si el email está en la lista
  this.isAdmin = ADMIN_EMAILS.includes(this.email);
  next();
});

userSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
