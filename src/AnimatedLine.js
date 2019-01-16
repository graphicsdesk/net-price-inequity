import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
import { select as d3Select } from 'd3-selection';
import 'd3-transition';

const styles = {
  line: {
    fill: 'none',
    stroke: '#0F3E3F',
    strokeWidth: '2px',
  },
};

const ANIM_TIME = 2600;

class Line extends PureComponent {
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
    const length = node.getTotalLength();

    if (!prevProps.areLinesVisible && this.props.areLinesVisible) {
      d3Select(node)
        .attr('stroke-dasharray', length)
        .attr('stroke-dashoffset', length)
        .transition()
        .duration(ANIM_TIME)
        .attr('stroke-dashoffset', 0);
    } else if (prevProps.areLinesVisible && !this.props.areLinesVisible) {
      d3Select(node)
        .transition()
        .duration(ANIM_TIME)
        .attr('stroke-dasharray', length)
        .attr('stroke-dashoffset', length);
    }
  }

  render() {
    const { classes, d } = this.props;

    return <path ref={this.pathRef} d={d} className={classes.line} />;
  }
}

export default injectSheet(styles)(Line);
