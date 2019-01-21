import theme from './theme';

export const boundsAreEqual = (b1, b2) => {
  if (!b1 || !b2 || b1.length !== b2.length || b1.length !== 2) {
    throw new Error(`Invalid bounds given, ${b1}, ${b2}`);
  }
  return b1[0] === b2[0] && b1[1] === b2[1];
};

const np1Pattern = /\$0 - \$30,000/g;
const np2Pattern = /\$30,001 - \$48,000/g;
const np3Pattern = /\$48,001 - \$75,000/g;
const np4Pattern = /\$75,001 - \$110,000/g;

export const preprocess = copy => {
  return copy
    .replace(
      np1Pattern,
      `<span style="background:${theme.primary}" class="text-highlight">$&</span>`,
    )
    .replace(
      np2Pattern,
      `<span style="background:${theme.secondary}" class="text-highlight">$&</span>`,
    )
    .replace(
      np3Pattern,
      `<span style="background:${theme.tertiary}" class="text-highlight">$&</span>`,
    )
    .replace(
      np4Pattern,
      `<span style="background:${theme.quaternary}" class="text-highlight">$&</span>`,
    );
};

export const isEqual = (o1, o2) => {
  for (const key in ['isInitialGapVisible', 'isFinalGapVisible', 'isPercentGrowthVisible',]) {
    if (o1[key] !== o2[key]) return false;
  }
  return true;
}