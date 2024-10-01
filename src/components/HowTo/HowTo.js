import React, { useState, useRef } from "react";
import { debounce } from "lodash";
import { isEmpty } from "ramda";

import { Search, Loading } from "assets/images";
import { Card, Button, Heading } from "components/ui";
import Highlighter from "react-highlight-words";

import FaqItem from "./FaqItem";
import HowToAddLiquidity from "./HowToAddLiquidity";
import HowToTutorial from "./HowToTutorial";

import { useTranslation, Trans } from "react-i18next";
import i18n from "utils/i18n";
import { ASTRO_LOCK_URL } from "utils";

import "./howTo.scss";

function items(keyWords) {
  const t = i18n.t.bind(i18n);

  return [
    {
      title: t("faq:items.allowance.title"),
      component: (
        <Highlighter
          className="faq-item__text"
          textToHighlight={t("faq:items.allowance.body")}
          highlightClassName="faq-item__text--highlight"
          searchWords={keyWords}
          autoEscape={true}
        />
      ),
      rawText: t("faq:items.allowance.body"),
    },
    {
      title: t("faq:items.trust.title"),
      component: (
        <Highlighter
          className="faq-item__text"
          textToHighlight={t("faq:items.trust.body")}
          highlightClassName="faq-item__text--highlight"
          searchWords={keyWords}
          autoEscape={true}
        />
      ),
      rawText: t("faq:items.trust.body"),
    },
    {
      title: t("faq:items.process.title"),
      component: (
        <p className="faq-item__text">
          <Highlighter
            textToHighlight={t("faq:items.process.body")}
            highlightClassName="faq-item__text--highlight"
            searchWords={keyWords}
            autoEscape={true}
          />
          <br />
          <br />
          <Highlighter
            textToHighlight={t("faq:items.process.body2")}
            highlightClassName="faq-item__text--highlight"
            searchWords={keyWords}
            autoEscape={true}
          />
        </p>
      ),
      rawText: [t("faq:items.process.body"), t("faq:items.process.body2")].join(
        " "
      ),
    },
    {
      title: t("faq:items.liquidity.title"),
      component: <HowToAddLiquidity keyWords={keyWords} />,
      rawText: t("faq:items.liquidity.rawText"),
      id: "add-liquidity",
    },
    {
      title: t("faq:items.tutorial.title"),
      component: <HowToTutorial keyWords={keyWords} />,
      rawText: t("faq:items.tutorial.rawText"),
      id: "stake-tokens",
    },
    {
      title: t("faq:items.transactions.title"),
      component: (
        <p className="faq-item__text">
          <Highlighter
            textToHighlight={t("faq:items.transactions.body")}
            highlightClassName="faq-item__text--highlight"
            searchWords={keyWords}
            autoEscape={true}
          />
          <br />
          <Highlighter
            textToHighlight={t("faq:items.transactions.item1")}
            highlightClassName="faq-item__text--highlight"
            searchWords={keyWords}
            autoEscape={true}
          />
          <br />
          <Highlighter
            textToHighlight={t("faq:items.transactions.item2")}
            highlightClassName="faq-item__text--highlight"
            searchWords={keyWords}
            autoEscape={true}
          />
          <br />
          <Highlighter
            textToHighlight={t("faq:items.transactions.item3")}
            highlightClassName="faq-item__text--highlight"
            searchWords={keyWords}
            autoEscape={true}
          />
          <br />
          <Trans i18nKey="faq:items.transactions.item3cont" t={t}>
            Please visit their support sites by clicking
            <a
              href="https://metamask.zendesk.com/hc/en-us/requests/new"
              rel="noopener noreferrer"
              target="_blank"
            >
              here.
            </a>
          </Trans>
          <br />
          <br />
          <Highlighter
            textToHighlight={t("faq:items.transactions.item4")}
            highlightClassName="faq-item__text--highlight"
            searchWords={keyWords}
            autoEscape={true}
          />
          <br />
          <br />
          <Highlighter
            textToHighlight={t("faq:items.transactions.body2")}
            highlightClassName="faq-item__text--highlight"
            searchWords={keyWords}
            autoEscape={true}
          />
        </p>
      ),
      rawText: [
        t("faq:items.transactions.body"),
        t("faq:items.transactions.item1"),
        t("faq:items.transactions.item2"),
        t("faq:items.transactions.item3"),
        t("faq:items.transactions.item3cont"),
        t("faq:items.transactions.item4"),
        t("faq:items.transactions.body2"),
      ].join(" "),
    },
    {
      title: t("faq:items.can.title"),
      component: (
        <p className="faq-item__text">
          <Highlighter
            textToHighlight={t("faq:items.can.body")}
            highlightClassName="faq-item__text--highlight"
            searchWords={keyWords}
            autoEscape={true}
          />
          <br />
          <br />
          <Highlighter
            textToHighlight={t("faq:items.can.body2")}
            highlightClassName="faq-item__text--highlight"
            searchWords={keyWords}
            autoEscape={true}
          />
        </p>
      ),
      rawText: [t("faq:items.can.body"), t("faq:items.can.body2")].join(" "),
    },
    {
      title: t("faq:items.lockin.title"),
      component: (
        <p className="faq-item__text">
          <Highlighter
            textToHighlight={t("faq:items.lockin.body")}
            highlightClassName="faq-item__text--highlight"
            searchWords={keyWords}
            autoEscape={true}
          />
        </p>
      ),
      rawText: t("faq:items.lockin.body"),
    },
    {
      title: t("faq:items.safe.title"),
      component: (
        <p className="faq-item__text">
          <Highlighter
            textToHighlight={t("faq:items.safe.body")}
            highlightClassName="faq-item__text--highlight"
            searchWords={keyWords}
            autoEscape={true}
          />
          <br />
          <br />
          <Highlighter
            textToHighlight={t("faq:items.safe.body2")}
            highlightClassName="faq-item__text--highlight"
            searchWords={keyWords}
            autoEscape={true}
          />
        </p>
      ),
      rawText: [t("faq:items.safe.body"), t("faq:items.safe.body2")].join(" "),
    },
    {
      title: t("faq:items.rewards.title"),
      component: (
        <Highlighter
          className="faq-item__text"
          textToHighlight={t("faq:items.rewards.body")}
          highlightClassName="faq-item__text--highlight"
          searchWords={keyWords}
          autoEscape={true}
        />
      ),
      rawText: t("faq:items.rewards.body"),
    },
    {
      title: t("faq:items.help.title"),
      component: (
        <p className="faq-item__text">
          <Trans i18nKey="faq:items.help.body" className="faq-item__text" t={t}>
            The best way to get in touch with our team is by joining the
            <a
              href="https://discord.gg/MM52j4hre4"
              rel="noopener noreferrer"
              target="_blank"
            >
              official Umbrella Network Discord server
            </a>
            and heading over to the #general-support channel. Our engineering
            team is always glad to hear your concerns and help you with any
            issues that might come up. You can also chat and get help from our
            ever-growing community, come say hi!
          </Trans>
        </p>
      ),
      rawText: t("faq:items.help.body"),
    },
    {
      title: t("faq:items.sending.title"),
      component: (
        <>
          <p className="faq-item__text">
            <Highlighter
              className="faq-item__text"
              textToHighlight={t("faq:items.sending.body1")}
              highlightClassName="faq-item__text--highlight"
              searchWords={keyWords}
              autoEscape={true}
            />
            <Highlighter
              className="faq-item__text--bold"
              textToHighlight={t("faq:items.sending.body2")}
              highlightClassName="faq-item__text--highlight"
              searchWords={keyWords}
              autoEscape={true}
            />
            <Highlighter
              className="faq-item__text"
              textToHighlight={t("faq:items.sending.body3")}
              highlightClassName="faq-item__text--highlight"
              searchWords={keyWords}
              autoEscape={true}
            />
            <Highlighter
              className="faq-item__text--bold"
              textToHighlight={t("faq:items.sending.body4")}
              highlightClassName="faq-item__text--highlight"
              searchWords={keyWords}
              autoEscape={true}
            />
          </p>

          <p className="faq-item__text">
            <Highlighter
              className="faq-item__text"
              textToHighlight={t("faq:items.sending.body5")}
              highlightClassName="faq-item__text--highlight"
              searchWords={keyWords}
              autoEscape={true}
            />{" "}
            <a
              href="https://discord.gg/pbUncgKaD9"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Highlighter
                className="faq-item__text"
                textToHighlight={t("faq:items.sending.link1")}
                highlightClassName="faq-item__text--highlight"
                searchWords={keyWords}
                autoEscape={true}
              />
            </a>
            <Highlighter
              className="faq-item__text"
              textToHighlight={t("faq:items.sending.end")}
              highlightClassName="faq-item__text--highlight"
              searchWords={keyWords}
              autoEscape={true}
            />
          </p>
        </>
      ),
      rawText: [
        t("faq:items.sending.body1"),
        t("faq:items.sending.body2"),
        t("faq:items.sending.body3"),
        t("faq:items.sending.body4"),
        t("faq:items.sending.body5"),
        t("faq:items.sending.link1"),
        t("faq:items.safe.end"),
      ].join(""),
    },
    {
      title: t("faq:items.tokensLocked.title"),
      component: (
        <>
          <Highlighter
            className="faq-item__text"
            textToHighlight={t("faq:items.tokensLocked.body")}
            highlightClassName="faq-item__text--highlight"
            searchWords={keyWords}
            autoEscape={true}
          />
          <p className="faq-item__text">
            <a href={ASTRO_LOCK_URL} rel="noopener noreferrer">
              <Highlighter
                className="faq-item__text"
                textToHighlight={ASTRO_LOCK_URL}
                highlightClassName="faq-item__text--highlight"
                searchWords={keyWords}
                autoEscape={true}
              />
            </a>
          </p>
        </>
      ),
      rawText: [t("faq:items.tokensLocked.body"), ASTRO_LOCK_URL].join(""),
    },
  ];
}

