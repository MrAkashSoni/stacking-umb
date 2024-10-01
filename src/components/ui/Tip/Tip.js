import React, { useEffect, useState, useRef } from "react";

import PropTypes from "prop-types";
import { Card, Button, Heading } from "components/ui";
import { debounce } from "lodash";

import ScrollLock from "react-scrolllock";

import { useTutorial, nextStep, closeTutorial } from "utils/store/Tutorial";

import "./tip.scss";

const propTypes = {
  callback: PropTypes.func,
  unmountCallback: PropTypes.func,
  direction: PropTypes.oneOf(["up", "down"]),
};

const defaultProps = {
  callback: () => {},
  unmountCallback: () => {},
  direction: "up",
};

function Tip({
  isLast,
  children,
  direction,
  isOpen,
  childRef,
  callback,
  unmountCallback,
  instructions,
  whiteBackground,
}) {
  const {
    state: { step },
    dispatch,
  } = useTutorial();
  const tipRef = useRef();
  const [isTipOpen, setIsTipOpen] = useState(false);
  const [tipOffset, setTipOffset] = useState(0);
  const [tipLeftOffset, setTipLeftOffset] = useState(0);

  const openTip = () => setIsTipOpen(true);

  const scrollCallback = debounce(openTip, 250);

  const updateOffset = () => {
    const offset =
      direction === "up"
        ? childRef.current.getBoundingClientRect().y -
          20 -
          tipRef.current.offsetHeight
        : childRef.current.getBoundingClientRect().y +
          childRef.current.offsetHeight +
          20;

    const leftOffset = childRef.current.getBoundingClientRect().left - 15;

    setTipLeftOffset(leftOffset);
    setTipOffset(offset);
  };

  useEffect(() => {
    if (isOpen) {
      if (childRef.current && childRef.current.scrollIntoView) {
        childRef.current.scrollIntoView();
        scrollCallback();
      }

      callback();
    } else {
      setIsTipOpen(false);
      unmountCallback();
    }

    /* eslint-disable-next-line */
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (isOpen && childRef.current && childRef.current.scrollIntoView) {
        childRef.current.scrollIntoView();
        updateOffset();
      }
    };

    if (isOpen) {
      window.addEventListener("resize", handleResize);
    } else {
      window.removeEventListener("resize", handleResize);
    }

    return function cleanupListener() {
      window.removeEventListener("resize", handleResize);
    };

    /* eslint-disable-next-line */
  }, [isOpen]);

  useEffect(() => {
    if (isTipOpen && tipRef.current && childRef.current) {
      updateOffset();
    }

    /* eslint-disable-next-line */
  }, [isTipOpen]);

  if (!isOpen) {
    return children;
  } else {
    return (
      <>
        <ScrollLock />
        <div
          onClick={() => {
            dispatch(closeTutorial());
          }}
          style={{
            zIndex: "1",
            width: "100vw",
            height: "100%",
            background: "black",
            opacity: "0.2",
            position: "fixed",
            top: 0,
            left: 0,
          }}
        />
        {React.cloneElement(children, {
          ...children.props,
          disabled: false,
          style: {
            ...children.props.style,
            zIndex: 3,
            boxShadow: "0px 0px 10px 5px white",
            background: whiteBackground ? "white" : undefined,
          },
        })}
        <div
          style={{
            zIndex: 3,
            width: "100vw",
            height: "100%",
            background: "black",
            opacity: "0",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
        <div ref={tipRef} style={{ position: "relative", zIndex: 4 }}>
          <Card
            className="tip"
            style={{
              visibility: isTipOpen && tipOffset ? "initial" : "hidden",
              left: `${tipLeftOffset}px`,
              top: `${tipOffset}px`,
            }}
          >
            <Heading type="secondary" highlightSpan size={4}>
              # <span>{step}</span>
            </Heading>
            <p>{instructions}</p>
            <div className="actions">
              <Button
                type="secondary"
                onClick={() => {
                  dispatch(closeTutorial());
                }}
                label="CLOSE"
              />
              <Button
                onClick={() => {
                  dispatch(nextStep());
                }}
                label={isLast ? "FINISH" : "NEXT"}
              />
            </div>
          </Card>
        </div>
      </>
    );
  }
}

Tip.propTypes = propTypes;
Tip.defaultProps = defaultProps;

export default Tip;
