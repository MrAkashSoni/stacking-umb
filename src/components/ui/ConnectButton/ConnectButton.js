import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Layer } from "components/ui";
import { useContract } from "utils/store";

import { useHistory } from "react-router-dom";

import { wallets, chainData, HOW_TO, REWARDS } from "utils/constants";
import { truncate } from "utils/formatters";

import { CardIcon } from "assets/images";

import "./connectButton.scss";
import { useWallet } from "utils/store/Wallet";
import { getScanUrlFromChain } from "utils/urls";

const propTypes = {
  label: PropTypes.string,
  redirectTo: PropTypes.string,
  disabled: PropTypes.bool,
};

const defaultProps = {
  label: undefined,
  redirectTo: undefined,
  disabled: false,
};

const getConnector = (id = "injected", connectors) => {
  const connector = connectors.find((conn) => conn.id === id);

  if (connector) {
    return connector;
  }

  return connectors.find((conn) => conn.id === "injected");
};

function ConnectButton({ label, redirectTo, disabled }) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    connect,
    connectors,
    address,
    isConnected,
    chain,
    toggleUnavailableModal,
  } = useWallet();

  const {
    state: { isLoading },
  } = useContract();

  const history = useHistory();

  const connected = isConnected && address && !chain?.unsupported;

  const scanUrl = getScanUrlFromChain(chainData, chain?.id);

  const url =
    connected && !redirectTo ? `${scanUrl}/address/${address}` : undefined;

  const networkLabel = connected ? truncate(address) : "Connect Wallet";

  const icon = !label ? CardIcon : undefined;

  const pathname = history.location.pathname.split("/");

  const pathsNotToDisplayButton = [HOW_TO, REWARDS];

  const shouldDisplayButton = !pathsNotToDisplayButton.some((path) =>
    pathname.includes(path)
  );

  const selectCallback = () => {
    redirectTo && history.push(redirectTo);
    setIsOpen(false);
  };

  function handleWalletClick(connectorId) {
    connect({
      connector: getConnector(connectorId, connectors),
    });
    setIsOpen(false);
  }

  const handleClick = () => {
    if (isConnected && chain?.unsupported) {
      toggleUnavailableModal();
      return;
    }

    isConnected ? selectCallback() : setIsOpen(true);
  };

  return (
    <>
      {isOpen && (
        <Layer
          className="wallets-layer"
          close={() => setIsOpen(false)}
          fillMobile
        >
          <div className="wallets-layer-wrapper">
            {wallets.map(({ title, connectorId, icon: Icon }) => (
              <Button
                key={`connect-to-${title}-container`}
                className="wallet-container"
                type="plain"
                icon={Icon}
                label={title}
                handleClick={() => handleWalletClick(connectorId)}
              />
            ))}
          </div>
        </Layer>
      )}
      {shouldDisplayButton ? (
        <Button
          type="primary"
          disabled={isLoading || disabled}
          handleClick={handleClick}
          label={label ?? networkLabel}
          url={url}
          icon={icon}
        />
      ) : null}
    </>
  );
}

ConnectButton.propTypes = propTypes;
ConnectButton.defaultProps = defaultProps;

export default ConnectButton;
