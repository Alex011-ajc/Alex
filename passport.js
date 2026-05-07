// config/passport.js
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

const ADMIN_EMAILS = [
  '11alex.julio@inscollbato.cat',
  'alex137julio@gmail.com'
];

module.exports = (passport) => {
  passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  process.env.GOOGLE_CALLBACK_URL
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value.toLowerCase();
      const isAdmin = ADMIN_EMAILS.includes(email);

      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = await User.findOne({ email });
        if (user) {
          user.googleId = profile.id;
          await user.save();
        } else {
          user = await User.create({
            email,
            googleId: profile.id,
            isAdmin
          });
        }
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }));
};
