import React, { useState } from "react";
import "./DisheList.css";
import CommonTable from "../../common/CommonTable";
import DishDetails from "../DishDetail/DishDetails";

const DisheList = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedRow(null);
    setIsModalOpen(false);
  };

  const fetchData = async (queryParams) => {
    const url = new URL("http://localhost:5000/dish/getAllDish");
    Object.keys(queryParams).forEach((key) =>
      url.searchParams.append(key, queryParams[key])
    );
    console.log(url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return await response.json();
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Dish Name",
      enableSorting: true,
      enableFiltering: true,
    },
    {
      accessorKey: "prepTime",
      header: "Prep Time",
      enableSorting: true,
      enableFiltering: false,
    },
    {
      accessorKey: "cookTime",
      header: "Cook Time",
      enableSorting: true,
      enableFiltering: false,
    },
    {
      accessorKey: "diet",
      header: "Diet",
      enableFiltering: true,
    },
    {
      accessorKey: "flavor",
      header: "flavor",
      enableSorting: false,
      enableFiltering: true,
    },
    {
      accessorKey: "state",
      header: "State",
      enableSorting: false,
      enableFiltering: true,
    },
    {
      accessorKey: "region",
      header: "Region",
      enableSorting: false,
      enableFiltering: true,
    },
    {
      accessorKey: "course",
      header: "course",
      enableSorting: false,
      enableFiltering: true,
    },
    {
      header: "Action",
      accessorKey: "action",
      cell: ({ row }) => (
        <button
          key={row.original.id}
          onClick={() => handleOpenModal(row.original)}
        >
          Dish Detail
        </button>
      ),
    },
  ];

  return (
    <>
      <CommonTable fetchData={fetchData} columns={columns} />
      <DishDetails
        open={isModalOpen}
        onClose={handleCloseModal}
        data={selectedRow}
      />
    </>
  );
};

export default DisheList;
