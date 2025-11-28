const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");

router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore server" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Ricetta non trovata" });
    }
    res.json(recipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore server" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, ingredients, steps, category } = req.body;

    const newRecipe = new Recipe({
      title,
      description,
      ingredients,
      steps,
      category,
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore server" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { title, description, ingredients, steps, category } = req.body;

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { title, description, ingredients, steps, category },
      { new: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: "Ricetta non trovata" });
    }

    res.json(updatedRecipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore server" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!deletedRecipe) {
      return res.status(404).json({ message: "Ricetta non trovata" });
    }
    res.json({ message: "Ricetta eliminata" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore server" });
  }
});

module.exports = router;
