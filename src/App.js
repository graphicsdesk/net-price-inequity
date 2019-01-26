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
  container: {
    marginBottom: '2rem',
  },
  blueHighlight: {
    padding: '0 4px',
    paddingBottom: '3px',
    display: 'inline-block',
    lineHeight: 1.2,
    color: '#fff',
    backgroundColor: theme.primary,
  },
  greenHighlight: {
    padding: '0 4px',
    paddingBottom: '3px',
    display: 'inline-block',
    lineHeight: 1.2,
    color: '#fff',
    backgroundColor: theme.tertiary,
  },
  bannerContainer: {
    display: 'flex',
    justifyContent: 'center',
    margin: '6em auto 1rem auto',
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
    lineHeight: 1.4,
    maxWidth: '19em',
    fontFamily: 'Roboto',
    fontSize: '3rem',
    fontWeight: 400,
    textAlign: 'center',
    margin: '0 auto',
  },
  byline: {
    margin: '2em 0',
    fontFamily: 'Roboto',
    fontSize: '1.2rem',
    fontWeight: 700,
    textAlign: 'center',
    '& a': {
      borderBottom: 0,
      color: '#282828',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
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
      margin: '0 auto',
      maxWidth: '650px',
    },
  },
  imgContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  img: {
    maxWidth: '600px',
    width: '90vw',
    maxHeight: '600px',
    height: '90vw',
  },
  graphicContainer: {
    margin: '5vh 0',
  },
  steps: {
    padding: '0 5vw 130vh 5vw',
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
      fontSize: '9vw',
    },
    img: {
      width: '100vw',
    },
  },
});

