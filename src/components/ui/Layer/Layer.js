import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { CloseDark as Close } from "assets/images";
import { Card, Button, Heading } from "components/ui";

import "./layer.scss";

const propTypes = {
  close: PropTypes.func,
  title: PropTypes.string,
  className: PropTypes.string,
  fillMobile: PropTypes.bool,
};

const defaultProps = {
  close: undefined,
  title: undefined,
  className: "",
  fillMobile: false,
};

function Layer({ children, title, close, className, fillMobile }) {
  const layerRef = useRef();

  useEffect(() => {
    const body = document.getElementsByTagName("body")[0];
    const layer = layerRef.current;

    if (body) {
      body.style.overflow = "hidden";
    }

    if (layer) {
      layer.scrollIntoView();
    }

    return () => {
      if (body) {
        body.style.overflow = "initial";
      }
    };
    /* eslint-disable-next-line */
  }, [layerRef.current]);

  return (
    <div className="layer" ref={layerRef}>
      <div className="layer__overlay" onClick={close} />
      <Card
        className={classnames(`layer__card ${className}`, {
          "layer__card--fill": fillMobile,
        })}
      >
        <div className="layer-card-header">
          {title ? (
            <Heading size={3} type="plain">
              {title}
            </Heading>
          ) : null}
          {close && <Button type="plain" handleClick={close} icon={Close} />}
        </div>
        {children}
      </Card>
    </div>
  );
}

Layer.propTypes = propTypes;
Layer.defaultProps = defaultProps;

export default Layer;
