import {
  Route,
  Switch,
  useLocation,
  useParams,
  useRouteMatch,
  Link,
} from "react-router-dom";
import { useQuery } from "react-query";
import { Helmet } from "react-helmet";

import { useRecoilValue } from "recoil";

import { fetchCoinInfo } from "../api";
import { isDarkAtom } from "../atoms";

import styled from "styled-components";
import Price from "./Price";
import Chart from "./Chart";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 720px;
  margin: 0 auto;
`;
const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const InfoImage = styled.img`
  margin-right: 10px;
`;

const Title = styled.h1`
  font-size: 50px;
  color: ${(props) => props.theme.accentColor};
  display: flex;
  a {
    left: 0;
    position: absolute;
  }
`;

const CoinWrapper = styled.div<{ isDark: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: 20px 25px;
  border-radius: 15px;
  margin-bottom: 30px;
  background-color: ${(props) =>
    props.isDark ? "black" : "rgba(0, 0, 0, 0.5)"};
`;

const CoinInfos = styled.div<{ isDark: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  span {
    text-transform: uppercase;
    color: ${(props) => (props.isDark ? "white" : "black")};
    &:first-child {
      opacity: 0.7;
      margin-bottom: 5px;
      font-size: 15px;
    }
    &:last-child {
      font-size: 22px;
    }
  }
`;

const Description = styled.p`
  margin: 20px 0px;
  margin-bottom: 30px;
  color: ${(props) => props.theme.textColor};
  font-size: 15px;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;

const Tab = styled.span<TabProps>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 7px 0px;
  border-radius: 10px;
  color: ${(props) =>
    props.$isActive ? props.theme.accentColor : props.theme.textColor};

  a {
    display: block;
  }
`;

interface TabProps {
  $isActive: Boolean;
}

interface CoinType {
  coinId: string;
}

interface CoinState {
  name: string;
}

interface CoinInfo {
  id: string;
  symbol: string;
  name: string;
  web_slug: string;
  asset_platform_id: object;
  platforms: object;
  detail_platforms: object;
  block_time_in_minutes: number;
  hashing_algorithm: string;
  categories: object;
  preview_listing: boolean;
  public_notice: object;
  additional_notices: object;
  localization: object;
  description: { en: string };
  links: object;
  image: { small: string };
  country_origin: string;
  genesis_date: string;
  sentiment_votes_up_percentage: number;
  sentiment_votes_down_percentage: number;
  watchlist_portfolio_users: number;
  market_cap_rank: number;
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    total_volume: { usd: number };
  };
  community_data: object;
  developer_data: object;
  status_updates: object;
  last_updated: string;
  tickers: object;
}

function Coin() {
  const { coinId } = useParams<CoinType>();
  const { state } = useLocation<CoinState>();

  const { isLoading, data: coinInfo } = useQuery<CoinInfo>(
    ["coinInfo", coinId],
    () => fetchCoinInfo(coinId)
  );

  const priceMatch = useRouteMatch("/:coinId/price");
  const chartMatch = useRouteMatch("/:coinId/chart");
  const isDark = useRecoilValue(isDarkAtom);
  return (
    <Container>
      <Helmet>
        <title>
          {state?.name || (isLoading ? "Loading..." : coinInfo?.name)}
        </title>
      </Helmet>
      <Header>
        <Title>
          <Link to={"/"}>&larr;</Link>

          {coinInfo?.image && (
            <InfoImage src={coinInfo.image.small} alt={coinInfo.name} />
          )}
          {state?.name || (isLoading ? "Loading..." : coinInfo?.name)}
        </Title>
      </Header>

      <CoinWrapper isDark={isDark}>
        <CoinInfos isDark={isDark}>
          <span>순위 :</span>
          <span>{coinInfo?.market_cap_rank}</span>
        </CoinInfos>

        <CoinInfos isDark={isDark}>
          <span>현재 가격 :</span>
          <span>
            ${coinInfo?.market_data?.current_price.usd.toLocaleString()}
          </span>
        </CoinInfos>

        <CoinInfos isDark={isDark}>
          <span>최초 발행일 :</span>
          <span>{coinInfo?.genesis_date || "N/A"}</span>
        </CoinInfos>
      </CoinWrapper>

      <Description>
        {coinInfo?.description.en
          ? coinInfo.description.en.length > 350
            ? `${coinInfo.description.en.slice(0, 350)}...`
            : coinInfo.description.en
          : "loading"}
      </Description>

      <Tabs>
        <Tab $isActive={chartMatch !== null}>
          <Link to={`/${coinId}/chart`}>Chart</Link>
        </Tab>
        <Tab $isActive={priceMatch !== null}>
          <Link to={`/${coinId}/price`}>Price</Link>
        </Tab>
      </Tabs>

      <Switch>
        <Route path="/:coinId/price">
          <Price coinId={coinId} />
        </Route>

        <Route path="/:coinId/chart">
          <Chart coinId={coinId} />
        </Route>
      </Switch>
    </Container>
  );
}
export default Coin;
