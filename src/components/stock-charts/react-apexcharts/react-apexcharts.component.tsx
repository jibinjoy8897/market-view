import Chart from "react-apexcharts";

interface ReactApexChartsProps {
  stockData: any[];
}

export const ReactApexChartsComponent: React.FC<ReactApexChartsProps> = (
props
) => {
  const { stockData } = props;
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

  return (
    <>
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
    </>
  );
};
export default ReactApexChartsComponent;
