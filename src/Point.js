import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
import { select as d3Select } from 'd3-selection';

const styles = {
  point: {
    fill: 'red',
  },
};

class Point extends PureComponent {
  state = {
    y: this.props.y,
  };

  componentDidUpdate(prevProps, prevState) {
  }

  render() {
    const { classes, x, y } = this.props;

    return <circle className={classes.point} cx={x} ref={node => d3Select(node).transition().duration(1000).attr('cy', y)} r={5} />;
  }
}

export default injectSheet(styles)(Point);
