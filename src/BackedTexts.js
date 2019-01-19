import React from 'react';
import BackedText from './BackedText';

const BackedTexts = ({ x, y, texts }) => (
  <text>
    {texts.map((text, index) => (
      <BackedText x={x} y={y + index * 21}>{text}</BackedText>
    ))}
  </text>
);

export default BackedTexts;