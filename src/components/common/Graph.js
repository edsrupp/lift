
import React, { Component } from 'react';
import { 
    NativeAppEventEmitter, 
    ART, 
    TextInput, 
    View, 
    Text
 } from 'react-native';
import Axis from './Axis';
import { PeakTroughMarker } from './PeakTroughMarker';
import * as d3 from 'd3';
import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import * as time from 'd3-time';
import * as format from 'd3-time-format';
import * as d3Array from 'd3-array';
import * as axis from 'd3-axis';
import * as selection from 'd3-selection';
import { 
    createTimeScale, 
    getScales, 
    lineGenerator, 
    simplelineGenerator, 
    buildPeakTroughBars } from '../../computation/graphingUtilities';

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
  Shape
} = ART;

import { Card, CardSection } from './';

class Graph extends Component {
    render() {
        const { data, width, height, peaksTroughs } = this.props;
        const { scaleX, scaleY } = getScales(data, width, height);
        const lineGen = lineGenerator(scaleX, scaleY);
        var graphDPath = lineGen(data);
       
        console.log('New Main Graph D Path: ', graphDPath);
        console.log('Peaks and Troughs to feed to Marker component: ', peaksTroughs);
        var dpath = buildPeakTroughBars(peaksTroughs, scaleX, scaleY);
        console.log('Resulting dpath for peaks and Troughs: ', dpath);

        return (
            <CardSection>
                <View>
                    <Surface width={width} height={height}>
                        <Group> 
                            <Axis
                                data={data}
                                width={width}
                                height={height}
                                ticks={10}
                                vertical={false}
                                scale={scaleX}
                            />
                            <Axis
                                data={data}
                                width={width}
                                height={height}
                                ticks={10}
                                vertical={true}
                                scale={scaleY}
                            />
                            <Shape
                                d={graphDPath}
                                stroke={"#4169e1"}
                                strokeWidth={1}     
                            />
                            <PeakTroughMarker 
                                bars={dpath}
                            />
                        </Group>
                    </Surface>
                </View>
            </CardSection>
        );
    }
}

export { Graph };
