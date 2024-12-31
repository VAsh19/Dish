const express = require("express");
const router = express.Router();

const {
  getDishById,
  getAllDish,
  getSuggestedDish,
  getAllIngredient,
} = require("../controllers/dish.controller");

router.get("/getDishById/:id", getDishById);
router.get("/getAllDish", getAllDish);
router.post("/getSuggestedDish", getSuggestedDish);
router.get("/getAllIngredient", getAllIngredient);

module.exports = router;
