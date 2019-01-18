import React from 'react';
import injectSheet from 'react-jss';
import { select as d3Select } from 'd3-selection';
import { animTime, pointRadius } from './constants';

const styles = theme => ({
  point: {
    fill: props => theme[props.theme],
  },
});

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
    r={pointRadius}
  />
);

export default injectSheet(styles)(Point);
