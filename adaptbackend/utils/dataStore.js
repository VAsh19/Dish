const parseCsv = require("./csvParser");

let dishes = [];
let ingredients = new Set();

const initializeDataStore = async (csvFilePath) => {
  const rawData = await parseCsv(csvFilePath);
  //   console.log(rawData);
  rawData.forEach((row, index) => {
    const dishName = row.name;
    const ingredientList = row.ingredients.split(",").map((i) => i.trim());

    // Add dish to the array
    dishes.push({
      id: index + 1,
      name: dishName,
      ingredients: ingredientList,
      diet: row.diet,
      prepTime:
        parseInt(row.prep_time, 10) == -1 ? 0 : parseInt(row.prep_time, 10),
      cookTime:
        parseInt(row.cook_time, 10) == -1 ? 0 : parseInt(row.cook_time, 10),
      flavor: row.flavor_profile == -1 ? "ALL" : row.flavor_profile,
      course: row.course,
      state: row.state == -1 ? "ALL" : row.state,
      region: row.region == -1 ? "ALL" : row.region,
    });

    // Add ingredients and map them to the dish
    ingredientList.forEach((ingredient) => {
      ingredients.add(ingredient.trim().toLowerCase());
    });
  });
};

const getDishes = () => dishes;
const getIngredients = () => Array.from(ingredients);

module.exports = {
  initializeDataStore,
  getDishes,
  getIngredients,
};
