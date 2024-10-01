const prefix = "REACT_APP_STAKING_CONTRACT";
const pastIteration = "PAST_ITERATION";

const variables = process.env;

export function pastIterationsFor(chain, stream) {
  return Object.entries(variables).flatMap(([key, value]) =>
    key.startsWith(
      [prefix, stream, chain, pastIteration].join("_").toUpperCase()
    )
      ? [{ address: value, iteration: Number(key.slice(-1)) }]
      : []
  );
}
