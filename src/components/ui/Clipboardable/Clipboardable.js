import React, { useState } from "react";
import PropTypes from "prop-types";

import { Button } from "components/ui";
import { Copy } from "assets/images";
import { debounce } from "lodash";
import { CopyToClipboard } from "react-copy-to-clipboard";

const propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

function Clipboardable({ text, children }) {
  const [hasCopied, setHasCopied] = useState(false);
  const copiedCallback = debounce(setHasCopied, 750);

  const handleClick = () => {
    setHasCopied(true);
    copiedCallback();
  };

  return (
    <div>
      {children}
      <CopyToClipboard text={text}>
        <Button
          icon={
            <img
              src={Copy}
              alt=""
              style={{ height: hasCopied ? "16px" : "18px" }}
            />
          }
          type={"plain"}
          handleClick={handleClick}
        />
      </CopyToClipboard>
    </div>
  );
}

Clipboardable.propTypes = propTypes;

export default Clipboardable;
