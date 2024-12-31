import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Chip, Grid, Typography, Card, CardContent } from "@mui/material";
import AutoCompleteSearch from "../../common/autoCompleteSearch/AutoCompleteSearch";

const DishSuggest = () => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [suggestedDishes, setSuggestedDishes] = useState([]);

  const handleRemoveIngredient = (ingredientToRemove) => {
    setSelectedIngredients(
      selectedIngredients.filter((ing) => ing !== ingredientToRemove)
    );
  };

  const handleFetchSuggestions = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/dish/getSuggestedDish",
        {
          selectedIngredients,
        }
      );
      setSuggestedDishes(response.data.dishes);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  // Handle AddIngredient selection
  const handleAddIngredient = (ingredient) => {
    let ingredientName = ingredient?.name.trim().toLowerCase();
    if (!selectedIngredients.includes(ingredientName)) {
      setSelectedIngredients([...selectedIngredients, ingredientName]);
    }
  };

  useEffect(() => {
    if (selectedIngredients.length > 0) handleFetchSuggestions();
  }, [selectedIngredients]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>
        Dish Suggester
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <AutoCompleteSearch
          handleOptionClick={handleAddIngredient}
          apiUrl={"http://localhost:5000/dish/getAllIngredient"}
          placeholder={"Search by Ingredients"}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        {selectedIngredients?.map((ing) => (
          <Chip
            key={ing}
            label={ing}
            onDelete={() => handleRemoveIngredient(ing)}
            sx={{ mr: 1, mb: 1 }}
          />
        ))}
      </Box>

      <Grid container spacing={2}>
        {suggestedDishes && suggestedDishes?.length > 0 ? (
          suggestedDishes?.map((dish) => (
            <Grid item xs={12} sm={6} md={4} key={dish.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{dish.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Diet: {dish.diet}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Prep Time: {dish.prepTime} mins
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cook Time: {dish.cookTime} mins
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ingredients: {dish.ingredients.join(", ")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>
            No dishes available for the selected ingredients.
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default DishSuggest;
