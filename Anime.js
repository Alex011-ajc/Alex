const mongoose = require('mongoose');

const animeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    maxlength: [200, 'Nombre demasiado largo']
  },
  image: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    maxlength: [1000, 'Descripción demasiado larga'],
    default: ''
  },
  score: {
    type: Number,
    required: true,
    min: [1, 'La nota mínima es 1'],
    max: [10, 'La nota máxima es 10']
  }
}, { timestamps: true });

module.exports = mongoose.model('Anime', animeSchema);
