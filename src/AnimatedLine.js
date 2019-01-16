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

class Line extends PureComponent {
  state = {
    animated: false,
  };

  pathRef = React.createRef();

  componentDidMount() {
    const { current: node } = this.pathRef;
    const length = node.getTotalLength();

    d3Select(this.pathRef.current)
      .attr('stroke-dasharray', length)
      .attr('stroke-dashoffset', length)
      .transition()
      .duration(1000)
      .attr('stroke-dashoffset', 0);
  }

  render() {
    const { animated } = this.state;
    const { classes, d } = this.props;

    if (!animated) {
      return <path ref={this.pathRef} d={d} className={classes.line} />;
    }
  }
}

export default injectSheet(styles)(Line);
