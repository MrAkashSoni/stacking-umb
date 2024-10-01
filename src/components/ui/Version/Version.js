import React from "react";

import "./version.scss";

function Version() {
  return <p className="version">{`v${process.env.REACT_APP_VERSION}`}</p>;
}

export default Version;
