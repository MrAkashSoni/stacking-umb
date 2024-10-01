export const isErrorInstanceOf = (error, types) => {
  return types.some((type) => error instanceof type);
};
