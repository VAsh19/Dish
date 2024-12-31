import React, { useState } from "react";
import DishDetails from "../DishDetail/DishDetails";
import "./Header.css";
import { Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import AutoCompleteSearch from "../../common/autoCompleteSearch/AutoCompleteSearch";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (row) => {
    console.log(row);
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedRow(null);
    setIsModalOpen(false);
  };

  // Handle option selection
  const handleOptionClick = (option) => {
    handleOpenModal(option);
  };
  return (
    <>
      <header className="header">
        <h1 className="header-title">Dishes</h1>
        <AutoCompleteSearch
          handleOptionClick={handleOptionClick}
          apiUrl={"http://localhost:5000/dish/getAllDish"}
          placeholder={"search by dishName , ingredeint , state , region"}
        />

        <Button
          variant="contained"
          style={{
            position: "absolute",
            right: 0,
            top: "1em",
          }}
          onClick={() =>
            location.pathname == "/dish-suggester"
              ? navigate("/")
              : navigate("/dish-suggester")
          }
        >
          {location.pathname == "/dish-suggester"
            ? "Go to Dish List Page"
            : "Go to Dish Suggest Page"}
        </Button>
      </header>

      <DishDetails
        open={isModalOpen}
        onClose={handleCloseModal}
        data={selectedRow}
      />
    </>
  );
};

export default Header;
