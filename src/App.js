import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
import archieml from 'archieml';
import { Scrollama, Step } from 'react-scrollama';
import LineChart from './LineChart';
import copy from './copy';

const styles = {
  steps: {
    padding: '0 5vw 70vh 5vw',
  },
  step: {
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    margin: '0 auto 70vh auto',
    maxWidth: '400px',
    border: '1px solid #333',
    '&:last-child': {
      marginBottom: 0,
    },
  },
  stepText: {
    textAlign: 'center',
    padding: '1rem',
    fontSize: '1.5rem',
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

class MainApp extends PureComponent {
  state = {
    areLinesVisible: false,
    arePointsVisible: false,
    steps: archieml.load(copy).steps,
  };

  actions = [
    direction => this.setState({ arePointsVisible: direction === 'down' }),
    direction => this.setState({ areLinesVisible: direction === 'down' }),
  ];

  onStepEnter = ({ element, data, direction }) => {
    const action = this.actions[data];
    typeof action === 'function' && action(direction);
  };

  onStepExit = ({ element, data, direction }) => {
    const action = this.actions[data];
    typeof action === 'function' && action(direction);
  };

  render() {
    const { steps, areLinesVisible, arePointsVisible } = this.state;
    const { classes } = this.props;

    return (
      <div>
        <div className={classes.container}>
          <figure className={classes.sticky}>
            <LineChart
              areLinesVisible={areLinesVisible}
              arePointsVisible={arePointsVisible}
            />
          </figure>
          <article className={classes.steps}>
            <Scrollama
              offset={0.45}
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

export default injectSheet(styles)(MainApp);
