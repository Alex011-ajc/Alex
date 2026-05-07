// server.js — Servidor principal de AniRank
require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const mongoose   = require('mongoose');
const passport   = require('passport');

const authRoutes  = require('./routes/auth');
const animeRoutes = require('./routes/animes');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── CORS ──
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5500',
    'http://127.0.0.1:5500',
    'https://anirank.vercel.app'   // cambia por tu dominio real
  ],
  credentials: true
}));

app.use(express.json());
app.use(passport.initialize());

// ── PASSPORT GOOGLE ──
require('./config/passport')(passport);

// ── RUTAS ──
app.use('/api/auth',   authRoutes);
app.use('/api/animes', animeRoutes);

// Ruta de prueba
app.get('/', (req, res) => res.json({ message: 'AniRank API funcionando 🎌' }));

// ── MONGODB ──
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB conectado');
    app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ Error MongoDB:', err.message);
    process.exit(1);
  });
