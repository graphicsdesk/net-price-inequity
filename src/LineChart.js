import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';

import { scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import { axisBottom, axisRight } from 'd3-axis';
import { select as d3Select } from 'd3-selection';

import Line from './AnimatedLine';
import data from './data';

const axisStyles = {
  '& > .domain': {
    display: 'none',
  },
  '& text': {
    stroke: '#282828',
    fontSize: '0.9rem',
    fontFamily: 'Roboto',
  }
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
  state = {
    svgWidth: window.innerWidth * 0.95,
    svgHeight: window.innerHeight * 0.9,
  };

  render() {
    const { svgWidth, svgHeight } = this.state;    
    const { classes } = this.props;

    const gWidth = svgWidth - margin.left - margin.right;
    const gHeight = svgHeight - margin.bottom - margin.top;

    const xScale = scaleLinear()
      .domain([startYear, endYear])
      .range([0, gWidth]);

    const yScale = scaleLinear()
      .domain([0, 14000])
      .range([gHeight, 0]);

    const xAxis = axisBottom(xScale).tickSize(0).tickPadding(10).tickFormat(x => x);
    const yAxis = axisRight(yScale).tickSize(gWidth).tickPadding(10).ticks(6);

    const lineGenerator = line()
      .x((_, i) => xScale(startYear + i))
      .y(yScale);

    return (
      <svg height={svgHeight} width={svgWidth}>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          <g
            className={classes.xAxis}
            ref={node => d3Select(node).call(xAxis)}
            style={{ transform: `translateY(${gHeight}px)` }}
          />
          <g
            className={classes.yAxis}
            ref={node => d3Select(node).call(yAxis)}
          />
          <Line d={lineGenerator(data.np1)} />
        </g>
      </svg>
    );
  }
}

export default injectSheet(styles)(LineChart);
