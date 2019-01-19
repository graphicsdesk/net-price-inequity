export const boundsAreEqual = (b1, b2) => {
  if (!b1 || !b2 || b1.length !== b2.length || b1.length !== 2) {
    throw new Error(`Invalid bounds given, ${b1}, ${b2}`);
  }
  return b1[0] === b2[0] && b1[1] === b2[1];
};
