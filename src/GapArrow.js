import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
import { animDuration, pointRadius, arrowHeadSize } from './constants';

const styles = {
  container: {
    animationDuration: animDuration,
    animation: 'fadeIn',
  },
  hideContainer: {
    animationDuration: animDuration,
    opacity: 0,
    animation: 'fadeOut',
  },
  text: {
    fontFamily: 'Roboto',
    fontWeight: 300,
    strokeWidth: 0,
    fontSize: '1rem',
    color: '#333',
    textAnchor: 'end',
  },
  difference: {
    fontWeight: 700,
  },
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  '@keyframes fadeOut': {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },
};

class GapArrow extends PureComponent {
  render() {
    const { classes, isVisible, label, labelSide = 'right' } = this.props;
    let { x, y0, y1 } = this.props;

    const textX = x + (labelSide === 'right' ? 40 : -10);
    const textY = (y0 + y1) / 2 - 5;

    const orientation = y0 > y1 ? -1 : 1;
    y0 += orientation * pointRadius;
    y1 += orientation * (-1 * pointRadius - arrowHeadSize);

    return (
      <g className={isVisible ? classes.container : classes.hideContainer}>
        <path
          markerEnd="url(#arrowHead)"
          strokeWidth="1.75"
          fill="none"
          stroke="black"
          d={`M${x},${y0} V${y1}`}
        />
        <text x={textX} y={textY} className={classes.text}>
          <tspan>Gap</tspan>
          <tspan x={textX} y={textY + 21} className={classes.difference}>
            {label}
          </tspan>
        </text>
      </g>
    );
  }
}

export default injectSheet(styles)(GapArrow);
