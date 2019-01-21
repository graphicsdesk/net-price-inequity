import React, { Component } from 'react';
import injectSheet from 'react-jss';

import GapArrow from './GapArrow';
import { animDuration, animTime } from './constants';

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

class PercentGrowth extends Component {
  state = {
    isTransitioning: true,
    oldBaseY: this.props.baseY,
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.baseY !== this.props.baseY) {
      this.setState({ isTransitioning: true, oldBaseY: prevProps.baseY });
      setTimeout(() => this.setState({ isTransitioning: false }), animTime);
    }
  }

  render() {
    const { isTransitioning, oldBaseY } = this.state;
    const { classes, isVisible, baseX, x, y } = this.props;

    let { baseY } = this.props;
    if (isTransitioning) {
      baseY = oldBaseY;
    }

    return (
      <g className={isVisible ? classes.visible : classes.hidden}>
        <g className={isTransitioning ? classes.hidden : classes.visible}>
          <line
            className={classes.line}
            x1={baseX}
            x2={x}
            y1={baseY}
            y2={baseY}
          />
        </g>
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
  }
}

export default injectSheet(styles)(PercentGrowth);
