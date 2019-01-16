import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
import archieml from 'archieml';
import { Scrollama, Step } from 'react-scrollama';

import { scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import { axisBottom, axisLeft } from 'd3-axis';
import { select as d3Select } from 'd3-selection';

import copy from './copy';

const styles = {
  steps: {
    padding: '0 5vw 70vh 5vw',
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
  sticky: {
    position: 'sticky',
    width: '100%',
    height: '100vh',
    top: 0,
    background: '#ccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    fill: 'none',
    stroke: '#0F3E3F',
    strokeWidth: '2px',
  },
};

const data = {
  NPT41: [
    5592.8508095972,
    7245.788551926613,
    6914.296825882042,
    12857.287461448474,
    8502.65962256262,
    9470.846663148093,
    7371.11394647633,
    9677.694924426594,
    10917.0,
  ],
};

const startYear = 2008;
const endYear = 2016;
const years = [];
for (let i = startYear; i <= endYear; i++) years.push(i);

const margin = {};
margin.top = margin.bottom = margin.left = margin.right = 40;

class MainApp extends PureComponent {
  state = {
    steps: archieml.load(copy).steps,
    svgWidth: window.innerWidth * 0.95,
    svgHeight: window.innerHeight * 0.9,
  };

  onStepEnter = ({ element, data }) => {
    element.style.backgroundColor = 'lightgoldenrodyellow';
    this.setState({ data });
  };

  onStepExit = ({ element }) => {
    element.style.backgroundColor = '#fff';
  };

  render() {
    const { steps, svgHeight, svgWidth } = this.state;
    const { classes } = this.props;

    const gWidth = svgWidth - margin.left - margin.right;
    const gHeight = svgHeight - margin.bottom - margin.top;

    const xScale = scaleLinear()
      .domain([startYear, endYear])
      .range([0, gWidth]);
    const yScale = scaleLinear()
      .domain([0, 14000])
      .range([gHeight, 0]);

    const xAxis = axisBottom(xScale);
    const yAxis = axisLeft(yScale);

    const lineGenerator = line()
      .x((_, i) => xScale(startYear + i))
      .y(yScale);

    return (
      <div>
        <div className={classes.container}>
          <figure className={classes.sticky}>
            <svg height={svgHeight} width={svgWidth}>
              <g transform={`translate(${margin.left}, ${margin.top})`}>
                <path d={lineGenerator(data.NPT41)} className={classes.line} />
                <g
                  className={classes.xAxis}
                  ref={node => d3Select(node).call(xAxis)}
                  style={{ transform: `translateY(${gHeight}px)` }}
                />
                <g
                  className={classes.yAxis}
                  ref={node => d3Select(node).call(yAxis)}
                />
              </g>
            </svg>
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
