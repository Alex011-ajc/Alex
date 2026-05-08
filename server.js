require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const mongoose   = require('mongoose');
const passport   = require('passport');

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5500',
    'http://127.0.0.1:5500',
  ],
  credentials: true
}));

app.use(express.json());
app.use(passport.initialize());

require('./pasaporte')(passport);

const authRoutes  = require('./auth');
const animeRoutes = require('./animes');

app.use('/api/auth',   authRoutes);
app.use('/api/animes', animeRoutes);

app.get('/', (req, res) => res.json({ message: 'AniRank API funcionando 🎌' }));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB conectado');
    app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ Error MongoDB:', err.message);
    process.exit(1);
  });
