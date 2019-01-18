import React from 'react';
import injectSheet from 'react-jss';

const styles = {
  text: {
    fontFamily: 'Roboto',
    fontWeight: 300,
    strokeWidth: 0,
    fontSize: '1rem',
    color: '#333',
    textAnchor: 'middle',
  },
  difference: {
    fontWeight: 700,    
  },
};

const VerticalArrow = ({ classes, x, y0, y1 }) => {
  const textX = x + 25;
  const textY = (y0 + y1) / 2 - 5
  return (
    <g>
      <path
        markerEnd='url(#arrowHead)'
        strokeWidth='1.75' fill='none' stroke='black'  
        d={`M${x},${y0} V${y1}`}
      />
      <text x={textX} y={textY} className={classes.text}>
        <tspan>Gap</tspan>
        <tspan x={textX} dy='1.4rem' className={classes.difference}>+$12</tspan>
      </text>
    </g>
  );
};

export default injectSheet(styles)(VerticalArrow);