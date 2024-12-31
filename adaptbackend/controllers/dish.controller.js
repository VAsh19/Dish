const { getDishes, getIngredients } = require("../utils/dataStore");

const getDishById = (req, res) => {
  try {
    let dish = getDishes().filter((ele) => ele.id == req.params.id);
    res.status(200).json({
      data: dish,
    });
  } catch (error) {}
};

const getAllDish = (req, res) => {
  try {
    const {
      sort = "name:asc",
      page = 0,
      pageSize = 15,
      filters = "{}",
      searchText = "",
    } = req.query;

    const pageNum = parseInt(page, 10);
    const pageSizeNum = parseInt(pageSize, 10);
    // Parse filters from the query string
    let dishes = getDishes();

    const parsedFilters = JSON.parse(filters);

    // Apply filtering
    if (Object.keys(parsedFilters).length > 0) {
      dishes = dishes.filter((dish) => {
        return Object.entries(parsedFilters).every(([key, value]) => {
          return dish[key] == "ALL" //  we will always send this to UI
            ? true
            : dish[key]?.toString().toLowerCase().includes(value.toLowerCase());
        });
      });
    }

    // search based on searchInput
    if (searchText != null && searchText.length != 0) {
      dishes = dishes.filter((ele, index) => {
        // based on dishName
        if (ele?.name?.toLowerCase()?.includes(searchText?.toLowerCase())) {
          return true;
        }

        // based on ingredients
        let ingredeintAvail = ele?.ingredients?.some((ingredient) =>
          ingredient?.toLowerCase()?.includes(searchText)
        );

        if (ingredeintAvail) return true;

        // based on region/state =>
        if (
          ele?.state?.toLowerCase()?.includes(searchText?.toLowerCase()) ||
          ele?.region.toLowerCase()?.includes(searchText?.toLowerCase())
        ) {
          return true;
        }

        if (ele?.region == -1 || ele?.state == -1) return true;

        return false;
      });
    }

    // Perform multi-column sorting
    const sortFields = [];
    const orderFields = [];

    sort.split(",").forEach((ele) => {
      const individualSortDetail = ele?.split(":");
      sortFields.push(individualSortDetail[0]);
      orderFields.push(individualSortDetail[1]);
    });

    console.log(sortFields, orderFields, "harshit");
    let sortedDishes = [...dishes];

    sortedDishes.sort((a, b) => {
      for (let i = 0; i < sortFields.length; i++) {
        const field = sortFields[i];
        const sortOrder = orderFields[i] === "desc" ? -1 : 1;

        const fieldA = a[field];
        const fieldB = b[field];

        if (fieldA < fieldB) return -1 * sortOrder;
        if (fieldA > fieldB) return 1 * sortOrder;
      }
      return 0; // If all fields are equal
    });

    // Calculate start and end indices for pagination
    const startIndex = pageNum * pageSizeNum;
    const endIndex = startIndex + pageSizeNum;

    // Slice the sorted dishes for the current page
    const paginatedDishes = sortedDishes.slice(startIndex, endIndex);

    res.status(200).json({
      data: paginatedDishes,
      totalCount: dishes.length, // Total number of dishes
      count: paginatedDishes.length, // Number of dishes in the current page
    });
  } catch (error) {
    console.log("" + error);
  }
};

const getSuggestedDish = (req, res) => {
  const { selectedIngredients } = req.body;

  if (!selectedIngredients || selectedIngredients.length === 0) {
    return res.status(200).json({ error: "No ingredients provided" });
  }

  const matchingDishes = getDishes().filter((dish) =>
    dish.ingredients.every((ingredient) =>
      selectedIngredients.includes(ingredient.trim().toLowerCase())
    )
  );
  res.status(200).json({ dishes: matchingDishes });
};

const getAllIngredient = (req, res) => {
  const { searchText = "" } = req.query;
  let ingredient;
  if (searchText != null && searchText.length != 0) {
    ingredient = getIngredients().filter((ingr) =>
      ingr?.toLowerCase()?.includes(searchText?.toLowerCase())
    );
  }

  ingredient = ingredient?.map((ele, index) => {
    return {
      id: index + 1,
      name: ele,
    };
  });
  return res.status(200).json({
    data: ingredient,
  });
};

module.exports = {
  getDishById,
  getAllDish,
  getSuggestedDish,
  getAllIngredient,
};
