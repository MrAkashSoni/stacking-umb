import React from "react";
import PropTypes from "prop-types";

import { Button, Heading } from "components/ui";
import Highlighter from "react-highlight-words";

import { QustionInfoAlt } from "assets/images";

import { WAITING, SUCCESS } from "utils/constants";

import { useTranslation } from "react-i18next";

import StakingCardMock from "./StakingCardMock";
import RewardsCardMock from "./RewardsCardMock";

import "../StakingCard/stakingCard.scss";

const propTypes = {
  keyWords: PropTypes.array.isRequired,
};

function HowToTutorial({ keyWords }) {
  const { t } = useTranslation("tutorial");

  return (
    <div className="subsection">
      <p className="faq-item__text">
        <Highlighter
          className="faq-item__text"
          textToHighlight={t("intro.body1")}
          highlightClassName="faq-item__text--highlight"
          searchWords={keyWords}
          autoEscape={true}
        />{" "}
        <a href="#add-liquidity">
          <Highlighter
            className="faq-item__text"
            textToHighlight={t("intro.link1")}
            highlightClassName="faq-item__text--highlight"
            searchWords={keyWords}
            autoEscape={true}
          />
        </a>
        <Highlighter
          className="faq-item__text"
          textToHighlight={t("intro.body2")}
          highlightClassName="faq-item__text--highlight"
          searchWords={keyWords}
          autoEscape={true}
        />
      </p>

      <p className="faq-item__text">
        <Highlighter
          className="faq-item__text"
          textToHighlight={t("intro.body3")}
          highlightClassName="faq-item__text--highlight"
          searchWords={keyWords}
          autoEscape={true}
        />{" "}
        <a
          href="https://staking.umb.network/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Highlighter
            className="faq-item__text"
            textToHighlight={t("intro.link2")}
            highlightClassName="faq-item__text--highlight"
            searchWords={keyWords}
            autoEscape={true}
          />
        </a>
        <Highlighter
          className="faq-item__text"
          textToHighlight={t("intro.body4")}
          highlightClassName="faq-item__text--highlight"
          searchWords={keyWords}
          autoEscape={true}
        />
        <br />
        <br />
        <Highlighter
          className="faq-item__text"
          textToHighlight={t("intro.body5")}
          highlightClassName="faq-item__text--highlight"
          searchWords={keyWords}
          autoEscape={true}
        />
        <br />
        <br />
        <Highlighter
          className="faq-item__text"
          textToHighlight={t("intro.body6")}
          highlightClassName="faq-item__text--highlight"
          searchWords={keyWords}
          autoEscape={true}
        />
      </p>

      <Heading size={4} highlightSpan type="plain">
        {t("step1.title")}
      </Heading>
      <Highlighter
        className="faq-item__text"
        textToHighlight={t("step1.body")}
        highlightClassName="faq-item__text--highlight"
        searchWords={keyWords}
        autoEscape={true}
      />
      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "170px",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            background: "rgba(0,0,0,0)",
            width: "100%",
            height: "100%",
          }}
        />
        <Button
          disabled={false}
          label="Connect Wallet"
          handleClick={() => {}}
        />
      </div>

      <Heading size={4} highlightSpan type="plain">
        {t("step2.title")}
      </Heading>
      <p className="faq-item__text">
        <Highlighter
          className="faq-item__text"
          textToHighlight={t("step2.body1")}
          highlightClassName="faq-item__text--highlight"
          searchWords={keyWords}
          autoEscape={true}
        />
        <br />
        <br />
        <Highlighter
          className="faq-item__text"
          textToHighlight={t("step2.body2")}
          highlightClassName="faq-item__text--highlight"
          searchWords={keyWords}
          autoEscape={true}
        />
      </p>

      <StakingCardMock position={0} />

      <p className="faq-item__text">
        <Highlighter
          textToHighlight={t("step2.body3")}
          highlightClassName="faq-item__text--highlight"
          searchWords={keyWords}
          autoEscape={true}
        />
        <br />
        <br />
        <Highlighter
          textToHighlight={t("step2.body4")}
          highlightClassName="faq-item__text--highlight"
          searchWords={keyWords}
          autoEscape={true}
        />
        <br />
        <br />
        <Highlighter
          textToHighlight={t("step2.body5")}
          highlightClassName="faq-item__text--highlight"
          searchWords={keyWords}
          autoEscape={true}
        />
        <br />
        <br />
        <Highlighter
          textToHighlight={t("step2.body6")}
          highlightClassName="faq-item__text--highlight"
          searchWords={keyWords}
          autoEscape={true}
        />
      </p>
      <StakingCardMock
        position={0}
        stakeStatus={WAITING}
        allowStatus={SUCCESS}
      />
      <p className="faq-item__text">
        <Highlighter
          textToHighlight={t("step2.body7")}
          highlightClassName="faq-item__text--highlight"
          searchWords={keyWords}
          autoEscape={true}
        />
        <br />
        <br />
        <Highlighter
          textToHighlight={t("step2.body8")}
          highlightClassName="faq-item__text--highlight"
          searchWords={keyWords}
          autoEscape={true}
        />
        <br />
        <br />
        <Highlighter
          textToHighlight={t("step2.body9")}
          highlightClassName="faq-item__text--highlight"
          searchWords={keyWords}
          autoEscape={true}
        />
      </p>

      <div className="staking">
        <div className="cta-container">
          <div className="trust-forever trust-forever--mock">
            <div className="input-label">
              <input
                type="checkbox"
                readOnly
                checked={true}
                name="trust-forever-input"
              />
              <label name="trust-forever">Trust Contract Forever</label>
              <img
                alt="about trust this contract forever"
                src={QustionInfoAlt}
              />
            </div>
          </div>
        </div>
      </div>

      <Heading size={4} highlightSpan type="plain">
        {t("step3.title")}
      </Heading>
      <p className="faq-item__text">
        <Highlighter
          textToHighlight={t("step3.body1")}
          highlightClassName="faq-item__text--highlight"
          searchWords={keyWords}
          autoEscape={true}
        />
        <br />
        <br />
        <Highlighter
          textToHighlight={t("step3.body2")}
          highlightClassName="faq-item__text--highlight"
          searchWords={keyWords}
          autoEscape={true}
        />
      </p>
      <StakingCardMock position={1} />
      <p className="faq-item__text">
        <Highlighter
          textToHighlight={t("step3.body3")}
          highlightClassName="faq-item__text--highlight"
          searchWords={keyWords}
          autoEscape={true}
        />
        <br />
        <br />
        <Highlighter
          textToHighlight={t("step3.body4")}
          highlightClassName="faq-item__text--highlight"
          searchWords={keyWords}
          autoEscape={true}
        />
        <br />
        <br />
        <Highlighter
          textToHighlight={t("step3.body5")}
          highlightClassName="faq-item__text--highlight"
          searchWords={keyWords}
          autoEscape={true}
        />
      </p>
      <Heading size={4} highlightSpan type="plain">
        {t("step4.title")}
      </Heading>
      <p className="faq-item__text">
        <Highlighter
          textToHighlight={t("step4.body1")}
          highlightClassName="faq-item__text--highlight"
          searchWords={keyWords}
          autoEscape={true}
        />
      </p>
      <RewardsCardMock />
      <p className="faq-item__text">
        <Highlighter
          textToHighlight={t("step4.body2")}
          highlightClassName="faq-item__text--highlight"
          searchWords={keyWords}
          autoEscape={true}
        />
      </p>
    </div>
  );
}

HowToTutorial.propTypes = propTypes;

export default HowToTutorial;
