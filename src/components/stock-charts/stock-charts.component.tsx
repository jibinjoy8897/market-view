import React, { useEffect, useState } from "react";
import axios from "axios";
import Chart from "react-apexcharts";
import { charts } from "../../data/chart";
import { demoCSData } from "../../data/dummyCSData";
import { polygonIOData } from "../../data/polygonIOData";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { nasdaqStocks } from "../../data/nasdaqStockDetails";
import { autocompleteDummyData } from "../../data/autocompleteDummy";
import { forexStocks } from "../../data/forexDetails";

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import ReactApexChartsComponent from "./react-apexcharts/react-apexcharts.component";

export const StockChartsComponent: React.FC = () => {
  const [stockData, setStockData] = useState<any[]>([]);
  const [maximumLimitMessage, setMaximumLimitMessage] = useState<string>(null);
  const [selectedTickerDetails, setSelectedTickerDetails] = useState<any>({
    "Company Name": "Apple Inc.",
    "Financial Status": "N",
    "Market Category": "Q",
    "Round Lot Size": 100.0,
    "Security Name": "Apple Inc. - Common Stock",
    Symbol: "AAPL",
    "Test Issue": "N",
  });
  const [stockTickerSymbol, setStockTickerSymbol] = useState<string>("AAPL");
  const [timeframe, setTimeFrame] = useState<string>("1D");
  const [marketType, setMarketType] = useState<string>("nasdaq");

  useEffect(() => {
    setMaximumLimitMessage(null);
    let tf = "";
    if (timeframe === "1D") {
      tf = "1/day";
    } else if (timeframe === "1hr") {
      tf = "1/hour";
    } else if (timeframe === "30min") {
      tf = "30/minute";
    } else if (timeframe === "15min") {
      tf = "15/minute";
    } else if (timeframe === "5min") {
      tf = "5/minute";
    }
    // Replace 'YOUR_API_KEY' with your Polygon.io API key
    const defaultStockTicker = marketType === "nasdaq" ? "AAPL" : "EURUSD";
    const apiKey = "112nYFuYxMpE9koZ8h4grneEERTJLkgb";
    const symbol = stockTickerSymbol ? stockTickerSymbol : defaultStockTicker; // Replace with the desired stock symbol
    const apiUrl = `https://api.polygon.io/v2/aggs/ticker/${
      marketType === "forex" ? "C:" : ""
    }${symbol}/range/${tf}/2023-09-09/${
      new Date().toISOString().split("T")[0]
    }?adjusted=true&sort=asc&limit=120&apiKey=${apiKey}`;

    axios
      .get(apiUrl)
      .then((response) => {
        console.log("APPLE RESPONSE ", response);
        if (response.data.queryCount > 0) {
          const dailyTFPolygonIO = response.data.results;
          const formattedData = dailyTFPolygonIO.map((dayData) => ({
            x: new Date(dayData["t"]),
            y: [
              parseFloat(dayData["o"]),
              parseFloat(dayData["h"]),
              parseFloat(dayData["l"]),
              parseFloat(dayData["c"]),
            ],
          }));
          setStockData(formattedData);
        } else {
          alert(
            "Not able to provide chart data for this stock.Please try another one"
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching stock data:", error);
        if (
          error.response.data.error ===
          "You've exceeded the maximum requests per minute, please wait or upgrade your subscription to continue. https://polygon.io/pricing"
        ) {
          setMaximumLimitMessage(error.response.data.error);
        }
      });
  }, [stockTickerSymbol, timeframe]);

  const timeFrameHandleChange = (event: SelectChangeEvent) => {
    setTimeFrame(event.target.value as string);
  };

  const marketToggleHandleChange = (
    event: React.MouseEvent<HTMLElement>,
    value: any
  ) => {
    setMarketType(value);
    if (value === "nasdaq") {
      setStockTickerSymbol("AAPL");
      setSelectedTickerDetails({
        "Company Name": "Apple Inc.",
        "Financial Status": "N",
        "Market Category": "Q",
        "Round Lot Size": 100.0,
        "Security Name": "Apple Inc. - Common Stock",
        Symbol: "AAPL",
        "Test Issue": "N",
      });
    } else {
      setStockTickerSymbol("EURUSD");
      setSelectedTickerDetails({
        "Security Name": "Euro/US DOLLAR",
        Symbol: "EURUSD",
      });
    }
  };

  return (
    <>
      <span style={{ fontSize: "2rem" }}>
        Market View Powered by{" "}
        <a target="blank" href="https://polygon.io/">
          Polygon.io
        </a>
      </span>
      <Box display="flex" justifyContent="space-between" pt={2}>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={marketType === "nasdaq" ? nasdaqStocks : forexStocks}
          value={selectedTickerDetails}
          getOptionLabel={(option) =>
            option["Security Name"] + `(${option.Symbol})`
          }
          onChange={(event: React.SyntheticEvent, value: any) => {
            if (value) {
              setStockTickerSymbol(value.Symbol);
              setSelectedTickerDetails(value);
            }
          }}
          sx={{ width: "40%" }}
          renderInput={(params) => (
            <TextField {...params} label="NASDAQ Stocks" />
          )}
        />
        <ToggleButtonGroup
          color="primary"
          value={marketType}
          exclusive
          onChange={marketToggleHandleChange}
          aria-label="Platform"
        >
          <ToggleButton value="nasdaq">NASDAQ</ToggleButton>
          <ToggleButton value="forex">FOREX</ToggleButton>
        </ToggleButtonGroup>
        <FormControl sx={{ width: "20%" }}>
          <InputLabel id="time-frame-simple-select-label">
            Time Frame
          </InputLabel>
          <Select
            labelId="time-frame-simple-select-label"
            id="time-frame-simple-select"
            value={timeframe}
            label="Time Frame"
            onChange={timeFrameHandleChange}
          >
            <MenuItem value={"1D"}>1 Day</MenuItem>
            <MenuItem value={"1hr"}>1 Hour</MenuItem>
            <MenuItem value={"30min"}>30 Minute</MenuItem>
            <MenuItem value={"15min"}>15 Minute</MenuItem>
            <MenuItem value={"5min"}>5 Minute</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {maximumLimitMessage ? (
        <h2>
          You've exceeded the maximum requests per minute,Please try again after
          1 minute
        </h2>
      ) : (
        <>
          <h2>Stock Price Chart</h2>
          {stockData.length > 0 ? (
            <ReactApexChartsComponent stockData={stockData} />
          ) : (
            <p>Loading...</p>
          )}
        </>
      )}
    </>
  );
};

export default StockChartsComponent;
