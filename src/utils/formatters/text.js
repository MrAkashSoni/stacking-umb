import { join, splitAt, takeLast, splitWhen, isEmpty, map } from "ramda";

import { sentOn } from "utils";
import capitalize from "lodash/capitalize";

export const arrayToReadableJSON = (array) => {
  const formattedArray = array.map((element) => `"${element}"`);

  return `[\n  ${join(",\n  ", formattedArray)}\n]\n\n`;
};

export function truncate(text, characters = 4) {
  const isTextEmpty = isEmpty(text) || !text;
  const isTextShort = characters * 2 >= text?.length;

  if (isTextEmpty || isTextShort) {
    return text ?? "";
  }

  const firstPart = splitAt(characters, text)[0];
  const lastPart = takeLast(characters, text);

  const textToJoin = [firstPart, "...", lastPart];

  return textToJoin.join("");
}

export function humanizeTransactionMethod(methodName) {
  if (methodName === "exit") {
    return "Claim & withdraw";
  }

  return capitalize(
    map(
      join(""),
      splitWhen((c) => c === c.toUpperCase(), methodName)
    ).join(" ")
  );
}

export function web3ToStorageTransaction({ hash }, method) {
  return { hash, method, timestamp: sentOn() };
}

export function arrayToReadableList(list) {
  const listCopy = [...list];
  const last = listCopy.pop();

  return listCopy.length === 0 ? last : `${listCopy.join(", ")} and ${last}`;
}
