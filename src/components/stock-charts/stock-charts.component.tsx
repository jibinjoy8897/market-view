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
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
} from "@mui/material";

export const StockChartsComponent: React.FC = () => {
  const [stockData, setStockData] = useState<any[]>([]);
  const [maximumLimitMessage, setMaximumLimitMessage] = useState<string>(null);
  const [stockTicker, setStockTicker] = useState<string>("AAPL");
  const [timeframe, setTimeFrame] = useState<string>("1D");

  // useEffect(() => {
  //   // Replace 'YOUR_API_KEY' with your Alpha Vantage API key
  //   const apiKey = "8CTAR04JWTWNGY5N";
  //   const symbol = "AAPL"; // Replace with the desired stock symbol
  //   const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

  //   const formattedData = Object.keys(charts).map((date) => ({
  //     x: new Date(date).getTime(),
  //     //   y: parseFloat(charts[date]["4. close"]),
  //     y: [
  //       parseFloat(charts[date]["1. open"]),
  //       parseFloat(charts[date]["2. high"]),
  //       parseFloat(charts[date]["3. low"]),
  //       parseFloat(charts[date]["4. close"]),
  //     ],
  //   }));

  //   setStockData(formattedData);
  //   console.log("CS DATA>>>", formattedData);
  //   // setStockData(demoCSData);

  //   // axios
  //   //   .get(apiUrl)
  //   //   .then((response) => {
  //   //     console.log("APPLE RESPONSE ", response);
  //   //     downloadJSON(response.data);
  //   //     const timeSeriesData = response.data["Time Series (Daily)"];
  //   //     const formattedData = Object.keys(timeSeriesData).map((date) => ({
  //   //       x: new Date(date),
  //   //       //   y: parseFloat(timeSeriesData[date]["4. close"]),
  //   //       y: [
  //   //         parseFloat(timeSeriesData[date]["1. open"]),
  //   //         parseFloat(timeSeriesData[date]["2. high"]),
  //   //         parseFloat(timeSeriesData[date]["3. low"]),
  //   //         parseFloat(timeSeriesData[date]["4. close"]),
  //   //       ],
  //   //     }));

  //   //     setStockData(formattedData);
  //   //   })
  //   //   .catch((error) => {
  //   //     console.error("Error fetching stock data:", error);
  //   //   });
  // }, []);

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
    const apiKey = "112nYFuYxMpE9koZ8h4grneEERTJLkgb";
    const symbol = stockTicker ? stockTicker : "AAPL"; // Replace with the desired stock symbol
    const apiUrl = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/${tf}/2023-09-09/${
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

    // const formattedData = polygonIOData.map((dayData) => ({
    //   x: new Date(dayData["t"]),
    //   y: [
    //     parseFloat(dayData["o"].toString()),
    //     parseFloat(dayData["h"].toString()),
    //     parseFloat(dayData["l"].toString()),
    //     parseFloat(dayData["c"].toString()),
    //   ],
    // }));
    // setStockData(formattedData);
  }, [stockTicker, timeframe]);

  const downloadJSON = (data) => {
    var dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(data));
    var downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "chart" + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const chartOptions = {
    options: {
      xaxis: {
        type: "datetime",
      },
    },
    series: [
      {
        name: "Stock Price",
        data: stockData,
      },
    ],
  };

  const timeFrameHandleChange = (event: SelectChangeEvent) => {
    setTimeFrame(event.target.value as string);
  };

  return (
    <>
      <span style={{ fontSize: "2rem" }}>
        Market View Powered by <a target="blank" href="https://polygon.io/">Polygon.io</a>
      </span>
      <Box display="flex" justifyContent="space-between" pt={2}>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={nasdaqStocks}
          defaultValue={{
            "Company Name": "Apple Inc.",
            "Financial Status": "N",
            "Market Category": "Q",
            "Round Lot Size": 100.0,
            "Security Name": "Apple Inc. - Common Stock",
            Symbol: "AAPL",
            "Test Issue": "N",
          }}
          getOptionLabel={(option) =>
            option["Security Name"] + `(${option.Symbol})`
          }
          onChange={(event: React.SyntheticEvent, value: any) => {
            if (value) {
              setStockTicker(value.Symbol);
            }
          }}
          sx={{ width: "40%" }}
          renderInput={(params) => (
            <TextField {...params} label="NASDAQ Stocks" />
          )}
        />
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
            <Chart
              type="candlestick"
              options={{
                xaxis: {
                  type: "datetime",
                },

                yaxis: {
                  tooltip: {
                    enabled: true,
                  },
                },
                plotOptions: {
                  candlestick: {
                    colors: {
                      upward: "#28ED12",
                      downward: "#FB0A0A",
                    },
                  },
                },
              }}
              series={chartOptions.series}
              height={450}
            />
          ) : (
            <p>Loading...</p>
          )}
        </>
      )}
    </>
  );
};

export default StockChartsComponent;
