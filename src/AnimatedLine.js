import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
import { select as d3Select } from 'd3-selection';
import 'd3-transition';
import { animTime, lineAnimTime } from './constants';

const styles = {
  line: {
    fill: 'none',
    stroke: '#0F3E3F',
    strokeWidth: '2px',
  },
};

/*

TODO:
label axes
line colors
points
difference labelling

*/

class Line extends PureComponent {
  state = {
    d: this.props.data,
    pathLength: null,
  };

  pathRef = React.createRef();

  componentDidMount() {
    const { current: node } = this.pathRef;
    const length = node.getTotalLength();
    d3Select(node)
      .attr('stroke-dasharray', length)
      .attr('stroke-dashoffset', length);
  }

  componentDidUpdate(prevProps, prevState) {
    const { current: node } = this.pathRef;

    if (prevProps.data === this.props.data) {
      // Data did not change, so scale did not change, so we don't have to
      // animate naything.
      return;
    }

    if (this.props.areLinesVisible && this.props.shouldWait) {
      // Lines should be visible, and since the scale changed, we need to animate them in.
      // We should wait for axes to animate, so we will delay the transition.

      const pathLength = node.getTotalLength();
      this.setState({ pathLength, d: this.props.data });
      d3Select(node)
        .attr('stroke-dasharray', pathLength)
        .attr('stroke-dashoffset', pathLength)
        .transition()
        .delay(animTime) // let the axis and points scale first
        .duration(lineAnimTime)
        .attr('stroke-dashoffset', 0);
    } else if (!this.props.areLinesVisible && !this.props.shouldWait) {
      // Lines should not visible, and since the scale changed, we need to animate them out.

      const { pathLength } = this.state;
      d3Select(node)
        .transition()
        .duration(lineAnimTime)
        .attr('stroke-dasharray', pathLength)
        .attr('stroke-dashoffset', pathLength);
    }
  }

  render() {
    const { d } = this.state;
    const { classes } = this.props;

    return <path ref={this.pathRef} d={d} className={classes.line} />;
  }
}

export default injectSheet(styles)(Line);
