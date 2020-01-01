import React from "react";

import logo from "./logo.svg";
import "./App.css";
import Tick from "./components/tick";
import Search from "./components/search";

function App() {
  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <Tick />
      <Search />
    </div>
  );
}

export default App;
