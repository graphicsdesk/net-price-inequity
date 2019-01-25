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

const text = `In 2008, the average net price for students/households in the lowest income bracket was $12,429 lower than that for those in the second-highest income bracket.
Despite <a href="https://www.columbiaspectator.com/lead/2016/05/05/unfunded-mandate-columbia-college-arts-and-sciences-and-bollinger-era/">record tuition hikes</a>, the increase in financial aid led the third-highest bracket’s average net price to fall 58 percent.
Yet the opposite was true for the lowest income bracket, whose average net price grew 95 percent.
In fact, in 2016, the average net price for the lowest income bracket was $3,269 higher than that for the third-highest.
Students/households earning between $30,001 and $48,000 a year did not fare much better.
This is all while the net price for students/households earning between $75,001 and $110,000 a year dropped nearly 40 percent.
Expectedly, the net price for students/households earning over $110,000 a year did not decrease as much.`;

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
