import React from 'react';
import injectSheet from 'react-jss';
import BackedTexts from './BackedTexts';
import { incomeBrackets } from './constants';

const styles = {};

const PointLabel = ({ x, y, incomeBracket }) => {
  return (
    <BackedTexts
      x={x}
      y={y}
      texts={[
        'Avg. net price for',
        'students in the',
        incomeBrackets[incomeBracket],
        'income bracket.',
      ]}
    />
  );
};

export default injectSheet(styles)(PointLabel);
