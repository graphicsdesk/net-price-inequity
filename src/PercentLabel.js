import React from 'react';
import injectSheet from 'react-jss';
import { select as d3Select } from 'd3-selection';
import { animTime, pointRadius, animDuration } from './constants';

const styles = theme => ({
  visible: {
    animation: 'fadeIn', // TODO: CENTRALIZE THESE ANIMATIONS
    animationDuration: animDuration,
  },
  hidden: {
    animation: 'fadeOut',
    animationDuration: animDuration,
    opacity: 0,
  },
  text: {
    fontFamily: 'Roboto',
    fill: theme    
  },
});

const Point = ({ classes, isVisible, x, y, percent }) => (
  <g className={isVisible ? classes.visible : classes.hidden}>
    <text
      className={classes.text}
      x={x}
      y={y}
    />
  </g>
);

export default injectSheet(styles)(Point);
