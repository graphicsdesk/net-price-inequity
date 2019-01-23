import React, { Component } from 'react';
import injectSheet from 'react-jss';
import archieml from 'archieml';
import { Scrollama, Step } from 'react-scrollama';

import LineChart from './LineChart';
import copy from './copy';
import { animTime, shortLineAnimTime } from './constants';
import { boundsAreEqual, preprocess, isEqual } from './utils';

const styles = theme => ({
  header: {
    margin: '2em auto 0 auto',
    maxWidth: '15em',
    fontFamily: 'Roboto',
    fontSize: '4rem',
    fontWeight: 400,
    textAlign: 'center',
  },
  byline: {
    margin: '2rem 0',
    fontFamily: 'Roboto',
    fontSize: '1.2rem',
    fontWeight: 700,
    textAlign: 'center',
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
});

const stages = [
  // Initial stage
  {
    bound: [4000, 19000],
    isInitialGapVisible: false,
    isFinalGapVisible: false,
    isPercentGrowthVisible: false,
    lineVisibility: [false, false, false],
  },
  // Stage 1: initial iq0 and iq2 comparison
  {
    bound: [4000, 19000],
    isInitialGapVisible: true,
    isFinalGapVisible: false,
    isPercentGrowthVisible: false,
    lineVisibility: [false, false, false],
  },
  // Stage 2: how iq2 grew
  {
    bound: [4000, 19000],
    isInitialGapVisible: false,
    isFinalGapVisible: false,
    isPercentGrowthVisible: false,
    lineVisibility: [false, false, true],
  },
  // Stage 3: how iq0 grew
  {
    bound: [4000, 19000],
    isInitialGapVisible: false,
    isFinalGapVisible: false,
    isPercentGrowthVisible: false,
    lineVisibility: [true, false, true],
  },
  // Stage 4: show end comparison
  {
    bound: [4000, 19000],
    isInitialGapVisible: false,
    isFinalGapVisible: true,
    isPercentGrowthVisible: false,
    lineVisibility: [true, false, true],
  },
  // Stage 4: look at iq3 too!
  {
    bound: [4000, 29000],
    isInitialGapVisible: false,
    isFinalGapVisible: false,
    isPercentGrowthVisible: false,
    lineVisibility: [true, false, true, true],
  },
  // Stage 5: transition question
  {
    bound: [4000, 29000],
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
        <h1 className={classes.header}>
          
         After $185 million in diversity funding, a look at tenure-track female representation.
        </h1>
        <div className={classes.byline}>by Jason Kao</div>
        <div className={classes.content}>
          <p>The amount of financial aid Columbia gives its incoming undergraduates has nearly doubled since it adopted a “need-blind, full-need” approach in 2008.</p>
          <p>However, a Spectator analysis has revealed that this aid may not be flowing to those who need it the most. Federal data show that while the average net price—the total cost of attendance after grants and scholarships are subtracted—for middle and higher income students has decreased considerably, the net price for low income students has nearly doubled.</p>
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
          <p>Researchers point to several reasons why students from wealthier backgrounds may receive more aid, the most notable being that tax breaks disproportionately benefit higher income households. In 2015, The Congressional Research Service found that over a fifth of tax deductions given under the American Opportunity Tax Credit went to households earning over $100,000 a year, compared to 30% of households earning less than $30,000.</p>

          <p>Tax benefits certainly help middle and higher income families—especially at expensive private institutions like Columbia. “The purpose of the tax credits was to make college more affordable for middle-income students,” noted Stephen Burd, a policy analyst at the New America Foundation, in an interview for The Hechinger Report. “The problem is that the tax credits are going beyond the middle class.”</p>
          <p>A major proponent of these disparities is the information divide between students at urban schools and students at suburban and private schools. A national study conducted by the National Association for College Admission Counseling revealed that students at urban schools were much less likely to have spoken to a college counselor than those at suburban and private schools.</p>
<p>Furthermore, a survey conducted by the financial services firm Edward Jones revealed that less than one in five households earning under $35,000 a year know about 529 plans—college savings plans that give extensive tax and financial aid benefits—compared to nearly half of households that earn over $100,000.</p>
<p>But net price patterns from peer institutions indicate that this rationale may be overgeneralized. Several institutions with similar endowment sizes, selectivities, and financial aid policies to Columbia have net price variabilities that are not as inequitable as Columbia’s. In the last decade, the University of Chicago, the Massachusetts Institute of Technology, and Northwestern University saw a trend of descent in their net prices that was shared equally across every income bracket.</p>
        </div>
      </div>
    );
  }
}

export default injectSheet(styles)(App);
