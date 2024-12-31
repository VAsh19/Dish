import React, { useState, useCallback } from "react";
import { debounce } from "../../utils/Utilis";
import "./AutoCompleteSearch.css";

const AutoCompleteSearch = ({ handleOptionClick, apiUrl, placeholder }) => {
  const [searchText, setSearchText] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);

  async function getAllData(query) {
    if (query && query.length > 0) {
      try {
        const url = new URL(apiUrl);
        url.searchParams.append("searchText", query);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        let dishData = await response.json();
        setFilteredOptions(dishData.data || []);
      } catch (error) {}
    } else {
      setFilteredOptions([]);
    }
  }
  const handleSearch = useCallback(debounce(getAllData, 300), []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    handleSearch(value);
  };

  return (
    <>
      <div className="autocomplete-container">
        <input
          type="text"
          value={searchText}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="autocomplete-input"
        />
        {filteredOptions.length > 0 && (
          <ul className="autocomplete-list">
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                onClick={() => handleOptionClick(option)}
                className="autocomplete-item"
              >
                {option?.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default AutoCompleteSearch;
