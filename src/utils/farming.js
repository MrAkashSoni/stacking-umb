import { hasUnixTimeGonePast } from "utils";

export const UNSTARTED = "UNSTARTED";
export const ONGOING = "ONGOING";
export const ENDED = "ENDED";

export const farmingStatusFromEndTime = (time) => {
  if (time === "0") {
    return UNSTARTED;
  } else if (hasUnixTimeGonePast(time)) {
    return ENDED;
  } else {
    return ONGOING;
  }
};
