// api.ts
const BASE_URL = "https://api.coingecko.com/api/v3";

export function fetchCoins() {
  // 시가총액 순으로 코인 목록 가져오기
  return fetch(
    `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1`
  ).then((response) => response.json());
}

export function fetchCoinInfo(coinId: string) {
  // 특정 코인 정보 가져오기
  return fetch(`${BASE_URL}/coins/${coinId}?localization=false`).then(
    (response) => response.json()
  );
}

export function fetchCoinHistory(
  coinId: string,
  vsCurrency = "usd",
  days = 30
) {
  return fetch(
    `${BASE_URL}/coins/${coinId}/ohlc?vs_currency=${vsCurrency}&days=${days}`
  ).then((response) => response.json());
}

export function fetchCoinPriceHistory(
  coinId: string,
  vsCurrency = "usd",
  days = 1
) {
  // 특정 기간 동안 시간대별 가격 데이터 가져오기
  return fetch(
    `${BASE_URL}/coins/${coinId}/market_chart?vs_currency=${vsCurrency}&days=${days}`
  ).then((response) => response.json());
}
