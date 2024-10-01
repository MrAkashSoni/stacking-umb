import React from "react";
import { useHistory, useLocation } from "react-router-dom";

import { useTutorial, startTutorial } from "utils/store/Tutorial";

import { availableStreams } from "utils/constants";

import {
  DiscordIcon,
  GithubIcon,
  MediumIcon,
  TelegramIcon,
  TwitterIcon,
} from "assets/icons";
import { UmbrellaFullLogoWhite } from "assets/images";

import "./footer.scss";
import { last } from "ramda";

const sections = [
  [
    {
      title: "Main Menu",
      items: [
        { label: "Staking", destination: "/" },
        { label: "UMB Bridge", url: "https://bridge.umb.network" },
        { label: "Main Website", url: "https://umb.network" },
        {
          label: "Tutorial",
          onClick: "tutorial",
          stakingOnly: true,
        },
      ],
    },
    {
      title: "Community",
      items: [
        {
          label: "Token Terms and Conditions",
          url: "https://www.umb.network/token-terms-and-conditions",
        },
        {
          label: "Privacy Policy",
          url: "https://www.umb.network/privacy-policy",
        },
        { label: "Github", url: "https://github.com/umbrella-network" },
      ],
    },
  ],
  [
    {
      title: "Developers",
      items: [
        { label: "Block Explorer", url: "https://explorer.umb.network/" },
        {
          label: "Documentation",
          url: "https://umbrella-network.readme.io/docs",
        },
        { label: "Developer Portal", url: "https://portal.umb.network/" },
      ],
    },
    {
      title: "Social",
      items: [
        {
          label: "Medium",
          icon: <MediumIcon />,
          url: "https://medium.com/umbrella-network",
        },
        {
          label: "Telegram",
          icon: <TelegramIcon />,
          url: "https://t.me/umbrellanet",
        },
        {
          label: "Twitter",
          icon: <TwitterIcon />,
          url: "https://twitter.com/umbnetwork",
        },
        {
          label: "Discord",
          icon: <DiscordIcon />,
          url: "https://discord.gg/QEatbAm8ey",
        },
        {
          label: "Github",
          icon: <GithubIcon />,
          url: "https://github.com/umbrella-network",
        },
      ],
    },
    {
      title: "Technical Support",
      items: [
        { label: "Our Support Channel", url: "https://discord.gg/9eG9F4nMcj" },
      ],
    },
  ],
];

function Footer() {
  const { pathname } = useLocation();
  const history = useHistory();

  const { dispatch } = useTutorial();

  const tutorialCallback = () => dispatch(startTutorial());

  const handleClick = (destination) => {
    if (pathname !== destination) {
      history.push(destination);
    }
  };

  const isStaking = availableStreams.includes(
    last(history.location.pathname.split("/"))
  );

  return (
    <div className="footer">
      <div className="footer__content">
        <img
          className="footer__full-logo"
          src={UmbrellaFullLogoWhite}
          alt="Umbrella Network Logo"
        />

        <div className="footer__section-wrapper">
          {sections.map((sectionsGroup, index) => (
            <div
              className="footer__sections-group"
              key={`footer__sections-group-${index}`}
            >
              {sectionsGroup.map(({ title, items }) => (
                <div
                  className="footer__section"
                  key={`footer__section-${title}`}
                >
                  <h4>{title}</h4>

                  <div className="footer__section-items">
                    {items.map(
                      ({
                        label,
                        icon,
                        url,
                        destination,
                        onClick,
                        stakingOnly,
                      }) => {
                        return (
                          ((stakingOnly && isStaking) ||
                            stakingOnly === undefined) && (
                            <div
                              key={`footer__section-items-${title}-${label}`}
                            >
                              <a
                                className="footer__anchor"
                                onClick={
                                  onClick === "tutorial"
                                    ? tutorialCallback
                                    : () => handleClick(destination)
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                href={url}
                              >
                                {icon}
                                <span>{label}</span>
                              </a>
                            </div>
                          )
                        );
                      }
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Footer;
