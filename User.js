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
  },
  googleId: String,
  isAdmin: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.isAdmin = ADMIN_EMAILS.includes(this.email);
  next();
});

userSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
