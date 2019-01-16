import React from 'react';
import injectSheet from 'react-jss';

const styles = {
  point: {
    fill: 'red',
  },
};

const Point = ({ classes, x, y }) => (
  <circle className={classes.point} cx={x} cy={y} r={5} />
);

export default injectSheet(styles)(Point);
