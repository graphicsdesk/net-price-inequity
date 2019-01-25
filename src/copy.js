const text = `In 2008, the average net price for students/households in the lowest income bracket was $12,429 lower than that for those in the second-highest income bracket.
Despite <a href="https://www.columbiaspectator.com/lead/2016/05/05/unfunded-mandate-columbia-college-arts-and-sciences-and-bollinger-era/">record tuition hikes</a>, the increase in financial aid led the third-highest bracket’s average net price to fall 58 percent.
Yet the opposite was true for the lowest income bracket, whose average net price grew 95 percent.
In fact, in 2016, the average net price for the lowest income bracket was $3,269 higher than that for the third-highest.
Students/households earning between $30,001 and $48,000 a year did not fare much better.
This is all while the net price for students/households earning between $75,001 and $110,000 a year dropped nearly 40 percent.
Expectedly, the net price for students/households earning over $110,000 a year did not decrease as much.`;

export default '[steps]\ntext: ' + text.split('\n').join('\ntext: ');
