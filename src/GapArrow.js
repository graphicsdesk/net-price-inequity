import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
import { lineAnimTime, animTime, pointRadius } from './constants';

const styles = {
  container: {
    animationDuration: '1s',
    animation: 'fadeIn',
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
};

class GapArrow extends PureComponent {
  state = {
    isActuallyVisible: true,
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.isVisible && !this.props.isVisible) {
      // just hidden
      this.setState({ isActuallyVisible: false });
    } else if (!prevProps.isVisible && this.props.isVisible) {
      // just shown
      setTimeout(
        () => this.setState({ isActuallyVisible: true }),
        lineAnimTime + animTime,
      );
    }
  }

  render() {
    if (!this.state.isActuallyVisible) {
      // return null;
    }

    const { classes, label, x, y0, y1 } = this.props;
    const textX = x - 10;
    const textY = (y0 + y1) / 2 - 5;
    return (
      <g className={classes.container}>
        <path
          markerEnd="url(#arrowHead)"
          strokeWidth="1.75"
          fill="none"
          stroke="black"
          d={`M${x},${y0 + pointRadius} V${y1 - pointRadius * 2 - 5.75}`}
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
