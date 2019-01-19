import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
import archieml from 'archieml';
import { Scrollama, Step } from 'react-scrollama';

import LineChart from './LineChart';
import copy from './copy';
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
  {
    bound: [5550, 5650],
    isInitialGapVisible: true,
  },
  {
    bound: [5550, 5650],
    isInitialGapVisible: true,
  },
  {
    bound: [0, 14000],
    areLinesVisible: true,
  },
  {
    bound: [0, 14000],
    isInitialGapVisible: true,
    isFinalGapVisible: true,
    areLinesVisible: true,
  },
];

class App extends PureComponent {
  state = {
    chartProps: stages[0],
    steps: archieml.load(copy).steps,
  };

  // TODO: WE NEED EXIT FUNCTIONS FOR IF WE LEAVE STPE IN THE MIDDLE

  actions = this.state.steps.map((_, index) => (state, direction) => {
    console.log(state, direction);
    const goingForward = direction === 'down';
    const newStage = stages[goingForward ? index + 1 : index];
    const { bound, ...withoutBound } = newStage;

    const { chartProps: oldChartProps } = this.state;
    const boundChanged = !boundsAreEqual(oldChartProps.bound, bound);

    withoutBound.bound = oldChartProps.bound;
    if (goingForward) {
      console.log('GOING FORWARD');
      console.log('first', withoutBound);
      this.setState({ chartProps: withoutBound });

      if (boundChanged) {
        setTimeout(() => {
          console.log('then', { ...this.state.chartProps, bound });
          this.setState({ chartProps: { ...this.state.chartProps, bound } });
        }, 300);
      } else {
        console.log('no then');
      }
    } else {
      console.log('GOING BACKWARDS');
      if (boundChanged) {
        // Bound changed
        // TODO: WHY 250 AND NOT ANIMTIME?
        console.log('BOUND CHANGED');
        console.log('first', { bound });
        this.setState({ chartProps: { bound } });
        setTimeout(() => {
          console.log('then', newStage);
          this.setState({ chartProps: newStage });
        }, 1000);
      } else {
        console.log('no then');
        this.setState({ chartProps: newStage });
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
    const { steps, chartProps } = this.state;
    const { classes } = this.props;
    return (
      <div>
        <div className={classes.container}>
          <figure className={classes.sticky}>
            <LineChart {...chartProps} />
          </figure>
          <article className={classes.steps}>
            <Scrollama
              offset={0.5}
              onStepEnter={this.onStepEnter}
              onStepExit={this.onStepExit}
              debug
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
