import React, { Component } from 'react';
import injectSheet from 'react-jss';
import archieml from 'archieml';
import { Scrollama, Step } from 'react-scrollama';

import LineChart from './LineChart';
import copy from './copy';
import { animTime, shortLineAnimTime } from './constants';
import { boundsAreEqual, preprocess, isEqual } from './utils';

const styles = theme => ({
  container: {
    margin: '100vh 0',
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
});

const stages = [
  // Default stage
  {
    bound: [5550, 5650],
    isInitialGapVisible: false,
    isFinalGapVisible: false,
    isPercentGrowthVisible: false,
    lineVisibility: [false, false],
  },
  // Stage 1: showing initial gap
  {
    bound: [5550, 5650],
    isInitialGapVisible: true,
    isFinalGapVisible: false,
    isPercentGrowthVisible: false,
    lineVisibility: [false, false],
  },
  // Stage 2: show NP2 growth
  {
    bound: [0, 14000],
    isInitialGapVisible: false,
    isFinalGapVisible: false,
    isPercentGrowthVisible: false,
    lineVisibility: [false, true],
  },
  // Stage 3: show NP1 growth and compare with NP2
  {
    bound: [0, 14000],
    isInitialGapVisible: true,
    isFinalGapVisible: true,
    isPercentGrowthVisible: false,
    lineVisibility: [true, true],
  },
  // Stage 4: emphasize NP1 growth
  {
    bound: [0, 14000],
    isInitialGapVisible: false,
    isFinalGapVisible: false,
    isPercentGrowthVisible: true,
    lineVisibility: [true, false],
  },
  // Stage 5: compare NP3 growth
  {
    bound: [0, 19000],
    isInitialGapVisible: false, // TODO: DEFAULT ALL VISIBILITY PROPS TO FALSE
    isFinalGapVisible: false,
    isPercentGrowthVisible: false,
    lineVisibility: [true, false, true],
  },
  // Stage 6: compare NP4 growth
  {
    bound: [0, 29000],
    isInitialGapVisible: false,
    isFinalGapVisible: false,
    isPercentGrowthVisible: false,
    lineVisibility: [true, false, true, true],
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
        <div className={classes.container}>
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
      </div>
    );
  }
}

export default injectSheet(styles)(App);
