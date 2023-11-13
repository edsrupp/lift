import React, { Component } from 'react';
import { 
    NativeAppEventEmitter, 
    ART, 
    TextInput, 
    View, 
    Text
 } from 'react-native';
import { simplelineGenerator } from '../../computation/graphingUtilities';

const {
  Group,
  Rectangle,
  Surface,
  Shape
} = ART;

class PeakTroughMarker extends Component {
    componentWillMount() {
        var { bars } = this.props;
        this.setState({bars});
    }
    componentWillReceiveProps() {
        var { bars } = this.props;
        this.setState({bars});
    }
    render() {
        let b = this.state.bars;
        console.log('What is BBBBB: ', b);
        return(
            <Group key={Math.random()}>
                { b.map((dp) => {
                    return(
                        <Shape
                            key={Math.random()}
                            d={dp}
                            stroke={"#ff4040"}  // green line
                            strokeWidth={1}     
                        />
                    );
                })
                }
            </Group>
        );
    }
}

export { PeakTroughMarker };
