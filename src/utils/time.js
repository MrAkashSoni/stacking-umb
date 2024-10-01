import {
  formatISODuration,
  intervalToDuration,
  differenceInDays,
} from "date-fns";
import { endsWith } from "ramda";
import { SECONDS_IN_A_MONTH } from "utils/constants";

export const currentUnixTime = () => Math.round(new Date().getTime() / 1000);
export const currentTime = () => new Date().getTime();

export const hasUnixTimeGonePast = (time) => currentTime() > time * 1000;

export const secondsUntil = (time) => {
  const remainingSeconds = time * 1000 - currentTime();
  return remainingSeconds < 0 ? 0 : remainingSeconds;
};

export const secondsToTime = (seconds) =>
  `T${new Date(seconds).toISOString().substr(11, 8)}`;

export const isoDurationFromTimestamp = (timestamp) => {
  if (timestamp) {
    if (timestamp === "0" || secondsUntil(timestamp) === 0) {
      return "PT00H00M00S";
    }

    const start = new Date();
    const end = new Date(timestamp * 1000);

    const timestampInverval = intervalToDuration({
      start,
      end,
    });

    return formatISODuration(timestampInverval);
  }

  return "PT00H00M00S";
};

export const daysUntil = (timestamp) => {
  if (timestamp) {
    const start = new Date();
    const end = new Date(timestamp * 1000);

    return differenceInDays(end, start);
  }
};

export function shouldUpdateClock(isoTimestamp) {
  return endsWith("0H0M0S", isoTimestamp);
}

export function sentOn() {
  const timestamp = new Date();
  const date = timestamp.toLocaleString("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const hour = timestamp.toLocaleTimeString("en", { hour12: false });

  return `Sent on ${date} - ${hour}`;
}

export function periodToLabel({ period }) {
  return `${period / SECONDS_IN_A_MONTH} months`;
}

export const readableTimestamp = (timestamp) =>
  new Date(timestamp * 1000).toLocaleString("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
