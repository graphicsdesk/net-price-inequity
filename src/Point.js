import React from 'react';
import injectSheet from 'react-jss';
import { select as d3Select } from 'd3-selection';
import { animTime, pointRadius, animDuration } from './constants';

const styles = theme => ({
  visiblePoint: {
    animation: 'fadeIn', // TODO: CENTRALIZE THESE ANIMATIONS
    animationDuration: animDuration,
  },
  hiddenPoint: {
    animation: 'fadeOut',
    animationDuration: animDuration,
    opacity: 0,
  },
  circle: {
    fill: props => theme[props.theme],
    stroke: props => theme[props.theme],
  },
  circlePulse: {
    fill: props => theme[props.theme],
    stroke: props => theme[props.theme],
    animation: '1s pulse',
  },
  '@keyframes pulse': {
    from: {
      strokeWidth: 0,
      strokeOpacity: 1,
    },
    to: {
      strokeWidth: 19,
      strokeOpacity: 0,
    },
  },
});

const Point = ({ classes, isVisible, x, y, labelText, pulse }) => (
  <g className={isVisible ? classes.visiblePoint : classes.hiddenPoint}>
    <circle
      className={pulse ? classes.circlePulse : classes.circle}
      ref={node =>
        d3Select(node)
          .transition()
          .duration(animTime)
          .attr('cy', y)}
      cx={x}
      r={pointRadius}
    />
  </g>
);

export default injectSheet(styles)(Point);
