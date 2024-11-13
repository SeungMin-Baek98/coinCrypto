import { useQuery } from "react-query";

import { fetchCoinPriceHistory } from "../api";

import styled from "styled-components";

interface PriceProps {
  coinId: string;
}

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); // 2 열
  gap: 20px;
  max-width: 720px;
  margin: 0 auto;
`;

const GridItem = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 15px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

function Price({ coinId }: PriceProps) {
  const { isLoading, data } = useQuery(["priceHistory", coinId], () =>
    fetchCoinPriceHistory(coinId, "usd", 30)
  );

  // 특정 간격에 따른 최고 가격 계산
  const getHighestPrices = (prices: [number, number][]) => {
    const intervals = [
      { label: "1시간 전", hours: 1 },
      { label: "3시간 전", hours: 3 },
      { label: "10시간 전", hours: 10 },
      { label: "하루 전", hours: 24 },
      { label: "5일 전", hours: 24 * 5 },
      { label: "15일 전", hours: 24 * 15 },
      { label: "30일 전", hours: 24 * 30 },
    ];

    const now = Date.now();
    return intervals.map(({ label, hours }) => {
      const cutoffTime = now - hours * 60 * 60 * 1000;
      const filteredPrices = prices.filter(
        ([timestamp]) => timestamp >= cutoffTime
      );
      const highestPrice = Math.max(
        ...filteredPrices.map(([, price]) => price)
      );
      return { label, highestPrice: highestPrice || "N/A" };
    });
  };

  const highestPrices = data ? getHighestPrices(data.prices) : [];

  return (
    <Container>
      {isLoading ? (
        <GridItem>Loading data...</GridItem>
      ) : (
        highestPrices.map(({ label, highestPrice }) => (
          <GridItem key={label}>
            <h4>{label}</h4>
            <p>
              {typeof highestPrice === "number"
                ? `$${highestPrice.toFixed(2)}`
                : "N/A"}
            </p>
          </GridItem>
        ))
      )}
    </Container>
  );
}

export default Price;
