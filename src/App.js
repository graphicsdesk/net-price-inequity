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
    backgroundColor: '#fff',
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
    steps: archieml.load(copy).steps,
  };

  onStepEnter = ({ element, data }) => {
    element.style.backgroundColor = 'lightgoldenrodyellow';
    this.setState({ data });
  };

  onStepExit = ({ element }) => {
    element.style.backgroundColor = '#fff';
  };

  render() {
    const { steps } = this.state;
    const { classes } = this.props;

    return (
      <div>
        <div className={classes.container}>
          <figure className={classes.sticky}>
            <LineChart />
          </figure>
          <article className={classes.steps}>
            <Scrollama
              offset={0.4}
              onStepEnter={this.onStepEnter}
              onStepExit={this.onStepExit}
            >
              {steps.map(({ text }, index) => (
                <Step data={text} key={text + '-' + index}>
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
