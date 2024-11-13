import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { fetchCoins } from "../api";
import { isDarkAtom } from "../atoms";
import styled from "styled-components";

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

const CoinsList = styled.ul``;

const Coin = styled.li<{ isDark: boolean }>`
  background-color: ${(props) => props.theme.cardBgColor};
  color: ${(props) => props.theme.textColor};
  margin-bottom: 20px;
  border-radius: 15px;
  font-size: 18px;
  display: flex;
  align-items: center;
  border: 1px solid ${(props) => (props.isDark ? "white" : "black")};
  a {
    display: flex;
    align-items: center;
    padding: 20px;
    transition: color 0.2s ease-in-out;
    width: 100%;
  }

  &:hover {
    a {
      color: ${(props) => props.theme.accentColor};
    }
  }
`;

const CoinImage = styled.img`
  width: 35px;
  height: 35px;
  margin-right: 10px;
`;

const Title = styled.h1`
  font-size: 50px;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
  text-align: center;
  font-size: 32px;
  display: block;
`;

const ToggleSwitch = styled.div<{ isDark: boolean }>`
  position: absolute;
  right: 0;
  width: 50px;
  height: 24px;
  background-color: ${(props) => (props.isDark ? "#4D4D4D" : "#ccc")};
  border-radius: 24px;
  cursor: pointer;
  margin-left: 20px;
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.isDark ? "flex-end" : "flex-start")};
  padding: 0 5px;
`;

const Icon = styled.span`
  font-size: 16px;
`;

interface CoinInterface {
  id: string;
  name: string;
  symbol: string;
  image: string;
}

function Coins() {
  const setToggle = useSetRecoilState(isDarkAtom);
  const isDark = useRecoilValue(isDarkAtom);
  const { isLoading, data } = useQuery<CoinInterface[]>("allCoins", fetchCoins);

  return (
    <Container>
      <Helmet>
        <title>코인</title>
      </Helmet>
      <Header>
        <Title>코인</Title>
        <ToggleSwitch
          isDark={isDark}
          onClick={() => setToggle((current) => !current)}
        >
          <Icon>{isDark ? "🌛" : "🌞"}</Icon>
        </ToggleSwitch>
      </Header>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <CoinsList>
          {data?.map((coin) => (
            <Coin key={coin.id} isDark={isDark}>
              <Link
                to={{
                  pathname: `/${coin.id}`,
                  state: {
                    name: coin.name,
                  },
                }}
              >
                <CoinImage src={coin.image} alt={coin.name} />
                {coin.name} &rarr;
              </Link>
            </Coin>
          ))}
        </CoinsList>
      )}
    </Container>
  );
}

export default Coins;
