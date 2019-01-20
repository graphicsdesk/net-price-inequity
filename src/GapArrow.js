import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
import {
  animDuration,
  animTime,
  pointRadius,
  arrowHeadSize,
} from './constants';
import BackedText from './BackedText';

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
    textAnchor: ({ labelSide = 'right' }) =>
      labelSide === 'right' ? 'start' : 'end',
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

// TODO: D3EASE AND RAF

class GapArrow extends PureComponent {
  state = {
    isTransitioning: false,
    oldY0: null,
    oldY1: null,
  };

  componentDidUpdate(prevProps, prevState) {
    if (!this.props.isVisible) {
      return;
    }

    const { y0: oldY0, y1: oldY1 } = prevProps;
    const { y0, y1 } = this.props;
    if (y0 !== oldY0 || y1 !== oldY1) {
      this.setState({ isTransitioning: true, oldY0, oldY1 });
      setTimeout(() => this.setState({ isTransitioning: false }), animTime);
    }
  }

  render() {
    const { isTransitioning, oldY0, oldY1 } = this.state;
    const {
      classes,
      isVisible,
      difference,
      label,
      labelSide = 'right',
    } = this.props;
    let { x, y0, y1 } = this.props;

    if (isTransitioning) {
      y0 = oldY0;
      y1 = oldY1;
    }

    const labelOnRight = labelSide === 'right';
    let textX = x + (labelOnRight ? 10 : -10);
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
      <g
        className={
          isVisible ? isTransitioning ? (
            classes.hideContainer
          ) : (
            classes.container
          ) : (
            classes.hideContainer
          )
        }
      >
        <path
          markerEnd={arrowIsVisible ? 'url(#arrowHead)' : undefined}
          strokeWidth="1.5"
          fill="none"
          stroke="black"
          d={`M${x},${y0} V${arrowIsVisible ? y1 : y0}`}
        />

        <text x={textX} y={textY} className={classes.text}>
          <BackedText x={textX} y={textY} bold>
            {difference}
          </BackedText>
          <BackedText x={textX} y={textY + 22}>
            {label}
          </BackedText>
        </text>
      </g>
    );
  }
}

export default injectSheet(styles)(GapArrow);
