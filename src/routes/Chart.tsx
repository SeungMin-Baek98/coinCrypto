import { useQuery } from "react-query";

import { useRecoilValue } from "recoil";

import { fetchCoinHistory } from "../api";
import { isDarkAtom } from "../atoms";

import ReactApexChart from "react-apexcharts";

interface IHistorical {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface ChartProps {
  coinId: string;
}

function Chart({ coinId }: ChartProps) {
  const $isDark = useRecoilValue(isDarkAtom);
  const { isLoading, data } = useQuery<IHistorical[]>(["ohlcv", coinId], () =>
    fetchCoinHistory(coinId).then((rawData) =>
      rawData.map((ohlc: [number, number, number, number, number]) => ({
        timestamp: ohlc[0],
        open: ohlc[1],
        high: ohlc[2],
        low: ohlc[3],
        close: ohlc[4],
      }))
    )
  );

  // 캔들스틱 차트 데이터 구성
  const candlestickData = data?.map((ohlc) => ({
    x: new Date(ohlc.timestamp),
    y: [ohlc.open, ohlc.high, ohlc.low, ohlc.close],
  }));

  // 라인 차트 데이터 구성 (종가만 사용)
  const lineData = data?.map((ohlc) => ({
    x: new Date(ohlc.timestamp),
    y: ohlc.close,
  }));

  return (
    <div>
      {isLoading ? (
        "Loading chart..."
      ) : (
        <ReactApexChart
          type="candlestick"
          series={[
            {
              name: "Candlestick",
              type: "candlestick",
              data: candlestickData ?? [],
            },
            {
              name: "Close Price",
              type: "line",
              data: lineData ?? [],
            },
          ]}
          options={{
            theme: {
              mode: $isDark ? "dark" : "light",
            },
            chart: {
              height: 500,
              toolbar: {
                show: true,
              },
              background: "transparent",
            },
            xaxis: {
              type: "datetime",
              labels: {
                datetimeFormatter: { month: "MMM 'yy", day: "dd MMM" },
              },
            },
            yaxis: [
              {
                tooltip: {
                  enabled: true,
                },
              },
            ],
            grid: { show: false },
            stroke: {
              curve: "smooth",
              width: 2,
            },
            colors: ["#FF4560", "#00E396"],
          }}
        />
      )}
    </div>
  );
}

export default Chart;
