import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
import archieml from 'archieml';
import { Scrollama, Step } from 'react-scrollama';

import LineChart from './LineChart';
import { animTime } from './constants';
import copy from './copy';

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
    isFinalGapVisible: true,
    areLinesVisible: true, // TODO: add persistence unless stated otherwise, but onnly in the forwards direction
  },
];

class App extends PureComponent {
  state = {
    stageNum: 0,
    bound: [5550, 5650],
    chartProps: stages[0],
    steps: archieml.load(copy).steps,
  };

  actions = this.state.steps.map((_, index) => direction => {
    const isMovingForward = direction === 'down';
    const newStage = stages[isMovingForward ? index + 1 : index];
    const { bound, ...withoutBound } = newStage;

    withoutBound.bound = this.state.bound;
    if (isMovingForward) {
      this.setState({ chartProps: withoutBound });
    } else {
      this.setState({ chartProps: { bound } });
    }
    setTimeout(() => this.setState({ chartProps: newStage }), 250);
  });

  onStepEnter = ({ element, data, direction }) => {
    const action = this.actions[data];
    typeof action === 'function' && action(direction);
  };

  onStepExit = ({ element, data, direction }) => {
    const action = this.actions[data];
    typeof action === 'function' && action(direction);
  };

  render() {
    const { stageNum, steps, chartProps } = this.state;
    const { classes } = this.props;
    return (
      <div>
        <div className={classes.container}>
          <figure className={classes.sticky}>
            <LineChart {...chartProps} />
          </figure>
          <article className={classes.steps}>
            <Scrollama
              offset={0.45}
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
