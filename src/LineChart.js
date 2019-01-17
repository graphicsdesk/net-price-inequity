import React, { PureComponent, Fragment } from 'react';
import injectSheet from 'react-jss';

import { scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import { axisBottom, axisRight } from 'd3-axis';
import { select as d3Select } from 'd3-selection';
import { animTime, lineAnimTime } from './constants';

import Line from './AnimatedLine';
import Point from './Point';
import data from './data';

const axisStyles = {
  '& > .domain': {
    display: 'none',
  },
  '& text': {
    stroke: '#282828',
    fontSize: '0.9rem',
    fontFamily: 'Roboto',
    fontWeight: 300,
  },
};

const styles = {
  yAxis: {
    ...axisStyles,
    '& > g.tick line': {
      stroke: '#ddd',
    },
    '& g:nth-child(2) text': {
      // first tick
      display: 'none',
    },
  },
  xAxis: {
    ...axisStyles,
  },
};

const startYear = 2008;
const endYear = 2016;
const years = [];
for (let i = startYear; i <= endYear; i++) years.push(i);

const margin = {};
margin.top = margin.left = 40;
margin.bottom = margin.right = 80;

class LineChart extends PureComponent {
  constructor(props) {
    super(props);

    const svgWidth = window.innerWidth * 0.95;
    const svgHeight = window.innerHeight * 0.9;
    const gWidth = svgWidth - margin.left - margin.right;
    const gHeight = svgHeight - margin.bottom - margin.top;

    this.state = {
      svgWidth,
      svgHeight,
      gWidth,
      gHeight,

      xScale: scaleLinear()
        .domain([startYear, endYear])
        .range([0, gWidth]),
      yScale: scaleLinear()
        .domain([4000, 6000])
        .range([gHeight, 0]),

      grew: false,
      axisDelay: 0,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.arePointsVisible) {
      const { yScale, grew } = this.state;
      if (!prevProps.areLinesVisible && this.props.areLinesVisible && !grew) {
        // Grow the axis scale immediately
        this.setState({
          yScale: yScale.domain([0, 14000]),
          grew: true,
          axisDelay: 0,
        });
      }
      if (prevProps.areLinesVisible && !this.props.areLinesVisible && grew) {
        // Wait for lines to undraw, then shrink the axis scale back
        this.setState({
          yScale: yScale.domain([4000, 6000]),
          grew: false,
          axisDelay: lineAnimTime,
        });
      }
    }

    if (!this.props.arePointsVisible && this.state.axisDelay > 0) {
      this.setState({ axisDelay: 0 });
    }
  }

  render() {
    const {
      svgWidth,
      svgHeight,
      gWidth,
      gHeight,
      xScale,
      yScale,
      axisDelay,
    } = this.state;
    const { classes, areLinesVisible, arePointsVisible } = this.props;

    const xAxis = axisBottom(xScale)
      .tickSize(0)
      .tickPadding(10)
      .tickFormat(x => x);
    const yAxis = axisRight(yScale)
      .tickSize(gWidth)
      .tickPadding(10)
      .ticks(6);

    const lineGenerator = line()
      .x((_, i) => xScale(startYear + i))
      .y(yScale);

    return (
      <svg height={svgHeight} width={svgWidth}>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          <g
            className={classes.xAxis}
            ref={node =>
              d3Select(node)
                .transition()
                .delay(axisDelay)
                .duration(animTime)
                .call(xAxis)}
            style={{ transform: `translateY(${gHeight}px)` }}
          />
          <g
            className={classes.yAxis}
            ref={node =>
              d3Select(node)
                .transition()
                .delay(axisDelay)
                .duration(animTime)
                .call(yAxis)}
          />

          <Line
            data={lineGenerator(data.np1)}
            shouldWait={axisDelay === 0}
            areLinesVisible={areLinesVisible}
          />
          <Line
            data={lineGenerator(data.np2)}
            shouldWait={axisDelay === 0}
            areLinesVisible={areLinesVisible}
          />

          {arePointsVisible && (
            <Fragment>
              <Point
                x={xScale(2008)}
                y={yScale(data.np1[0])}
                delay={axisDelay}
              />
              <Point
                x={xScale(2008)}
                y={yScale(data.np2[0])}
                delay={axisDelay}
              />
            </Fragment>
          )}
        </g>
      </svg>
    );
  }
}

export default injectSheet(styles)(LineChart);
