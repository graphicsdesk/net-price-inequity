import React from 'react';
import BackedText from './BackedText';

const BackedTexts = ({ x, y, texts }) => (
  <text x={x} y={y}>
    {texts.map((text, index) => (
      <BackedText key={text} x={x} y={y + index * 21}>
        {text}
      </BackedText>
    ))}
  </text>
);

export default BackedTexts;
