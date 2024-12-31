import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
function DishDetails({ open, onClose, data }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Dish Details</DialogTitle>
      <DialogContent>
        {data ? (
          <div>
            <p>
              <strong>Name:</strong> {data.name}
            </p>
            <p>
              <strong>Prep Time:</strong> {data.prepTime}
            </p>
            <p>
              <strong>Cook Time:</strong> {data.cookTime}
            </p>
            <p>
              <strong>Flavor:</strong> {data.flavor}
            </p>
            <p>
              <strong>Course:</strong> {data.course}
            </p>
            <p>
              <strong>State:</strong> {data.state}
            </p>
            <p>
              <strong>Region:</strong> {data.region}
            </p>
            {data.ingredients.length > 0 && (
              <ul>
                <strong>Ingredients:</strong>
                {data.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <p>No data available.</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DishDetails;
