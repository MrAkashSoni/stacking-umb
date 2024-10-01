import React, { useEffect } from "react";

import { useContract, stakingContractSet } from "utils/store";
import { useWallet } from "utils/store/Wallet";

import { useParams, useHistory } from "react-router-dom";
import { availableStreams } from "utils/constants";

import { LoadingState } from "components/ui";

function WithWallet({ children, strict = true }) {
  const { isConnected, isConnectedProperly, isCorrectNetwork, chainId } =
    useWallet();

  const {
    state: {
      stakingContractSymbol,
      isLoading,
      user: {
        rToken: { symbol },
      },
    },
    dispatch,
  } = useContract();

  const isReady = Boolean(
    isConnectedProperly &&
      !isLoading &&
      symbol &&
      stakingContractSymbol &&
      chainId
  );

  const { id, stream } = useParams();
  const history = useHistory();

  let contract;

  if (history.location.pathname === "/redeem/rumb1") {
    contract = "hadley";
  } else {
    contract = stream ?? id;
  }

  const isContractAvailable = availableStreams.includes(contract);
  const returnToHome = () => history.push("/");

  if (!isContractAvailable || (isReady && !isConnectedProperly)) {
    returnToHome();
  }

  useEffect(() => {
    if (!isCorrectNetwork && isConnected && strict) {
      returnToHome();
    }

    /* eslint-disable-next-line */
  }, [isConnected]);

  useEffect(() => {
    if (isContractAvailable) {
      dispatch(stakingContractSet(contract));
    }

    /* eslint-disable-next-line */
  }, [isContractAvailable]);

  if (!isReady && strict) {
    return (
      <>
        {!isConnectedProperly && (
          <h1
            style={{
              fontFamily: "Inter",
              textAlign: "center",
              fontWeight: "500",
              marginBottom: "40px",
            }}
          >
            Please reconnect your wallet!
          </h1>
        )}
        <LoadingState />
      </>
    );
  }

  return children;
}

export default WithWallet;
