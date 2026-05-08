const express = require('express');
const Anime   = require('../models/Anime');
const { protect, adminOnly } = require('../middleware/auth');
const router  = express.Router();

router.get('/', async (req, res) => {
  try {
    const animes = await Anime.find().sort({ score: -1, createdAt: -1 });
    res.json(animes);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener animes.' });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  const { name, image, description, score } = req.body;
  if (!name) return res.status(400).json({ message: 'El nombre es obligatorio.' });
  try {
    const anime = new Anime({ name, image, description, score });
    await anime.save();
    res.status(201).json(anime);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  const { name, image, description, score } = req.body;
  if (!name) return res.status(400).json({ message: 'El nombre es obligatorio.' });
  try {
    const anime = await Anime.findByIdAndUpdate(
      req.params.id,
      { name, image, description, score },
      { new: true, runValidators: true }
    );
    if (!anime) return res.status(404).json({ message: 'Anime no encontrado.' });
    res.json(anime);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const anime = await Anime.findByIdAndDelete(req.params.id);
    if (!anime) return res.status(404).json({ message: 'Anime no encontrado.' });
    res.json({ message: 'Anime eliminado.' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar.' });
  }
});

module.exports = router;
