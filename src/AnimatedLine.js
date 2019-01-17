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
line colors
points
difference labelling

*/

class Line extends PureComponent {
  state = {
    pathLength: null,
    oldPathDefinition: null,
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
    if (prevProps.pathDefinition === this.props.pathDefinition) {
      // Data did not change, therefore scale did not change, so we don't have to
      // animate naything.
      return;
    }

    const { isVisible, pathDefinition, shouldWait } = this.props;
    const { current: node } = this.pathRef;

    if (isVisible) {
      // Line should be visible, and since the scale changed, we need to animate it in.
      const pathLength = node.getTotalLength();
      // Save these values for when we animate line out
      this.setState({ pathLength, oldPathDefinition: pathDefinition });

      d3Select(node)
        .attr('stroke-dasharray', pathLength)
        .attr('stroke-dashoffset', pathLength)
        .transition()
        .delay(shouldWait ? animTime : 0) // Let the axis animate scale first
        .duration(lineAnimTime)
        .attr('stroke-dashoffset', 0);
    } else {
      // Line should be hidden, and since the scale changed, we need to animate it out.
      const { pathLength, oldPathDefinition } = this.state;
      d3Select(node)
        .attr('d', oldPathDefinition)
        .transition()
        .duration(lineAnimTime)
        .attr('stroke-dasharray', pathLength)
        .attr('stroke-dashoffset', pathLength);
    }
  }

  render() {
    const { classes, pathDefinition } = this.props;

    return (
      <path ref={this.pathRef} d={pathDefinition} className={classes.line} />
    );
  }
}

export default injectSheet(styles)(Line);
