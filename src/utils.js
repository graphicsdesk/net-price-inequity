import theme from './theme';

export const boundsAreEqual = (b1, b2) => {
  if (!b1 || !b2 || b1.length !== b2.length || b1.length !== 2) {
    throw new Error(`Invalid bounds given, ${b1}, ${b2}`);
  }
  return b1[0] === b2[0] && b1[1] === b2[1];
};

const np1Pattern = /\$0 - \$30,000/g;
const np2Pattern = /\$[\d,]{6} - \$[\d,]{6}/g;

export const preprocess = copy => {
  return copy
    .replace(
      np1Pattern,
      `<span style="background:${theme.primary}" class="text-highlight">$&</span>`,
    )
    .replace(
      np2Pattern,
      `<span style="background:${theme.secondary}" class="text-highlight">$&</span>`,
    );
};
