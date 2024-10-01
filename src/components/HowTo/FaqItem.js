import React, { useState } from "react";

import PropTypes from "prop-types";

import classnames from "classnames";
import { Card } from "components/ui";
import { Collapse } from "react-collapse";
import { Up, Down } from "assets/images";
import Highlighter from "react-highlight-words";

import "./faqItem.scss";

const propTypes = {
  title: PropTypes.string.isRequired,
  keyWords: PropTypes.array,
  id: PropTypes.string,
};

const defaultProps = {
  keyWords: [],
  id: undefined,
};

function FaqItem({ title, children, keyWords, id }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleIsOpen = () => setIsOpen(!isOpen);

  return (
    <Card
      id={id}
      className={classnames("faq-item", { "faq-item--closed": !isOpen })}
    >
      <button className="faq-button" onClick={toggleIsOpen}>
        <div className="faq-item__header">
          <Highlighter
            className="heading heading--4 heading--title"
            highlightClassName="heading--highlighted"
            textToHighlight={title}
            searchWords={keyWords}
            autoEscape={true}
          />
          {isOpen ? <Up /> : <Down />}
        </div>
      </button>
      <Collapse isOpened={isOpen}>{children}</Collapse>
    </Card>
  );
}

FaqItem.propTypes = propTypes;
FaqItem.defaultProps = defaultProps;

export default FaqItem;
