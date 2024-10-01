import React from "react";
import { Loading } from "assets/images";

function LoadingState() {
  return (
    <img
      alt="loading"
      style={{ width: "280px", justifySelf: "center" }}
      src={Loading}
    />
  );
}

export default LoadingState;
