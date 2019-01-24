import React from 'react';
import injectSheet from 'react-jss';
import { animDuration } from './constants';
import { percentageFormat } from './utils';

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
    fill: props => (props.percent > 0 ? 'green' : 'red'),
    fontWeight: 400,
  },
});

const PercentLabel = ({ classes, isVisible, x, y, percent }) => (
  <g className={isVisible ? classes.visible : classes.hidden}>
    <text className={classes.text} x={x} y={y}>
      {percentageFormat(percent)}
    </text>
  </g>
);

export default injectSheet(styles)(PercentLabel);
