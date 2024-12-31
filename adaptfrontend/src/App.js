import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DisheList from "./components/DishList/DisheList";
import Header from "./components/Header/Header";
import DishSuggest from "./components/dishSuggester/DishSuggest";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<DisheList />} />
          <Route path="/dish-suggester" element={<DishSuggest />} />
        </Routes>
      </Router>
      {/* <DishSuggest /> */}
    </div>
  );
}

export default App;
