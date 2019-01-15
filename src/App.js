import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
import archieml from 'archieml';
import { Scrollama, Step } from 'react-scrollama';

import copy from './copy';

const styles = {
  sticky: {
    position: 'sticky',
    width: '100%',
    height: '100vh',
    top: 0,
    background: '#ccc',
  },
  steps: {
    padding: '0 5vw 70vh 0',
  },
  step: {
    position: 'relative',
    backgroundColor: '#fff',
    margin: '0 auto 60vh auto',
    maxWidth: '400px',
    border: '1px solid #333',
    '& p': {
      textAlign: 'center',
      padding: '1rem',
      fontSize: '1.5rem',
    },
    '&:last-child': {
      marginBottom: 0,
    },
  },
};

class MainApp extends PureComponent {
  state = {
    data: 0,
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
    const { data, steps } = this.state;
    const { classes } = this.props;

    /*const countries = worlddata.features
     .map((d,i) => <path
     key={'path' + i}
     d={pathGenerator(d)}
     className='countries'
     />);
    <svg width={500} height={500}>
   {countries}
   </svg>*/

    return (
      <div>
        <div className={classes.container}>
          <figure className={classes.sticky} />
          <article className={classes.steps}>
            <Scrollama
              offset={0.4}
              onStepEnter={this.onStepEnter}
              onStepExit={this.onStepExit}
            >
              {steps.map(({ text }, index) => (
                <Step data={text} key={text + '-' + index}>
                  <div className={classes.step}>
                    <p>{text}</p>
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
