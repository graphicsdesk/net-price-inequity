import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
import { select as d3Select } from 'd3-selection';
import 'd3-transition';
import {
  animTime,
  lineAnimTime,
  shortLineAnimTime,
  animDuration,
} from './constants';

import Point from './Point';
import ShortLineLabel from './ShortLineLabel';
import LineLabel from './LineLabel';
import PercentGrowth from './PercentGrowth';
import PercentLabel from './PercentLabel';

const styles = theme => ({
  line: {
    fill: 'none',
    strokeWidth: '2.5px',
    stroke: props => theme[props.theme],
  },
  visibleLine: {
    animation: 'fadeIn',
    animationDuration: animDuration,
  },
  hideLine: {
    animation: 'fadeOut',
    animationDuration: animDuration,
    opacity: 0,
  },
});

class Line extends PureComponent {
  state = {
    oldGenerator: this.props.generator,
    pathDefinition: this.props.generator(this.props.data),
    pathLength: null,

    isEndVisible: false,
    isStartVisible: true,
    isTransitioning: false,
  };

  pathRef = React.createRef();

  componentDidMount() {
    const { current: node } = this.pathRef;
    const length = node.getTotalLength();
    d3Select(node)
      .attr('stroke-dasharray', length)
      .attr('stroke-dashoffset', length);
  }

  componentDidUpdate(prevProps, prevState) {
    const SCALE_TEST = 10;
    if (
      prevProps.isVisible &&
      this.props.isVisible &&
      prevProps.yScale(SCALE_TEST) !== this.props.yScale(SCALE_TEST)
    ) {
      // Scale changed while line stayed visible, so we animate line in and back out for transition
      this.setState({ isTransitioning: true });
      setTimeout(() => {
        const { current: node } = this.pathRef;
        const pathLength = node.getTotalLength();
        this.setState({
          isTransitioning: false,
          oldGenerator: this.props.generator,
          pathLength,
        });
      }, animTime);
      return;
    }

    const { isVisible, generator, data, incomeBracket } = this.props;
    const { current: node } = this.pathRef;

    if (isVisible && !prevProps.isVisible) {
      // Line should be visible, and since the scale changed, we need to animate it in.
      const pathLength = node.getTotalLength();
      // Save these values for when we animate line out
      this.setState({
        pathLength,
        oldGenerator: generator,
        isStartVisible: true,
        pulseStart: true,
      });
      d3Select(node)
        .attr('stroke-dasharray', pathLength)
        .attr('stroke-dashoffset', pathLength)
        .transition()
        .duration(lineAnimTime)
        .attr('stroke-dashoffset', 0)
        .on('end', () =>
          this.setState({ isEndVisible: true, pulseStart: false }),
        );
    } else if (!isVisible && prevProps.isVisible) {
      // Line should be hidden, and since the scale changed, we need to animate it out.

      const { pathLength, oldGenerator } = this.state;
      d3Select(node)
        .attr('d', oldGenerator(data))
        .transition()
        .duration(shortLineAnimTime)
        .attr('stroke-dasharray', pathLength)
        .attr('stroke-dashoffset', pathLength)
        .on('end', () => {
          if (incomeBracket <= 1) {
            this.setState({ isStartVisible: false });
          }
        });
      this.setState({ isEndVisible: false, pulseStart: false });
    }
  }

  render() {
    const {
      oldGenerator,
      isEndVisible,
      isTransitioning,
      isStartVisible,
      pulseStart,
    } = this.state;
    const {
      classes,
      generator,
      data,
      xScale,
      yScale,
      theme,
      incomeBracket,

      isPercentGrowthVisible = false,
      shortLabel,
      isVisible,
      isFinalGapVisible,
      isPercentLabelVisible,
    } = this.props;
    if (incomeBracket === 1) {
      console.log('===== RERENDER =====');
      console.log('path length', this.state.pathLength);
      isVisible
        ? isTransitioning
          ? console.log(
              'transitioning and visible, so use old',
              oldGenerator(data).substr(0, 20),
            )
          : console.log(
              'visible but not transitioning, so use new',
              generator(data).substr(0, 20),
            )
        : console.log(
            'not visible, so use new',
            generator(data).substring(0, 20),
          );
    }
    const startPointX = xScale(2008);
    const startPointY = yScale(data[0]);
    const endPointX = xScale(2016);
    const endPointY = yScale(data[data.length - 1]);
    const labelX = (3 * startPointX + xScale(2009)) / 4;
    const labelY = yScale(data[0]);

    return (
      <g>
        <Point
          x={startPointX}
          y={startPointY}
          theme={theme}
          isVisible={isStartVisible}
          pulse={pulseStart}
        />
        <g
          className={
            isVisible ? isTransitioning ? (
              classes.hideLine
            ) : (
              classes.visibleLine
            ) : (
              classes.visibleLine
            )
          }
        >
          <path
            ref={this.pathRef}
            d={
              isVisible ? isTransitioning ? (
                oldGenerator(data)
              ) : (
                generator(data)
              ) : (
                oldGenerator(data)
              )
            }
            className={classes.line}
          />
        </g>
        <Point
          x={endPointX}
          y={endPointY}
          theme={theme}
          isVisible={isEndVisible}
          pulse={isFinalGapVisible}
        />

        {/* TODO: incomeBracket and theme are equivalent and should be one variable */}
        {shortLabel ? (
          <ShortLineLabel
            x={labelX}
            y={labelY}
            incomeBracket={incomeBracket}
            theme={theme}
            isVisible={isEndVisible}
          />
        ) : (
          <LineLabel
            x={labelX}
            y={labelY}
            incomeBracket={incomeBracket}
            theme={theme}
            isVisible={isEndVisible}
          />
        )}

        <PercentGrowth
          baseX={startPointX}
          baseY={startPointY}
          x={endPointX}
          y={endPointY}
          isVisible={isVisible && isPercentGrowthVisible}
        />

        {/* <PercentLabel x={endPointX} y={endPointY - 30} percent={(endPointY - startPointY) / endPointY} isVisible={isPercentLabelVisible} /> */}
      </g>
    );
  }
}

export default injectSheet(styles)(Line);
