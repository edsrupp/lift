
import _ from 'lodash';
import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  ListView,
  TouchableHighlight,
  NativeAppEventEmitter,
  Platform,
  PermissionsAndroid
} from 'react-native';
import { connect } from 'react-redux';
import { Card, CardSection, Button, Confirm } from './common';
import { 
  handleDiscoverPeripheral,
  toggleScanning, 
  btleStart, 
  btleScan,
  btleStopScan } from '../actions';
import BtleDevicesList from './BtleDevicesList';

class BtleManager extends Component {
   
  state = { showModal: false };

    componentDidMount() {
      const btle = this.props.btleStart.bind(this, true);
      btle();

      NativeAppEventEmitter
          .addListener('BleManagerDiscoverPeripheral', this.props.handleDiscoverPeripheral.bind(this));

      if (Platform.OS === 'android' && Platform.Version >= 23) {
           PermissionsAndroid.checkPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
              if (result) {
                console.log('Permission is OK');
              } else {
                PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                  if (result) {
                    console.log('User accept');
                  } else {
                    console.log('User refuse');
                  }
                });
              }
          });
        }
    }

    onButtonPress() {
        if (!this.props.btleScanning) {
          console.log('Inside onButtonPress bool is true');
          this.props.toggleScanning(this.props.btleScanning);
          //So here after setting the scanning boolean we need to atually scan
          console.log('calling setInterval');
          this.setState({ intervalId: setInterval(() => this.props.btleScan(), 3000) });
        } else {
          console.log('Inside onButtonPress bool is false');
          this.props.toggleScanning(this.props.btleScanning);
          console.log('Calling clearInterval');
          clearInterval(this.state.intervalId);
          this.props.btleStopScan();
        }
    }
   
    onAccept() {
      console.log('In function onAccept!!!');
    }

   onDecline() {
       this.setState({ showModal: false });
   }

    render() {
        const { btleScanning } = this.props;

        return (
            <Card>
                <CardSection>
                  <Button onPress={this.onButtonPress.bind(this)}>
                    <Text>Scan Bluetooth ({ btleScanning ? 'on' : 'off' })</Text>
                  </Button>
                </CardSection>

                <CardSection>
                  <BtleDevicesList />
                </CardSection>
            </Card>
        );
    }

}

const styles = {
  textStyle: {
    alignSelf: 'center',
    textAlign: 'center',
    color: '#007aff',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  }
};

const mapStateToProps = (state) => {
  const { btleScanning, btleData } = state.btleReducer;
  return { btleScanning, btleData };
};

export default connect(mapStateToProps, 
   { handleDiscoverPeripheral,
     toggleScanning, 
     btleStart, 
     btleScan, 
     btleStopScan })(BtleManager);
