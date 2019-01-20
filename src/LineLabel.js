import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
import theme from './theme';
import { incomeBrackets, animDuration } from './constants';

const styles = theme => ({
  visible: {
    animation: 'fadeIn', // TODO: CENTRALIZE THESE ANIMATIONS
    animationDuration: animDuration,
  },
  hidden: {
    animation: 'fadeOut',
    animationDuration: animDuration,
    opacity: 0,
  },
  text: {
    fill: props => theme[props.theme],
    textAnchor: 'middle',
    fontSize: '1rem',
    stroke: 0,
    fontWeight: 300,
  },
  income: {
    fontWeight: 500,
    fill: '#fff',
    stroke: 0,
  },
});

class LineLabel extends PureComponent {
  state = {
    rectBBox: {},
  };

  incomeRef = React.createRef();

  recomputeRect = () => {
    const node = this.incomeRef.current;
    if (!node) return;
    const rectBBox = node.getBBox();
    rectBBox.width = node.getComputedTextLength();
    this.setState({ rectBBox });
  };

  componentDidMount() {
    this.recomputeRect();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.y !== prevProps.y) {
      this.recomputeRect();
    }
  }

  render() {
    const { rectBBox } = this.state;
    const { x: rectX, y: rectY, width, height } = rectBBox;
    const {
      classes,
      x,
      y,
      incomeBracket,
      theme: lineTheme,
      isVisible,
    } = this.props;

    const padding = 2;
    return (
      <g className={isVisible ? classes.visible : classes.hidden}>
        {rectX && (
          <rect
            x={rectX - padding}
            y={rectY - padding}
            width={width + padding * 2}
            height={height + padding * 2}
            fill={theme[lineTheme]}
          />
        )}
        <text x={x} y={y} className={classes.text}>
          Avg. net price for
        </text>
        <text x={x} y={y + 24} className={classes.text}>
          <tspan className={classes.income} ref={this.incomeRef}>
            {incomeBrackets[incomeBracket]}
          </tspan>
          <tspan dx={padding * 2.5}>families</tspan>
        </text>
      </g>
    );
  }
}
export default injectSheet(styles)(LineLabel);
