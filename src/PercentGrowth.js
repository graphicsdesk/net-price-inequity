import React from 'react';
import injectSheet from 'react-jss';

import GapArrow from './GapArrow';
import { animDuration } from './constants';

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
  line: {
    strokeDasharray: '4',
    stroke: '#222',
    strokeWidth: 1,
  },
});

const PercentGrowth = ({ classes, isVisible, baseX, baseY, x, y }) => (
  <g className={isVisible ? classes.visible : classes.hidden}>
    <line className={classes.line} x1={baseX} x2={x} y1={baseY} y2={baseY} />
    <GapArrow
      x={x}
      y0={baseY}
      y1={y}
      difference="120%"
      label="increase"
      labelSide="left"
      isVisible
      noBottomPadding
    />
  </g>
);

export default injectSheet(styles)(PercentGrowth);
