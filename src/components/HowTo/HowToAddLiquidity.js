import React from "react";
import PropTypes from "prop-types";

import { Heading } from "components/ui";
import Highlighter from "react-highlight-words";

import { useTranslation } from "react-i18next";

import {
  UniswapLiquidityStepOne,
  UniswapLiquidityStepOnePtTwo,
  UniswapLiquidityStepTwo,
  UniswapLiquidityStepThree,
  UniswapLiquidityStepFour,
  UniswapLiquidityStepFive,
  UniswapLiquidityStepSix,
  UniswapLiquidityStepSeven,
} from "assets/images";

const propTypes = {
  keyWords: PropTypes.array.isRequired,
};

function HowToAddLiquidity({ keyWords }) {
  const { t } = useTranslation("liquidity");

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
        <a
          href="https://app.uniswap.org/#/add/v2/ETH/0x6fC13EACE26590B80cCCAB1ba5d51890577D83B2"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Highlighter
            className="faq-item__text"
            textToHighlight={t("intro.link1")}
            highlightClassName="faq-item__text--highlight"
            searchWords={keyWords}
            autoEscape={true}
          />
        </a>{" "}
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
          className="faq-item__text--bold"
          textToHighlight={t("note.disclaimer")}
          highlightClassName="faq-item__text--highlight"
          searchWords={keyWords}
          autoEscape={true}
        />{" "}
        <Highlighter
          className="faq-item__text--bold"
          textToHighlight={t("note.body1")}
          highlightClassName="faq-item__text--highlight"
          searchWords={keyWords}
          autoEscape={true}
        />{" "}
        <Highlighter
          className="faq-item__text"
          textToHighlight={t("note.body2")}
          highlightClassName="faq-item__text--highlight"
          searchWords={keyWords}
          autoEscape={true}
        />{" "}
        <a href="#add-liquidity-step-4">
          <Highlighter
            className="faq-item__text"
            textToHighlight={t("note.link1")}
            highlightClassName="faq-item__text--highlight"
            searchWords={keyWords}
            autoEscape={true}
          />
        </a>
        <Highlighter
          className="faq-item__text"
          textToHighlight={t("note.end")}
          highlightClassName="faq-item__text--highlight"
          searchWords={keyWords}
          autoEscape={true}
        />
      </p>

      <Heading size={3} highlightSpan type="plain">
        {t("section1.title")}
      </Heading>

      <p className="faq-item__text">
        <Highlighter
          className="faq-item__text"
          textToHighlight={t("section1.body1")}
          highlightClassName="faq-item__text--highlight"
          searchWords={keyWords}
          autoEscape={true}
        />
        <a
          href="https://app.uniswap.org/#/pools"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Highlighter
            className="faq-item__text"
            textToHighlight="https://app.uniswap.org/#/pools"
            highlightClassName="faq-item__text--highlight"
            searchWords={keyWords}
            autoEscape={true}
          />
        </a>{" "}
        <Highlighter
          className="faq-item__text"
          textToHighlight={t("section1.body2")}
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

      <div className="image-box">
        <img alt="uniswap pool page" src={UniswapLiquidityStepOne} />
        <img
          alt="uniswap v2 liquidity button"
          src={UniswapLiquidityStepOnePtTwo}
        />
      </div>

      <Heading size={4} highlightSpan type="plain">
        {t("step2.title")}
      </Heading>
      <Highlighter
        className="faq-item__text"
        textToHighlight={t("step2.body")}
        searchWords={keyWords}
        autoEscape={true}
      />
      <div className="image-box">
        <img alt="confirm supply" src={UniswapLiquidityStepTwo} />
      </div>

      <Heading size={4} highlightSpan type="plain">
        {t("step3.title")}
      </Heading>
      <Highlighter
        className="faq-item__text"
        textToHighlight={t("step3.body")}
        highlightClassName="faq-item__text--highlight"
        searchWords={keyWords}
        autoEscape={true}
      />
      <div className="image-box">
        <img alt="transaction submitted" src={UniswapLiquidityStepThree} />
      </div>

      <Heading id="add-liquidity-step-4" size={3} highlightSpan type="plain">
        {t("section2.title")}
      </Heading>

      <Heading size={4} highlightSpan type="plain">
        {t("step4.title")}
      </Heading>
      <Highlighter
        className="faq-item__text"
        textToHighlight={t("step4.body")}
        highlightClassName="faq-item__text--highlight"
        searchWords={keyWords}
        autoEscape={true}
      />
      <div className="image-box">
        <img alt="your pools" src={UniswapLiquidityStepFour} />
      </div>

      <Heading size={4} highlightSpan type="plain">
        {t("step5.title")}
      </Heading>
      <Highlighter
        className="faq-item__text"
        textToHighlight={t("step5.body")}
        highlightClassName="faq-item__text--highlight"
        searchWords={keyWords}
        autoEscape={true}
      />
      <div className="image-box">
        <img alt="your pools" src={UniswapLiquidityStepFive} />
      </div>

      <Heading size={4} highlightSpan type="plain">
        {t("step6.title")}
      </Heading>
      <Highlighter
        className="faq-item__text"
        textToHighlight={t("step6.body")}
        highlightClassName="faq-item__text--highlight"
        searchWords={keyWords}
        autoEscape={true}
      />
      <div className="image-box">
        <img alt="your pools" src={UniswapLiquidityStepSix} />
      </div>

      <Heading size={4} highlightSpan type="plain">
        {t("step7.title")}
      </Heading>
      <Highlighter
        className="faq-item__text"
        textToHighlight={t("step7.body")}
        highlightClassName="faq-item__text--highlight"
        searchWords={keyWords}
        autoEscape={true}
      />
      <div className="image-box">
        <img alt="your pools" src={UniswapLiquidityStepSeven} />
      </div>

      <Heading size={4} type="plain">
        {t("step8.title")}
      </Heading>
      <p className="faq-item__text">
        <Highlighter
          className="faq-item__text"
          textToHighlight={t("step8.body")}
          highlightClassName="faq-item__text--highlight"
          searchWords={keyWords}
          autoEscape={true}
        />
        <a href="#stake-tokens">
          <Highlighter
            className="faq-item__text"
            textToHighlight={t("step8.link1")}
            highlightClassName="faq-item__text--highlight"
            searchWords={keyWords}
            autoEscape={true}
          />
        </a>
        <Highlighter
          className="faq-item__text"
          textToHighlight={t("step8.end")}
          highlightClassName="faq-item__text--highlight"
          searchWords={keyWords}
          autoEscape={true}
        />
      </p>
    </div>
  );
}

HowToAddLiquidity.propTypes = propTypes;

export default HowToAddLiquidity;
