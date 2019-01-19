import React, { Fragment } from 'react';
import injectSheet from 'react-jss';

const styles = {  
  background: {
    stroke: '#fff',
    strokeWidth: 4,
    opacity: 0.8,
    strokeLinejoin: 'round',
    strokeLinecap: 'round',
  },
  bold: {
    fontWeight: 700,
  },
};

const BackedText = ({ classes, x, y, children, bold }) => (
  <Fragment>
    <tspan x={x} y={y} className={classes.background}>{children}</tspan>
    <tspan x={x} y={y} className={bold ? classes.bold : undefined}>{children}</tspan>
  </Fragment>
);

export default injectSheet(styles)(BackedText);