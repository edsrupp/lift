import React, { Component } from 'react';
import { NativeAppEventEmitter, TextInput, View, Text, ScrollView, Picker } from 'react-native';
import { connect } from 'react-redux';
import { 
  btleStartNotification,
  btleStopNotification,
  btleTurnSensorOn,
  btleTurnSensorOff,
  handleBleManagerDidUpdateValueForCharacteristic,
  setLiftState,
  clearAccumulator,
  startLiftTimeout
} from '../actions';

import{ findPeaksTroughs } from '../computation/graphingUtilities';

import { PieChart }from 'd3-pie';

import { Card, CardSection, Button, Graph } from './common';

// Test Data!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Our array of data we're graphing.
const testData = [
  {x: 5, y: 2},
  {x: 10, y: 6},
  {x: 15, y: 20},
  {x: 20, y: 50},
  {x: 25, y: 1},
  {x: 30, y: 45},
  {x: 35, y: 45},
  {x: 40, y: 60},
  {x: 45, y: 25},
  {x: 50, y: 10},
  {x: 55, y: 60}
];

class LiftGraph extends Component {

  componentWillMount() {
    if(this.props.accumulatingData && this.props.btleCharacteristicUpdate === '') {
      console.log('where is peaksTroughs!!: ', findPeaksTroughs(testData));      
      this.setState({
        rawData: testData,
        gyroData: testData,
        peaksTroughs: findPeaksTroughs(testData)
      });
    } else {
      this.setState({
        rawData: this.props.btleCharacteristicUpdate, 
        gyroData: this.props.btleGyroData,
        peaksTroughs: this.props.btleDataPeaksTroughs
      });
    }
  }

  componentDidMount() {
    console.log('LiftGraph Component did mount addListener for notifications');
    NativeAppEventEmitter
        .addListener('BleManagerDidUpdateValueForCharacteristic', 
        this.props.handleBleManagerDidUpdateValueForCharacteristic);
  }
  
  componentDidUpdate() {
    //Here we want to stop activley collecting
    console.log('LiftGraph componentDidUpdate');
    //Every time we come through here we need to check to see if the lift is complete
    //If it is we need to stop listening to the sensor and just render the results.

    const { characteristics, btleCurrentDevice, accumulatingData, btleCharacteristicUpdate } = this.props;
    if(!accumulatingData) {
      console.log('In liftGraph componentDidUpdate Lift is Complete!!!!!', accumulatingData);
       this.props.btleStopNotification({ characteristics, btleCurrentDevice });
    }
  }

  componentWillReceiveProps() {
    //TODO: this totally sucks need to do a more exhaustive check to determine when 
    //to update state
    /*
    if(this.props.btleCharacteristicUpdate.length === 0 ){
      return;
    }
    console.log('WTF is this: ', this.props.btleCharacteristicUpdate);
    if(this.props.btleCharacteristicUpdate[4].y === nextProps.btleCharacteristicUpdate[4].y) {
      return;
    }
*/
    if(this.props.accumulatingData && this.props.btleCharacteristicUpdate === '') {
      console.log('componentDidUpdate btleCharacteristicUpdate data is empty!!!!!!!!');
      console.log('where is peaksTroughs!!!: ', findPeaksTroughs(testData));
      this.setState({
        rawData: testData,
        gyroData: testData,
        peaksTroughs: findPeaksTroughs(testData)
      });
    } else {
      console.log('componentDidUpdate btleCharacteristicUpdate data is defined!!!!!!!!');
      console.log('What is gyro data: ', this.props.btleGyroData);    
      this.setState({
        rawData: this.props.btleCharacteristicUpdate,
        gyroData: this.props.btleGyroData,
        peaksTroughs: this.props.btleDataPeaksTroughs
      });
    }
  }


  onButtonPress() {
    //When we  first hit the Prepare for lift button we need to indicate that we are now lifting
    //liftComplete = true is an indicator that we have completed a lift cycyle so false means that we are still lifting
   // this.props.setLiftState(true);

    //Must clear accumulator state here
    this.props.clearAccumulator();

    console.log('Lift Graph Button Pressed!!');
    const { characteristics, btleCurrentDevice } = this.props;
    console.log('Calling btleStartNotification...');

    //TODO: as soon as the lift is complete we need to reset everything and go into a waiting state
    if(!this.props.btleSensorEnabled) {
      console.log('Calling btleTurnSensorOn....');      
      this.props.btleTurnSensorOn({ characteristics, btleCurrentDevice });
    }
      this.props.btleStartNotification({ characteristics, btleCurrentDevice });      

    //TODO: here is where we should start the timeout to eventually end the lift!!!!!!!!!!!!!!!!!!!
    this.props.startLiftTimeout();
  }

  onSelectLift(lift) {
    console.log('Lift Selected:', lift);
  }

  //This is the layout of the data returned from the SensoTag
  //G = Gyro
  //A = Accelerometer
  //M = Magnetometer
  //GX GX GY GY GZ GZ AX AX AY AY AZ AZ MX MX MY MY MZ MZ
  //71 FD 00 00 47 02 C3 EF 90 00 4D FE 86 01 41 02 CE 00
  //Graph Vals: { this.props.btleCharacteristicUpdate.value }
  /*
          <CardSection>
            <Text style={styles.pickerTextStyle}>Select a Lift</Text>
            <Picker
                selectedValue={"Clean and Jerk"}
                onValueChange={value => this.onSelectLift({ prop: 'lift', value })}
            >
                <Picker.Item label="Clean and Jerk" value="Clean and Jerk" />
                <Picker.Item label="Snatch" value="Snatch" />
            </Picker>
        </CardSection>
  */
  render() {
      console.log('New Graph Data coming in!!!!!!!: ', this.props.btleCharacteristicUpdate);
      return (
        <Card>
          <ScrollView>
            <Graph data={this.state.rawData} peaksTroughs={this.state.peaksTroughs} width={325} height={450} />
            <Graph data={this.state.gyroData} peaksTroughs={this.state.peaksTroughs} width={325} height={450} />
          </ScrollView>
          <CardSection>
            <Button onPress={this.onButtonPress.bind(this)}>
              Prepare for lift
            </Button>
          </CardSection>
        </Card>
      );
  }
}

const styles = {
  pickerTextStyle: {
   fontSize: 15,
   paddingLeft: 20
  }
};

const mapStateToProps = (state) => {
  const { 
    btleConnectedDevice, 
    btleCurrentDevice, 
    btleCharacteristicUpdate,
    btleGyroData,
    btleDataPeaksTroughs,
    liftComplete,
    accumulatingData,
    clearAccumulator,
    btleSensorEnabled
  } = state.btleReducer;

  //console.log('The state in LiftGraph: ', btleConnectedDevice);
  const characteristics = btleConnectedDevice !== '' ? btleConnectedDevice : 'No Characteristics';
  //console.log('Characteristics: ', characteristics);

  return { 
    characteristics, 
    btleCurrentDevice, 
    btleCharacteristicUpdate,
    btleGyroData,
    btleDataPeaksTroughs,
    liftComplete,
    accumulatingData,
    clearAccumulator,
    btleSensorEnabled
 };
};

export default connect(mapStateToProps, { 
  btleStartNotification,
  btleStopNotification,
  btleTurnSensorOn, 
  handleBleManagerDidUpdateValueForCharacteristic,
  clearAccumulator,
  startLiftTimeout,
  setLiftState
 })(LiftGraph);
