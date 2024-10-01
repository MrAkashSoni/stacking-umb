import React, { useState } from "react";

import classnames from "classnames";

import { Dropdown } from "components";
import { ConnectButton } from "components/ui";

import { useClickOutsideListenerRef } from "utils/hooks";

import { CloseIcon, HamburgerIcon, UmbrellaFullLogo } from "assets/images";

import "./header.scss";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleIsMenuOpen = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const ref = useClickOutsideListenerRef(closeMenu);

  return (
    <div className="header">
      <div className="header__wrapper" ref={ref}>
        <div className="header__content">
          <div className="header__menu">
            <a className="header__logo" href="/">
              <img src={UmbrellaFullLogo} alt="Umbrella Network Logo" />
            </a>
            <div
              className={classnames("header__menu-items", {
                "header__menu-items--mobileStyle": isMenuOpen,
              })}
            >
              <div className="menu-item">
                <Dropdown type="staking" title="Stake" />
              </div>
              <div className="menu-item">
                <a
                  className="header__link"
                  target="_blank"
                  onClick={closeMenu}
                  rel="noopener noreferrer"
                  href="https://bridge.umb.network"
                >
                  UMB Bridge
                </a>
              </div>
              <div className="menu-item">
                <a
                  className="header__link"
                  target="_blank"
                  onClick={closeMenu}
                  rel="noopener noreferrer"
                  href="https://umb.network"
                >
                  Main website
                </a>
              </div>
            </div>
          </div>

          <div className="header__misc">
            <ConnectButton />
            <div className="header__icon-wrapper">
              <img
                src={isMenuOpen ? CloseIcon : HamburgerIcon}
                onClick={toggleIsMenuOpen}
                className="header__icon"
                alt="header menu icon"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
