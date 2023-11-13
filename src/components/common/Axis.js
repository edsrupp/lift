import React, { Component, PropTypes } from 'react';
import { 
  NativeAppEventEmitter, 
  ART, 
  TextInput, 
  View
} from 'react-native';
//import Svg, { G, Line } from 'react-native-svg';
import * as d3 from 'd3';
import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import * as time from 'd3-time';
import * as format from 'd3-time-format';
import * as d3Array from 'd3-array';
import * as axis from 'd3-axis';
import * as selection from 'd3-selection';
import { getTickPoints, simplelineGenerator } from '../../computation/graphingUtilities';

const bigD = {
  time,
  format,
  scale,
  shape,
  axis,
  selection
};

const {
  Group,
  Rectangle,
  Surface,
  Shape,
  Text
} = ART;

const xyOffset = 20;
const heightOffset = 30;

export default class Axis extends Component {

  componentWillMount() {
   var TICKSIZE = 10;
   this.setState({TICKSIZE});
  }

  render () {
    let { data, width, height, ticks, vertical, scale } = this.props;

    let axisArgs = [];
    if(vertical) {
      //this.getTickPoints(vertical, xyOffset, height, ticks);
      axisArgs = [xyOffset, 0, xyOffset, height-heightOffset, this.props.scale.ticks];
      console.log('Y Tick Array: ', this.props.scale.ticks(10));     
    } else {
      //this.getTickPoints(vertical, xyOffset, width, ticks);
//      axisArgs = [xyOffset, height-heightOffset, width + xyOffset, height-heightOffset, this.props.scale.ticks];
      axisArgs = [xyOffset, height-heightOffset, width + xyOffset, height-heightOffset, this.props.scale.ticks];
      console.log('X Tick Array: ', this.props.scale.ticks(10));     
    }

    let tickPoints = vertical ? getTickPoints(vertical, xyOffset, width, height, ticks, scale, this.state.TICKSIZE)
      : getTickPoints(vertical, heightOffset, width, height, ticks, scale, this.state.TICKSIZE);

    //NOTE: when rendering ART <Text> we have to do some foolishness like specifiy font AND to get variables to render
    //we have to use string template literals 
    var simpleD = simplelineGenerator(...axisArgs);
    console.log('SimpleLineDpath for Axis: ', simpleD);
    return (
      <Group>
            <Shape key={Math.random()} d={simplelineGenerator(...axisArgs)} stroke={'#000'} strokeWidth={2} />
            {tickPoints.map((dp) => {
              var txt = dp.tickText;
              console.log('Trying to render d ticks: ', txt);
              console.log('D Path in Axis: ', dp.path);
              console.log('dp.x: ', dp.x);
              console.log('dp.y: ', dp.y);
              
              return(
                <Group key={Math.random()}>
                  <Shape
                    key={Math.random()}
                    d={dp.path}
                    stroke={'#000'}
                    strokeWidth={1}
                  />
                  <Text key={Math.random()} 
                    font={`13px "Helvetica Neue", "Helvetica", Arial`} 
                    fill="#000000"
                    x={dp.x}
                    y={dp.y}>
                    {`${dp.tickText}`}
                  </Text>
                </Group>
              );
            })
            }
      </Group>
    );
  };
}

/*
                <Group key={Math.random()}>
                  <Shape
                    key={Math.random()}
                    d={dp}
                    stroke={'#000'}
                    strokeWidth={1}
                  />
                  <Text key={Math.random()}>
                    Help Me
                  </Text>
                </Group> 


        {tickPoints.map(
           (pos) => {
                   <Text
                    key={pos}
                    fill='#000'
                    stroke='#000'
                    fontSize='10'
                    textAnchor='middle'
                    x={vertical ? x - 2 * TICKSIZE : pos}
                    y={vertical ? pos : y + 2 * TICKSIZE}>
                    {typeof startVal === 'number' ? Math.round(scale(pos), 2) : scale(pos).toLocaleDateString()}
                  </Text>}
         )}

                 {tickPoints.map(
           (pos) => { <Shape
                        d={this.createTickDPath(vertical ? x : pos,
                                                vertical ? pos : y,
                                                vertical ? x - TICKSIZE : pos,
                                                vertical ? pos : y + TICKSIZE)}
                        stroke={'#007aff'}
                        strokeWidth={3}
                      />
                    }
         )}

*/