const stages = [
  // Initial stage
  {
    stageNum: 0,
    bound: [lowBound, smallUpperBound],
    isInitialGapVisible: false,
    isFinalGapVisible: false,
    lineVisibility: [false, false, false],
  },
  // Stage 1: initial iq0 and iq2 comparison
  {
    stageNum: 1,
    bound: [lowBound, smallUpperBound],
    isInitialGapVisible: true,
    isFinalGapVisible: false,
    lineVisibility: [false, false, false],
  },
  // Stage 2: how iq2 grew
  {
    stageNum: 2,
    bound: [lowBound, smallUpperBound],
    isInitialGapVisible: false,
    isFinalGapVisible: false,
    lineVisibility: [false, false, true],
  },
  // Stage 3: how iq0 grew
  {
    stageNum: 3,
    bound: [lowBound, smallUpperBound],
    isInitialGapVisible: false,
    isFinalGapVisible: false,
    lineVisibility: [true, false, true],
  },
  // Stage 4: show end comparison
  {
    stageNum: 4,
    bound: [lowBound, smallUpperBound],
    isInitialGapVisible: false,
    isFinalGapVisible: true,
    lineVisibility: [true, false, true],
  },
  // Stage 4: show end comparison
  {
    bound: [lowBound, smallUpperBound],
    isInitialGapVisible: false,
    isFinalGapVisible: false,
    percentVisibility: [false, false, false, false, false],
    lineVisibility: [false, true, true, false],
  },
  // Stage 4: look at iq3 too!
  {
    bound: [lowBound, midUpperBound],
    isInitialGapVisible: false,
    isFinalGapVisible: false,
    percentVisibility: [false, false, false, true],
    lineVisibility: [false, false, true, true],
  },
  // Stage 5: look at iq4 too!
  {
    bound: [lowBound, bigUpperBound],
    isInitialGapVisible: false,
    isFinalGapVisible: false,
    percentVisibility: [false, false, false, false, true],
    lineVisibility: [false, false, true, true, true],
  },
  // Stage 6: transition question
  {
    bound: [lowBound, midUpperBound],
    isInitialGapVisible: false,
    isFinalGapVisible: false,
    percentVisibility: [false, false, false, false, false],
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

  onStepEnter = ({ data, direction }) => {
    const action = this.actions[data];
    typeof action === 'function' && action('enter', direction);
  };

  onStepExit = ({ data, direction }) => {
    const action = this.actions[data];
    typeof action === 'function' && action('exit', direction);
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <div className={classes.bannerContainer}>
          <div className={classes.banner}>News | Administration</div>
        </div>
        <h1 className={classes.header}>
          <span className={classes.blueHighlight}>Lower-income</span>{' '}
          undergraduate students are paying{' '}
          <span className={classes.blueHighlight}>more and more</span> to attend
          Columbia;{' '}
          <span className={classes.greenHighlight}>wealthier students</span> are
          paying <span className={classes.greenHighlight}>less and less</span>,
          federal data shows
        </h1>
        <div className={classes.byline}>
          BY{' '}
          <a
            href="https://www.columbiaspectator.com/contributors/Jason-Kao/"
            target="_blank"
            rel="noopener noreferrer"
          >
            JASON KAO
          </a>{' '}
          | <span className={classes.dateline}>January 24, 2019</span>
        </div>
        <div className={classes.content}>
          <p>
            The amount of financial aid Columbia offers its incoming
            undergraduates has nearly doubled since the University adopted a
            &ldquo;<a href="https://cc-seas.financialaid.columbia.edu/how/aid/works">
              need-based, need-blind, full-need
            </a>&rdquo; approach for Columbia College and School of Engineering
            and Applied Sciences students in 2008, according to data from the
            National Center for Education Statistics.
          </p>
          <p>
            The data, which Columbia is mandated to report due to the{' '}
            <a href="https://www2.ed.gov/policy/highered/leg/hea08/index.html">
              Higher Education Opportunity Act of 2008
            </a>, shows that over the past decade, the net price—the total cost
            of attending Columbia after grants and scholarships are
            subtracted—for middle- and higher-income students has steadily
            decreased. Yet, the net price for low-income students has steadily
            risen.
          </p>
          <p>
            The NCES data describes financial aid for first-time, full-time
            (FTFT) undergraduates who received federal aid at CC,SEAS, and
            School of General Studies. Unlike the other two, General Studies{' '}
            <a href="https://www.columbiaspectator.com/news/2017/11/14/public-health-professor-lisa-rosen-metsch-appointed-dean-of-general-studies/">
              does not have the financial resources
            </a>{' '}
            to take a need-blind, full-need approach.
          </p>
          <p>
            The following interactive graphic looks at average net prices at
            Columbia across the five income brackets over the last decade.
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
            Net price data provided by the University hints at a possible driver
            of these inequities: General Studies. The data shows that net prices
            for only CC and SEAS do not exhibit the same disproportionate trends
            that the federal data, which includes GS, show.
          </p>
          <div className={classes.imgContainer}>
            <img
              src="https://arc-anglerfish-arc2-prod-spectator.s3.amazonaws.com/public/5WK2NUBKVZDBDHZC5SD6QPSNLE.png"
              alt="CC SEAS Average net prices"
              className={classes.img}
            />
          </div>
          <p>
            Reflecting on broader trends in higher education, researchers also
            point to several external reasons why students from wealthier
            backgrounds may receive more aid—most notably, tax breaks that
            disproportionately benefit higher-income households.
          </p>
          <p>
            In 2015, the Congressional Research Service found that{' '}
            <a href="https://fas.org/sgp/crs/misc/R42561.pdf">
              over a fifth
            </a>{' '}
            of tax deductions given under the{' '}
            <a href="https://www.irs.gov/credits-deductions/individuals/aotc">
              American Opportunity Tax Credit
            </a>{' '}
            went to households earning more than $100,000 a year, compared to 30
            percent of households earning less than $30,000.
          </p>
          <p>
            Another tax benefit—the 529 college savings plan—offers{' '}
            <a href="https://www.forbes.com/sites/elizabethharris/2017/07/30/study-almost-no-one-uses-529-college-savings-accounts-even-though-they-work-incredibly-well-yikes/#337f89cf5409">
              extensive tax and financial aid benefits
            </a>. Yet a survey conducted by the financial services firm Edward
            Jones revealed that{' '}
            <a href="https://www.edwardjones.com/about/media/news-releases/529-plan-awareness.html">
              less than one in five
            </a>{' '}
            households earning under $35,000 a year know about these deductions,
            compared to nearly half of all households that earn over $100,000 a
            year.
          </p>
          <p>
            This disparity is part of a larger informational divide between
            students in inner-city schools and students at private and suburban
            schools. A{' '}
            <a href="https://web.archive.org/web/20150910110039/http://www.nacacnet.org/research/research-data/nacac-research/Documents/NACAC_Counseling_PhaseII.pdf">
              national study
            </a>{' '}
            conducted by the National Association for College Admission
            Counseling revealed that students at urban schools were much less
            likely to have spoken to a college counselor than those at suburban
            and private schools.
          </p>
          <p>
            Education tax benefits can certainly assist middle- and
            higher-income families—especially at expensive private institutions
            like Columbia.
          </p>
          <p>
            &ldquo;The purpose of the tax credits was to make college more
            affordable for middle-income students,&rdquo; Stephen Burd, a policy
            analyst at the New America Foundation, noted in an{' '}
            <a href="https://hechingerreport.org/college-federal-financial-aid-increasingly-benefits-rich/">
              interview for The Hechinger Report
            </a>. &ldquo;The problem is that the tax credits are going beyond
            the middle class.&rdquo;
          </p>
          <p>
            Nevertheless, the data do not point to specific internal factors
            that could have caused the net price cutbacks to favor higher income
            ranges.
          </p>
          <p>
            &ldquo;I know people don’t often think that there’s a bottom line,
            but there is. And so do we help more people with less money or do we
            help less people with more money?&rdquo; Director of Financial
            Services at Ithaca College Lisa Hoskey said for{' '}
            <a href="https://hechingerreport.org/era-inequity-college-financial-aid-going-rich/">
              The Report
            </a>.
          </p>
        </div>
        <div className={classes.content}>
          <p>
            <i>
              Graphics Deputy Editor Jason Kao can be contacted at{' '}
              <a href="mailto:jason.kao@columbiaspectator.com">
                jason.kao@columbiaspectator.com
              </a>. Follow Spec on Twitter{' '}
              <a href="https://twitter.com/ColumbiaSpec">@ColumbiaSpec</a>.
            </i>
          </p>
        </div>
      </div>
    );
  }
}

export default injectSheet(styles)(App);
