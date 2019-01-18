import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';

import { scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import { axisBottom, axisRight } from 'd3-axis';
import { select as d3Select } from 'd3-selection';

import Line from './Line';
import VerticalArrow from './VerticalArrow';
import data from './data';
import { animTime, lineAnimTime, pointRadius } from './constants';

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
    const svgHeight = window.innerHeight * 0.95;
    const gWidth = svgWidth - margin.left - margin.right;
    const gHeight = svgHeight - margin.bottom - margin.top;

    const bounds = [
      // y-scale bounds for each stage
      [5550, 5650],
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
      } else if (
        prevProps.isInitialGapVisible &&
        !this.props.isInitialGapVisible
      ) {
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
      yScale: yScale.copy().domain(bounds[stageNum]),
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
    const {
      classes,
      areLinesVisible,
      isInitialGapVisible,
      areMoreLinesVisible,
    } = this.props;

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
                .delay(axisDelay)
                .duration(animTime)
                .call(yAxis)}
          />

          {/* x axis */}
          <text
            className={classes.axisLabel}
            x={gWidth / 2}
            y={gHeight + margin.bottom * 2 / 3}
          >
            Academic year
          </text>

          {/* y axis */}
          <text
            className={classes.axisLabel}
            x={gWidth + margin.right * 4 / 5}
            y={gHeight / 2}
            transform={`rotate(90, ${gWidth + margin.right * 4 / 5}, ${gHeight /
              2})`}
          >
            Dollars (adjusted to 2016)
          </text>

          <Line
            generator={lineGenerator}
            xScale={xScale}
            yScale={yScale}
            data={data.np2}
            axisDelay={axisDelay}
            isVisible={areLinesVisible}
            theme="secondary"
          />
          <Line
            generator={lineGenerator}
            xScale={xScale}
            yScale={yScale}
            data={data.np1}
            axisDelay={axisDelay}
            isVisible={areLinesVisible}
            theme="primary"
          />

          {/*<Line
            pathDefinition={lineGenerator(data.np3)}
            shouldWait={axisDelay === 0}
            isVisible={areMoreLinesVisible}
          />
          <Line
            pathDefinition={lineGenerator(data.np4)}
            shouldWait={axisDelay === 0}
            isVisible={areMoreLinesVisible}
          />*/}

          <VerticalArrow
            x={xScale(2008)}
            y0={yScale(data.np2[0])}
            y1={yScale(data.np1[0])}
            isVisible={!areLinesVisible}
          />
        </g>
      </svg>
    );
  }
}

export default injectSheet(styles)(LineChart);
