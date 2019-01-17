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

const styles = {
  graph: {
    '& text': {
      stroke: '#282828',
      fontSize: '0.9rem',
      fontFamily: 'Roboto',
      fontWeight: 300,
    },
    '& .domain': {
      display: 'none',
    },
  },
  yAxis: {
    '& > g.tick line': {
      stroke: '#ddd',
    },
    '& g:nth-child(2) text': {
      // first tick
      display: 'none',
    },
  },
  axisLabel: {
    textAnchor: 'middle',
    fontSize: '1rem !important',
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

    const bounds = [
      // y-scale bounds for each stage
      [5000, 6000],
      [0, 14000],
    ];
    const stageNum = 0;

    this.state = {
      svgWidth,
      svgHeight,
      gWidth,
      gHeight,

      bounds,
      stageNum,

      xScale: scaleLinear()
        .domain([startYear, endYear])
        .range([0, gWidth]),
      yScale: scaleLinear()
        .domain(bounds[stageNum])
        .range([gHeight, 0]),

      axisDelay: 0,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { yScale, bounds } = this.state;
    let { stageNum } = this.state;
    let axisDelay = 0;

    if (stageNum === 0) {
      if (!prevProps.areLinesVisible && this.props.areLinesVisible) {
        // Lines have become visible; move on to next stage.
        stageNum++;
      } else if (prevProps.arePointsVisible && !this.props.arePointsVisible) {
        // Points just got hidden, remove axisDelay
        axisDelay = 0;
      } else {
        return;
      }
    } else if (
      stageNum === 1 &&
      prevProps.areLinesVisible &&
      !this.props.areLinesVisible
    ) {
      // Lines should hide. Go to previous stage.
      stageNum--;
      axisDelay = lineAnimTime; // before the axis scales back, wait for lines to undraw
    } else {
      return;
    }

    this.setState({
      yScale: yScale.domain(bounds[stageNum]),
      stageNum,
      axisDelay,
    });
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
        <g
          className={classes.graph}
          transform={`translate(${margin.left}, ${margin.top})`}
        >
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

          {/* x axis */}
          <text
            className={classes.axisLabel}
            x={gWidth / 2}
            y={gHeight + margin.bottom / 2}
          >
            Academic year
          </text>

          {/* y axis */}
          <text
            className={classes.axisLabel}
            x={gWidth}
            y={gHeight / 2}
            transform={`rotate(90, ${gWidth}, ${gHeight / 2})`}
          >
            Dollars (adjusted to 2016)
          </text>

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
