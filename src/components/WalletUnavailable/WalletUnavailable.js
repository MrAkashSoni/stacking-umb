import React, { useEffect, useRef } from "react";

import { Button, Layer } from "components/ui";
import { wallets, allowedNetworks, chainData } from "utils/constants";

import "./walletUnavailable.scss";
import { useWallet } from "utils/store/Wallet";

function WalletUnavailable() {
  const hasEthereumInstance = window.ethereum || window.BinanceChain;

  const { isUnavailableModalOpen, toggleUnavailableModal } = useWallet();

  const overlayRef = useRef();

  useEffect(() => {
    if (isUnavailableModalOpen && overlayRef.current) {
      overlayRef.current.scrollIntoView();
    }
    /* eslint-disable-next-line */
  }, [isUnavailableModalOpen]);

  const allowedNetworksText = allowedNetworks
    .map((id) => chainData[id].networkFullName)
    .join(", ");

  return isUnavailableModalOpen ? (
    <Layer title="Wallet unavailable" close={toggleUnavailableModal} fillMobile>
      <div className="wallet-unavailable">
        {hasEthereumInstance ? (
          <p>
            *Please make sure you have a wallet in your browser and are
            connected to one of the following networks: {allowedNetworksText}.
          </p>
        ) : (
          <>
            <p>
              *We couldn&apos;t detect a wallet in your browser. Click below to
              get one.
            </p>
            <div className="wallets">
              {wallets.map(({ title, icon, url }) => (
                <Button
                  url={url}
                  icon={icon}
                  type="plain"
                  key={`get-wallet-${title}-button`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </Layer>
  ) : null;
}

export default WalletUnavailable;
