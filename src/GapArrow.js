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
    fontSize: '1.15rem',
    color: '#333',
    textAnchor: 'end',
  },
  textBg: {
    stroke: '#fff',
    strokeWidth: 3,
    opacity: 0.8,
    strokeLinejoin: 'round',
    strokeLinecap: 'round',
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

    const labelOnRight = labelSide === 'right';
    let textX = x + (labelOnRight ? 50 : -10);
    const textY = (y0 + y1) / 2 - 5;

    const arrowIsVisible = Math.abs(y0 - y1) >= arrowHeadSize;
    // If minimum possible arrow size is not small enough, only render label,
    // not arrow
    if (!arrowIsVisible) {
      // If arrow is not rendered, the label will be right next to lines' points.
      // Add a little spacing.
      textX += (labelOnRight ? 1 : -1) * pointRadius;
    }

    const orientation = y0 > y1 ? -1 : 1;
    y0 += orientation * pointRadius;
    y1 += orientation * (-1 * pointRadius - arrowHeadSize);

    return (
      <g className={isVisible ? classes.container : classes.hideContainer}>
        {arrowIsVisible && <path
          markerEnd="url(#arrowHead)"
          strokeWidth="1.75"
          fill="none"
          stroke="black"
          d={`M${x},${y0} V${y1}`}
        />}
        <text x={textX} y={textY} className={classes.text}>
          <tspan x={textX} className={classes.textBg}>Gap</tspan>
          <tspan x={textX}>Gap</tspan>
          <tspan x={textX} y={textY + 21} className={classes.textBg}>{label}</tspan>
          <tspan x={textX} y={textY + 21} className={classes.difference}>
            {label}
          </tspan>
        </text>
      </g>
    );
  }
}

export default injectSheet(styles)(GapArrow);
