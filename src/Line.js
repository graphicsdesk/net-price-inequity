import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
import { select as d3Select } from 'd3-selection';
import 'd3-transition';
import { animTime, lineAnimTime } from './constants';

import Point from './Point';

const styles = theme => ({
  line: {
    fill: 'none',
    strokeWidth: '2.5px',
    stroke: props => theme[props.theme],
  },
});

/*

TODO:
line colors
points
difference labelling

*/

class Line extends PureComponent {
  state = {
    pathDefinition: this.props.generator(this.props.data),
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
    const SCALE_TEST = 10;
    if (prevProps.yScale(SCALE_TEST) === this.props.yScale(SCALE_TEST)) {
      // Scale did not change, so we don't have to animate anything
      return;
    }

    const { isVisible, generator, data, axisDelay } = this.props;
    const { current: node } = this.pathRef;

    if (isVisible) {
      // Line should be visible, and since the scale changed, we need to animate it in.
      const pathLength = node.getTotalLength();
      // Save these values for when we animate line out
      this.setState({ pathLength, oldGenerator: generator });
      d3Select(node)
        .attr('stroke-dasharray', pathLength)
        .attr('stroke-dashoffset', pathLength)
        .transition()
        .delay(axisDelay === 0 ? animTime : 0) // Let the axis animate scale first
        .duration(lineAnimTime)
        .attr('stroke-dashoffset', 0);
    } else {
      // Line should be hidden, and since the scale changed, we need to animate it out.
      const { pathLength, oldGenerator } = this.state;
      d3Select(node)
        .attr('d', oldGenerator(data))
        .transition()
        .duration(lineAnimTime)
        .attr('stroke-dasharray', pathLength)
        .attr('stroke-dashoffset', pathLength);
    }
  }

  render() {
    const {
      classes,
      generator,
      data,
      xScale,
      yScale,
      axisDelay,
      theme,
    } = this.props;
    return (
      <g>
        <Point
          x={xScale(2008)}
          y={yScale(data[0])}
          delay={axisDelay}
          theme={theme}
        />
        <path ref={this.pathRef} d={generator(data)} className={classes.line} />
        <Point
          x={xScale(2016)}
          y={yScale(data[data.length - 1])}
          delay={axisDelay}
          theme={theme}
        />
      </g>
    );
  }
}

export default injectSheet(styles)(Line);
