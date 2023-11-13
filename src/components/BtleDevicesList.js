import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ListView } from 'react-native';
import ListBtleDevice from './ListBtleDevice';
import { 
  handleDiscoverPeripheral
   } from '../actions';

class BtleDevicesList extends Component {
  
  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps: ', nextProps);
    //nextProps are the next set of props the component will be renedered with
  }

  createDataSource(dMap) {
    console.log('btlelist createDataSource: ', dMap);
    const ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
    });
    return (ds.cloneWithRows(dMap));
  }

  renderRow(device) {
    return <ListBtleDevice device={device} />;
  }

  render() {
      console.log(this.props);
    return (
      <ListView
        enableEmptySections
        dataSource={this.createDataSource(this.props.dMap)}
        renderRow={this.renderRow}
      />
    );
  }
}

/*
D/BluetoothLeScanner:
 onScanResult() - 
 ScanResult{
   mDevice=24:71:89:E7:45:86, 
   mScanRecord=ScanRecord [mAdvertiseFlags=5, mServiceUuids=[0000aa80-0000-1000-8000-00805f9b34fb], 
   mManufacturerSpecificData={13=[3, 0, 0]}, 
   mServiceData={}, 
   mTxPowerLevel=0, 
   mDeviceName=CC2650 SensorTag], 
   mRssi=-60, 
   mTimestampNanos=1408046422730}
*/

const mapStateToProps = (state) => {
  const { btleScan, btleDiscoveredPeripherals } = state.btleReducer;
  console.log('btleScan value: ', btleScan);
  console.log('btleDiscoveredPeripherals: ', btleDiscoveredPeripherals);

  const devices = btleDiscoveredPeripherals !== '' 
           ? btleDiscoveredPeripherals 
           : [{ name: 'no devices detected', id: 'FE:ED:FA:CE', rssi: 66 }];
  console.log('DEVICES!!!!!!!!!!!!!!:', devices);

  const dMap = _.map(devices, ({ name, id }) => {
       return [name, id];
  });

  return { dMap }; 
};

export default connect(mapStateToProps, 
    { handleDiscoverPeripheral })(BtleDevicesList);
