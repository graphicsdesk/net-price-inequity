import React from 'react';
import injectSheet from 'react-jss';
import { select as d3Select } from 'd3-selection';
import { animTime } from './constants';

const styles = {
  point: {
    fill: 'red',
  },
};

const Point = ({ classes, x, y, delay }) => (
  <circle
    className={classes.point}
    ref={node =>
      d3Select(node)
        .transition()
        .delay(delay)
        .duration(animTime)
        .attr('cy', y)}
    cx={x}
    r={5}
  />
);

export default injectSheet(styles)(Point);