function HowTo() {
  const { t, ready } = useTranslation("faq");

  const [keyWords, setKeyWords] = useState([]);
  const [value, setValue] = React.useState("");
  const faqItems = items(keyWords);
  const filteredItems = faqItems.filter(({ rawText, title }) =>
    new RegExp(keyWords.join("|"), "i").test([rawText, title].join(" "))
  );

  const handleValueChange = (value) => {
    setKeyWords(value.split(/\W+/).filter((value) => !isEmpty(value)));
  };

  const valueChangeCallback = useRef(
    debounce((value) => handleValueChange(value), 500)
  ).current;

  const handleChange = ({ target: { value } }) => {
    setValue(value);
    valueChangeCallback(value);
  };

  if (!ready) {
    return (
      <img
        alt="loading"
        style={{ width: "280px", justifySelf: "center" }}
        src={Loading}
      />
    );
  }

  return (
    <div className="how-to">
      <Heading type="primary" highlightSpan size={1}>
        FAQ
      </Heading>
      <Card className="how-to__search">
        <img alt="search icon" className="icon" src={Search} />
        <input
          value={value}
          className="input"
          placeholder={t("searchPlaceholder")}
          onInput={handleChange}
        />
      </Card>
      <div className="content">
        {isEmpty(filteredItems) ? (
          <>
            <p className="no-results">No results found</p>
            <Button
              type="secondary"
              label="Clear"
              handleClick={() => handleChange({ target: { value: "" } })}
            />
          </>
        ) : (
          <>
            {filteredItems.map(({ title, component, id }, index) => (
              <FaqItem
                id={id}
                key={`faq-item-${index}`}
                title={title}
                keyWords={keyWords}
              >
                {component}
              </FaqItem>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default HowTo;
