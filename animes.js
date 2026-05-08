const express = require('express');
const Anime   = require('./Anime');
const { protect, adminOnly } = require('./middleware_auth');
const router  = express.Router();

router.get('/', async (req, res) => {
  try {
    const animes = await Anime.find().sort({ score: -1 });
    res.json(animes);
  } catch (err) {
    res.status(500).json({ message: 'Error.' });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  const { name, image, description, score } = req.body;
  if (!name) return res.status(400).json({ message: 'Nombre obligatorio.' });
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
  try {
    const anime = await Anime.findByIdAndUpdate(req.params.id, { name, image, description, score }, { new: true });
    if (!anime) return res.status(404).json({ message: 'No encontrado.' });
    res.json(anime);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Anime.findByIdAndDelete(req.params.id);
    res.json({ message: 'Eliminado.' });
  } catch (err) {
    res.status(500).json({ message: 'Error.' });
  }
});

module.exports = router;
