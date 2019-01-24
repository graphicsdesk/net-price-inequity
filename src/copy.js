/*export default `[steps]
text: In 2008, the average net price for families in the $0 - $30,000 income bracket was $14 lower than for those in the $30,001 - $48,000 income bracket.
text: As tuition grew, the average net price for $30,001 - $48,000 families rose slightly, around $1,000.
text: The average net price for $0 - $30,000 families grew at a much faster rate, however. By the end of 2016, it was $4,321 greater than that for $30,001 - $48,000 families.
text: The average net price for $0 - $30,000 families had increased 120%, the greatest percent change of any income bracket.
text: Despite this increase, in the same time frame, the average net price for $48,001 - $75,000 families had dropped nearly 58%...
text: ...and the average net price for $75,001 - $110,000 families dropped 38%.
`;
concept:
iq1 << iq2
despite considerable tuition increases, generous financial aid brought down iq3 considerably.
in 2016, it was only $2k greater than iq1 in 2008.
but iq1 didn't experience the same pattern
it actually started growing
and in 2016 was several thousand dollars greater than iq3
this growth was also while iq4 experienced great falls in its net price
why isn't the money going to the students who need it?
*/

const text = `In 2008, the average net price for families in the first income bracket (those under $30,000 a year) was $12,430 lower than that for families in the third income bracket (those earning between $48,001 and $75,000 a year).
Despite record tuition hikes, increases in financial aid led the third income bracket’s average net price to fall considerably.
Yet the opposite was true for the first income bracket.
In fact, in the most recent year for which the data was reported, the average net price for the lowest income bracket was $3,270 higher than that for the third.
Families in between (those earning $30,001 to $48,000 a year) did not fare much better.
This is all while the net price for families earning $75,001 to $110,000 a year dropped nearly 40%.
Expectedly the net price for families earning over $110,000 a year did not decrease as much.
This shit whack.`;

export default '[steps]\ntext: ' + text.split('\n').join('\ntext: ');

export const nah = `
[steps]

text: In 2008, the average net price for "low income" families (those earning $0 - $30,000 a year) was $28,000 lower than that for those earning $48,001 - $75,000.
text: Despite tuition increases, generous amounts of financial aid brought down the $48,001 - $75,000 net price...
text: ...but the same was not true for low income families.
text: In fact, in the last year, Columbia cost $3,269 more for families earning $0 - $30,000 a year than those earning $48,001 - $75,000 a year.
text: Families in between (those earning $30,001 - $48,000 a year) did not fare much better.
text: This is all while the average net price for $75,001 - $110,000 families fell by nearly 40%.
text: The net price for $110,000+ families, expectedly, did not decrease as much.
text: Money money money

`;
