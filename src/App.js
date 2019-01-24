import React, { Component } from 'react';
import injectSheet from 'react-jss';
import archieml from 'archieml';
import { Scrollama, Step } from 'react-scrollama';

import LineChart from './LineChart';
import copy from './copy';
import {
  animTime,
  shortLineAnimTime,
  lowBound,
  smallUpperBound,
  midUpperBound,
  bigUpperBound,
} from './constants';
import { boundsAreEqual, preprocess, isEqual } from './utils';

const styles = theme => ({
  bannerContainer: {
    display: 'flex',
    justifyContent: 'center',
    margin: '6em auto 0 auto',
  },
  banner: {
    backgroundColor: theme.specColor,
    fontSize: '.8rem',
    padding: '5px 15px',
    fontFamily: 'Roboto',
    textTransform: 'uppercase',
    color: '#fff',
    fontWeight: 500,
    display: 'inline-block',
  },
  header: {
    maxWidth: '15em',
    fontFamily: 'Roboto',
    fontSize: '4rem',
    fontWeight: 400,
    textAlign: 'center',
  },
  byline: {
    marginTop: '2em',
    fontFamily: 'Roboto',
    fontSize: '1.2rem',
    fontWeight: 700,
    textAlign: 'center',
  },
  dateline: {
    fontWeight: 400,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    '& p': {
      padding: '1rem',
      fontSize: '1.1rem',
      fontFamily: 'Merriweather',
      fontWeight: 400,
      lineHeight: '2.2rem',
      margin: '0.5rem auto',
      maxWidth: '600px',
    },
  },
  graphicContainer: {
    margin: '5vh 0',
  },
  steps: {
    padding: '0 5vw 70vh 5vw',
  },
  step: {
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    margin: '0 auto 70vh auto',
    maxWidth: '500px',
    '&:last-child': {
      marginBottom: 0,
    },
  },
  stepText: {
    textAlign: 'center',
    padding: '1rem',
    fontSize: '1.2rem',
    fontFamily: 'Merriweather',
    fontWeight: 400,
    lineHeight: '2rem',
  },
  sticky: {
    position: 'sticky',
    width: '100%',
    height: '100vh',
    top: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  '@media (max-width: 676px)': {
    header: {
      fontSize: '11vw',
    },
  },
});

const stages = [
  // Initial stage
  {
    bound: [lowBound, smallUpperBound],
    isInitialGapVisible: false,
    isFinalGapVisible: false,
    isPercentGrowthVisible: false,
    lineVisibility: [false, false, false],
  },
  // Stage 1: initial iq0 and iq2 comparison
  {
    bound: [lowBound, smallUpperBound],
    isInitialGapVisible: true,
    isFinalGapVisible: false,
    isPercentGrowthVisible: false,
    lineVisibility: [false, false, false],
  },
  // Stage 2: how iq2 grew
  {
    bound: [lowBound, smallUpperBound],
    isInitialGapVisible: false,
    isFinalGapVisible: false,
    isPercentGrowthVisible: false,
    lineVisibility: [false, false, true],
  },
  // Stage 3: how iq0 grew
  {
    bound: [lowBound, smallUpperBound],
    isInitialGapVisible: false,
    isFinalGapVisible: false,
    isPercentGrowthVisible: false,
    lineVisibility: [true, false, true],
  },
  // Stage 4: show end comparison
  {
    bound: [lowBound, smallUpperBound],
    isInitialGapVisible: false,
    isFinalGapVisible: true,
    isPercentGrowthVisible: false,
    lineVisibility: [true, false, true],
  },
  // Stage 4: show end comparison
  {
    bound: [lowBound, smallUpperBound],
    isInitialGapVisible: false,
    isFinalGapVisible: false,
    isPercentGrowthVisible: false,
    lineVisibility: [false, true, true],
  },
  // Stage 4: look at iq3 too!
  {
    bound: [lowBound, midUpperBound],
    isInitialGapVisible: false,
    isFinalGapVisible: false,
    isPercentGrowthVisible: false,
    lineVisibility: [false, false, true, true],
  },
  // Stage 5: look at iq4 too!
  {
    bound: [lowBound, bigUpperBound],
    isInitialGapVisible: false,
    isFinalGapVisible: false,
    isPercentGrowthVisible: false,
    lineVisibility: [false, false, true, true, true],
    isPercentLabelVisible: false,
  },
  // Stage 6: transition question
  {
    bound: [lowBound, midUpperBound],
    isInitialGapVisible: false,
    isFinalGapVisible: false,
    isPercentGrowthVisible: false,
    lineVisibility: [true, false, true, true],
    isPercentLabelVisible: true,
  },
];

const steps = archieml.load(preprocess(copy)).steps;

class App extends Component {
  state = stages[0];

  // TODO: WE NEED EXIT FUNCTIONS FOR IF WE LEAVE STPE IN THE MIDDLE

  actions = steps.map((_, index) => (state, direction) => {
    const entered = state === 'enter';
    const goingForward = direction === 'down';

    const stageNum = goingForward ? index + 1 : index;
    if (entered) {
      this.setState({ directionEntered: direction });
    } else if (this.state.directionEntered === direction) {
      // If exiting in the same direction as entered, no need to set stage settings again
      return;
    }

    const newStage = stages[stageNum];
    const { bound, ...withoutBound } = newStage;

    const { bound: oldBound } = this.state;
    const boundChanged = !boundsAreEqual(oldBound, bound);

    withoutBound.bound = oldBound;
    if (goingForward) {
      if (boundChanged) {
        // We first animate in the new bounds, then animate in the rest of the stage
        this.setState({ ...this.state, bound });

        setTimeout(() => {
          this.setState(newStage);
        }, animTime);
      } else {
        this.setState(newStage);
      }
    } else {
      // We first undraw the stage, then animate in new bounds, if there are any.
      this.setState(withoutBound);
      if (boundChanged) {
        if (isEqual(this.state, withoutBound)) {
          this.setState(newStage);
        } else {
          setTimeout(() => {
            this.setState(newStage);
          }, shortLineAnimTime);
        }
      }
    }
  });

  onStepEnter = ({ element, data, direction }) => {
    const action = this.actions[data];
    typeof action === 'function' && action('enter', direction);
  };

  onStepExit = ({ element, data, direction }) => {
    const action = this.actions[data];
    typeof action === 'function' && action('exit', direction);
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div className={classes.bannerContainer}>
          <div className={classes.banner}>News | Administration</div>
        </div>
        <h1 className={classes.header}>
          Low income students pay increasingly more for Columbia while higher income students pay increasingly less.
        </h1>
        <div className={classes.byline}>BY JASON KAO | <span className={classes.dateline}>January 24, 2019</span></div>
        <div className={classes.content}>
          <p>
            The amount of financial aid Columbia gives its incoming
            undergraduates has nearly doubled since it adopted a “need-blind,
            full-need” approach in 2008.
          </p>
        </div>
        <div className={classes.graphicContainer}>
          <figure className={classes.sticky}>
            <LineChart {...this.state} />
          </figure>
          <article className={classes.steps}>
            <Scrollama
              offset={0.5}
              onStepEnter={this.onStepEnter}
              onStepExit={this.onStepExit}
            >
              {steps.map(({ text }, index) => (
                <Step data={index} key={text + '-' + index}>
                  <div className={classes.step}>
                    <p
                      className={classes.stepText}
                      dangerouslySetInnerHTML={{ __html: text }}
                    />
                  </div>
                </Step>
              ))}
            </Scrollama>
          </article>
        </div>
        <div className={classes.content}>
          <p>
            Researchers point to several reasons why students from wealthier
            backgrounds may receive more aid, the most notable being that tax
            breaks disproportionately benefit higher income households. In 2015,
            The Congressional Research Service found that over a fifth of tax
            deductions given under the American Opportunity Tax Credit went to
            households earning over $100,000 a year, compared to 30% of
            households earning less than $30,000.
          </p>
        </div>
      </div>
    );
  }
}

export default injectSheet(styles)(App);
