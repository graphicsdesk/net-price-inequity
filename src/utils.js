import theme from './theme';

export const boundsAreEqual = (b1, b2) => {
  if (!b1 || !b2 || b1.length !== b2.length || b1.length !== 2) {
    throw new Error(`Invalid bounds given, ${b1}, ${b2}`);
  }
  return b1[0] === b2[0] && b1[1] === b2[1];
};

const np1Pattern = /(\$0 (-|to|and) \$30,000)|((first|lowest) income bracket)/g;
const np2Pattern = /(\$30,001 (-|to|and) \$48,000)|(second income bracket)/g;
const np3Pattern = /(\$48,001 (-|to|and) \$75,000)|(third income bracket)/g;
const np4Pattern = /(\$75,001 (-|to|and) \$110,000)|(fourth income bracket)/g;
const np5Pattern = /(\$110,000\+)|(fifth income bracket)|(over \$100,000)/g;
const moneyPattern = /(\$[\d,]+\s\w{4,})/g;
const money2Pattern = /(\w{4,}\s\$[\d,]+)/g;
const quotePattern = /"(.*)"/g;

export const preprocess = copy => {
  return copy
    .replace(quotePattern, '&#8220;$1&#8221;')
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
    )
    .replace(
      np5Pattern,
      `<span style="background:${theme.quinary}" class="text-highlight">$&</span>`,
    )
    .replace(moneyPattern, `<span class="text-bold">$&</span>`)
    .replace(money2Pattern, `<span class="text-bold">$&</span>`);
};

export const isEqual = (o1, o2) => {
  for (const key in [
    'isInitialGapVisible',
    'isFinalGapVisible',
    'isPercentGrowthVisible',
  ]) {
    if (o1[key] !== o2[key]) return false;
  }
  return true;
};
