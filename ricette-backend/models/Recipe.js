const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  ingredients: {
    type: [String],
    required: true,
    minlength: 1, // almeno un ingrediente
  },
  steps: {
    type: [String],
    required: true,
    minlength: 1, // almeno un passaggio
  },
  category: {
    type: String,
    enum: ["Primo", "Secondo", "Contorno", "Dolce", "Altro"], // opzionale ma utile
    default: "Altro",
  },
  imageUrl: {
    type: String,
    default: "https://via.placeholder.com/300x200?text=No+Image",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Recipe", RecipeSchema);
