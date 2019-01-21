import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';

import { scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import { axisBottom, axisRight } from 'd3-axis';
import { select as d3Select } from 'd3-selection';

import Line from './Line';
import GapArrow from './GapArrow';
import data from './data';
import { animTime } from './constants';
import { allThemes } from './theme';

const startYear = 2008;
const endYear = 2016;
const years = [];
for (let i = startYear; i <= endYear; i++) years.push(i);

const margin = {};
margin.top = margin.left = 40;
margin.bottom = margin.right = 80;

const styles = {
  graph: {
    '& text': {
      strokeWidth: 0,
      fontFamily: 'Roboto',
      fontWeight: 300,
    },
    '& .domain': {
      display: 'none',
    },
  },
  yAxis: {
    '& text': {
      fontSize: '0.9rem',
      color: '#999',
    },
    '& > g.tick line': {
      stroke: '#ddd',
    },
    '& g:nth-child(2) text': {
      // first tick
      display: 'none',
    },
  },
  xAxis: {
    '& text': {
      fontSize: '0.9rem',
      color: '#999',
    },
  },
  axisLabel: {
    textAnchor: 'middle',
    fontSize: '1rem !important',
  },
};

class LineChart extends PureComponent {
  constructor(props) {
    super(props);

    const svgWidth = window.innerWidth * 0.95;
    const svgHeight = window.innerHeight * 0.95;
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
    };
  }

  render() {
    const { svgWidth, svgHeight, gWidth, gHeight, xScale } = this.state;
    const {
      classes,
      bound,
      isInitialGapVisible = false,
      lineVisibility,
      isFinalGapVisible = false,
      isPercentGrowthVisible = false,
    } = this.props;

    const lineIndices = [1, 0, 2, 3]; // the order in which lines are rendered

    const yScale = scaleLinear()
      .domain(bound)
      .range([gHeight, 0]);

    const xAxis = axisBottom(xScale)
      .tickSize(0)
      .tickPadding(10)
      .tickFormat(x => x);
    const yAxis = axisRight(yScale)
      .tickSize(gWidth)
      .tickPadding(10)
      .ticks(5);

    const lineGenerator = line()
      .x((_, i) => xScale(startYear + i))
      .y(yScale);

    return (
      <svg height={svgHeight} width={svgWidth}>
        <defs>
          <marker
            id="arrowHead"
            orient="auto"
            markerWidth="8"
            markerHeight="8"
            refX="0.1"
            refY="4"
          >
            <path d="M0,0 V8 L8,4 Z" fill="black" />
          </marker>
        </defs>

        <g
          className={classes.graph}
          transform={`translate(${margin.left}, ${margin.top})`}
        >
          <g
            className={classes.xAxis}
            ref={node => d3Select(node).call(xAxis)}
            style={{ transform: `translateY(${gHeight}px)` }}
          />
          <g
            className={classes.yAxis}
            ref={node =>
              d3Select(node)
                .transition()
                .duration(animTime)
                .call(yAxis)}
          />

          {/* x axis label */}
          <text
            className={classes.axisLabel}
            x={gWidth / 2}
            y={gHeight + margin.bottom * 2 / 3}
          >
            Year (autumn)
          </text>

          {/* y axis label */}
          <text
            className={classes.axisLabel}
            x={gWidth + margin.right * 4 / 5}
            y={gHeight / 2}
            transform={`rotate(90, ${gWidth + margin.right * 4 / 5}, ${gHeight /
              2})`}
          >
            Inflation-adjusted dollars
          </text>

          {lineIndices.map(index => (
            <Line
              key={index}
              generator={lineGenerator}
              xScale={xScale}
              yScale={yScale}
              data={data[index]}
              isVisible={lineVisibility[index]}
              theme={allThemes[index]}
              incomeBracket={index}
              isPercentGrowthVisible={isPercentGrowthVisible}
            />
          ))}

          <GapArrow
            x={xScale(startYear)}
            y0={yScale(data[1][0])}
            y1={yScale(data[0][0])}
            difference="$14"
            label="lower"
            isVisible={isInitialGapVisible}
          />

          <GapArrow
            x={xScale(endYear)}
            y0={yScale(data[1][data[1].length - 1])}
            y1={yScale(data[0][data[0].length - 1])}
            difference="$4,321"
            label="higher"
            labelSide="left"
            isVisible={isFinalGapVisible}
          />
        </g>
      </svg>
    );
  }
}

export default injectSheet(styles)(LineChart);
