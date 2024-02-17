import React from "react";
import "./App.css";
import StockChartsComponent from "./components/stock-charts/stock-charts.component";

function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
    <div
      style={{
        backgroundColor: "rgb(27 205 172)",
        padding: "0.5rem",
        // width: "calc(100%)",
        // height: "calc(100%)",
      }}
    >
      <StockChartsComponent />
    </div>
  );
}

export default App;
