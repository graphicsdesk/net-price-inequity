import React, { Component } from 'react';
import injectSheet from 'react-jss';
import archieml from 'archieml';
import { Scrollama, Step } from 'react-scrollama';

import LineChart from './LineChart';
import copy from './copy';
import { animTime, shortLineAnimTime } from './constants';
import { boundsAreEqual } from './utils';

const styles = {
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
    maxWidth: '400px',
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
};

const stages = [
  // Default stage
  {
    bound: [5550, 5650],
    isInitialGapVisible: true,
    isFinalGapVisible: false,
    areLinesVisible: false,
  },
  // Stage 1: showing initial gap
  {
    bound: [5550, 5650],
    isInitialGapVisible: true,
    isFinalGapVisible: false,
    areLinesVisible: false,
  },
  // Stage 2: growing lines
  {
    bound: [0, 14000],
    isInitialGapVisible: false,
    isFinalGapVisible: false,
    areLinesVisible: true,
  },
  // Stage 3: showing gap differences
  {
    bound: [0, 14000],
    isInitialGapVisible: true,
    isFinalGapVisible: true,
    areLinesVisible: true,
  },
];

const steps = archieml.load(copy).steps;

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
      console.log('GOING FORWARD');

      if (boundChanged) {
        console.log('first change scale', { ...this.state, bound });
        this.setState({ ...this.state, bound });

        setTimeout(() => {
          console.log('then', newStage);
          this.setState(newStage);
        }, animTime);
      } else {
        console.log('no scale change, just', newStage);
        this.setState(newStage);
      }
    } else {
      console.log('GOING BACKWARDS');
      console.log('first undraw stuff', withoutBound);
      this.setState(withoutBound);

      if (boundChanged) {
        setTimeout(() => {
          console.log('then', newStage);
          this.setState(newStage);
        }, shortLineAnimTime);
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
                    <p className={classes.stepText}>{text}</p>
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
