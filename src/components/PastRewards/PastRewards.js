import React, { useEffect, useState, useReducer } from "react";
import { BigNumber } from "ethers";

import { useParams, useHistory } from "react-router-dom";

import { useWallet } from "utils/store/Wallet";
import { useContract } from "utils/store";
import { LoadingState, Card, ChainIndicator, Heading } from "components/ui";
import { contracts, chainData, contractAddresses } from "utils/constants";

import { collectSymbols, collectBalances } from "utils/services";

import { truncate } from "utils/formatters";

import { Transactions } from "components";

import WithdrawCard from "./WithdrawCard";
import DetailsCard from "./DetailsCard";

import "./pastRewards.scss";
import { getScanUrlFromChain } from "utils/urls";

const TOKEN_SYMBOLS_SET = "TOKEN_SYMBOLS_SET";
const TOKEN_BALANCES_SET = "TOKEN_BALANCES_SET";

const initialState = {
  shouldRefreshValues: true,
  rToken: {
    symbol: "rUMB",
    balance: BigNumber.from(0),
  },
  token: {
    symbol: "UMB",
    balance: BigNumber.from(0),
  },
};

function reducer(state, action) {
  switch (action.type) {
    case TOKEN_SYMBOLS_SET:
      return {
        ...state,
        rToken: {
          ...state.rToken,
          symbol: action.payload.rewardsToken,
        },
        token: {
          ...state.token,
          symbol: action.payload.mainToken,
        },
      };
    case TOKEN_BALANCES_SET:
      return {
        ...state,
        shouldRefreshValues: false,
        rToken: {
          ...state.rToken,
          balance: action.payload.rewardsToken,
        },
        token: {
          ...state.token,
          balance: action.payload.mainToken,
        },
      };
    default:
      return state;
  }
}

function PastRewards() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    shouldRefreshValues,
    rToken: { symbol: rewardsToken, balance: rewardsTokenBalance },
    token: { symbol: mainToken, balance: mainTokenBalance },
  } = state;

  const { id, stream } = useParams();
  const [tokenInfo, setTokenInfo] = useState();
  const isLoading = !tokenInfo;
  const history = useHistory();

  const { address, currentChain, chainId } = useWallet();

  const scanUrl = getScanUrlFromChain(chainData, chainId);

  const {
    state: {
      user: {
        token,
        rToken: { symbol: currentRewardsSymbol },
      },
    },
  } = useContract();

  const currentContractAddress = currentChain
    ? contractAddresses[currentChain][stream]
    : undefined;

  useEffect(() => {
    if (!isLoading && shouldRefreshValues) {
      const { tokenAddress, rewardsTokenAddress } = tokenInfo;

      collectSymbols(
        ([{ tokenSymbol: rewardsToken }, { tokenSymbol: mainToken }]) =>
          dispatch({
            type: TOKEN_SYMBOLS_SET,
            payload: { rewardsToken, mainToken },
          }),
        [rewardsTokenAddress, tokenAddress]
      );
      collectBalances(
        ([{ tokenBalance: rewardsToken }, { tokenBalance: mainToken }]) =>
          dispatch({
            type: TOKEN_BALANCES_SET,
            payload: { rewardsToken, mainToken },
          }),
        [rewardsTokenAddress, tokenAddress],
        [address]
      );
    }

    /* eslint-disable-next-line */
  }, [isLoading, shouldRefreshValues]);

  useEffect(() => {
    if (currentChain) {
      const { options } = contracts[stream];
      const { pastIterations } = options[currentChain];

      const hasIteration = pastIterations
        .map((iteration) => iteration.address)
        .includes(id);

      const tokenInfo = token[stream]?.pastIterations[id];

      if (!hasIteration) {
        history.push("/");
      } else if (tokenInfo) {
        setTokenInfo(tokenInfo);
      }
    }
  }, [currentChain, history, id, stream, token]);

  return (
    <>
      {isLoading ? (
        <LoadingState />
      ) : (
        <div className="past-rewards">
          <div className="past-rewards__welcome-message">
            <div className="title">
              <Heading type="secondary" highlightSpan size={1}>
                Rewards
              </Heading>
              <p className="subtitle">
                Claim Your <span>{rewardsToken}</span> Tokens
              </p>
            </div>
            <ChainIndicator />
            <div className="staking-info-container">
              <Card className="staking-info staking-info--token-contracts">
                <p className="text">
                  {mainToken} Contract
                  <br />
                  <br />
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`${scanUrl}/token/${tokenInfo.tokenAddress}`}
                  >
                    {truncate(tokenInfo.tokenAddress)}
                  </a>
                </p>
                <div className="divisor" />
                <p className="text">
                  {rewardsToken} Contract
                  <br />
                  <br />
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`${scanUrl}/token/${tokenInfo.rewardsTokenAddress}`}
                  >
                    {truncate(tokenInfo.rewardsTokenAddress)}
                  </a>
                </p>
              </Card>
              <Card className="staking-info">
                <p className="text">
                  {`${mainToken}-${rewardsToken}`} Staking Contract
                  <br />
                  <br />
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`${scanUrl}/address/${id}`}
                  >
                    {truncate(id)}
                  </a>
                </p>
              </Card>
            </div>
          </div>
          <div className="past-rewards__wrapper">
            <WithdrawCard
              contractAddress={id}
              currentContractAddress={currentContractAddress}
              totalStaked={tokenInfo.staked}
              mainToken={mainToken}
              rewardsToken={rewardsToken}
              currentRewardsSymbol={currentRewardsSymbol}
              stream={stream}
            />
            <DetailsCard
              mainToken={mainToken}
              mainTokenBalance={mainTokenBalance}
              rewardsToken={rewardsToken}
              rewardsTokenBalance={rewardsTokenBalance}
              contractAddress={id}
              totalStaked={tokenInfo.staked}
              earned={tokenInfo.earned}
              stream={stream}
            />
            <p className="rewards-disclaimer">
              <span>Please notice:</span> your tokens are not generating{" "}
              {rewardsToken} anymore. You need to restake them for{" "}
              {currentRewardsSymbol}.
            </p>
            <Transactions />
          </div>
        </div>
      )}
    </>
  );
}

export default PastRewards;
