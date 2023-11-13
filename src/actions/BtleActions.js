import _ from 'lodash';
import firebase from 'firebase';
import { ListView } from 'react-native';
import { Actions } from 'react-native-router-flux';
import BleManager from 'react-native-ble-manager';
import { stUuids } from '../constants/SensorTagVals';
import Accumulator from '../computation/graphingCalculations';
import { findPeaksTroughs } from '../computation/graphingUtilities';
const base64 = require('base64-js');

import {
  BTLE_START,
  BTLE_DATA_RECEIVED,
  BTLE_TOGGLE_SCAN,
  BTLE_SCANNING,
  BTLE_STOP_SCAN,
  BTLE_HANDLE_DISCOVER_PERIPHERAL,
  BTLE_DISCOVERD_PERIPHERALS,
  BTLE_CURRENT_DEVICE,
  BTLE_CONNECTED_DEVICE,
  BTLE_NOTIFICATION_STARTED,
  BTLE_NOTIFICATION_STOPPED,
  BTLE_CHARACTERISTIC_HAS_UPDATED,
  BTLE_ACCUMULATING_LIFT_DATA,
  BTLE_LIFT_STATUS,
  BTLE_SENSOR_ENABLED,
  BTLE_NO_OP
} from './types';

//interval is based on sampling rate of the SensorTag
let interval = 5; //in milliseconds
let duration = 60; //in seconds
let accumulator = new Accumulator(interval, duration);
let thisState = {
    timeoutId: 0,
    liftComplete: true,
    //We start off assuming we are in a state of accumulating data - see LiftGraph
    accumulatingData: true
};

export const btleStart = (bool) => {
    console.log('Inside btleStart', bool);
    //const starter = BleManager.start.bind(this, { showAlert: bool });
    console.log('Not Using starter...');
    return (dispatch) => {
      BleManager.start({ showAlert: true })
      .then(() => {
        console.log('BleManager is initialized!!');          
        dispatch({ type: BTLE_START });
      });
    };
};

export const btleScan = () => {
    console.log('Inside btleScan');
    return (dispatch) => {
        BleManager.scan([], 30, true)
        .then(() => {
            //Success
            console.log('Scanning was successful!!');
        });    
    };
};

export const btleStopScan = () => {
    console.log('Inside btleStopScan');
    return (dispatch) => {
        BleManager.stopScan()
        .then(() => {
            // Success
            console.log('Scan stopped');
            dispatch({ type: BTLE_STOP_SCAN });
        });   
    };
};

export const handleDiscoverPeripheral = (value) => {
    console.log('Got ble data!!!!!!!: ', value);
    return (dispatch) => {
        BleManager.getDiscoveredPeripherals([])
        .then((peripheralsArray) => {
            // Success code
            console.log('Discovered peripherals: ', peripheralsArray);
            dispatch({
                type: BTLE_DISCOVERD_PERIPHERALS,
                payload: peripheralsArray
            });
        }); 
    };
};

//Maybe the promise should be wrapping this function which is what gets called
export const handleBleManagerDidUpdateValueForCharacteristic = (vals) => {
    console.log('BLE Manager did update value for characteristic: ', vals);
    thisState.timeoutId = 0;
    thisState.liftComplete = false;
    var timeoutId = 0;

    accumulator.accumulate(vals);

    //Still accumulating lift data just update that flag
    return {
        type: BTLE_ACCUMULATING_LIFT_DATA,
        payload: true
    };
};

export const startLiftTimeout = () => {
    //Wait a minute this shit should be done when we click the "prepare for lift" button
    console.log('In function startLiftTimeout');
    return((dispatch) => {
        //Keep accumulating data before sending it off to be graphed
        var id = setTimeout(() => {
            console.log('###################Return Lift Completion Status####################');
            thisState.liftComplete = true;
            //Looks like the lift is complete prepare lift data for graphs
            var data = accumulator.prepGraphData();
            var gyroData = accumulator.prepGyroData();
            var peaksTroughs = accumulator.findPeaksAndTroughs();
            dispatch({
                type: BTLE_CHARACTERISTIC_HAS_UPDATED,
                payload: {data, gyroData, peaksTroughs}
            });
            dispatch({
                type: BTLE_ACCUMULATING_LIFT_DATA,
                payload: false
            });
        }, 10000);
        //thisState.timeoutId = id;
        dispatch({
            type: BTLE_NO_OP,
            payload: true
        });
    });
};

//This doesn't initiate an action but this make it more clear
//as to when, why and how a clear happens
export const clearAccumulator = () => {
    accumulator.clear();
    return{
        type: BTLE_NO_OP,
        payload: true
    };
};

export const toggleScanning = (bool) => {
    console.log('Inside toggleScanning: ', bool);
    const toggled = !bool;
    return {
        type: BTLE_TOGGLE_SCAN,
        payload: toggled
    };
};

export const setLiftState = (bool) => {
    console.log('Inside toggleLiftState: ', bool);
    return {
        type: BTLE_ACCUMULATING_LIFT_DATA,
        payload: bool
    };

};

export const getDiscoveredPeripherals = () => {
    console.log('Inside function getDiscoveredPeripherals');
    return (dispatch) => {
        BleManager.getDiscoveredPeripherals([])
        .then((peripheralsArray) => {
            // Success code
            console.log('Discovered peripherals: ', peripheralsArray.length);
            dispatch({
                type: BTLE_DISCOVERD_PERIPHERALS,
                payload: peripheralsArray
            });
        });
    };
};

export const connectCurrentDevice = (mac) => {
  console.log('Inside setCurrentDevice', mac);
  return (dispatch) => {
    dispatch({
        type: BTLE_CURRENT_DEVICE,
        payload: mac
    });
    BleManager.connect(mac)
    .then((peripheralInfo) => {
        // Success code
        console.log('Connected to BTLE device: ', mac);
        console.log(peripheralInfo);
        dispatch({
            type: BTLE_CONNECTED_DEVICE,
            payload: peripheralInfo
        });
    })
    .catch((error) => {
        // Failure code
        console.log('Here is your error: ', error);
    });
  };
};

//peripheralId, serviceUUID, characteristicUUID
export const btleStartNotification = ({ characteristics, btleCurrentDevice }) => {
  console.log('Inside btleStartNotification');
  console.log('characteristics in btleStartNotification: ', characteristics);
  console.log('Peripheral ID: ', btleCurrentDevice);
  //'24:71:89:E7:45:86'
  //const characteristicUUID = 'f000aa81-0451-4000-b000-000000000000';
  const characteristicUUID = 'f000aa81-0451-4000-b000-000000000000';
  const serviceUUID = 'f000aa80-0451-4000-b000-000000000000';
  return (dispatch) => {
  /*  dispatch({
        type: BTLE_NOTIFICATION_STARTED,
        payload: true
    });*/
    BleManager.startNotification(btleCurrentDevice, serviceUUID, characteristicUUID)
    .then(() => {
        // Success code
        console.log('Notification started!!!!');
        dispatch({
            type: BTLE_NOTIFICATION_STARTED,
            payload: true
        });
    })
    .catch((error) => {
        // Failure code
        console.log('Error inside btleStartNotification: ', error);
    });
  };
};

//peripheralId, serviceUUID, characteristicUUID
export const btleStopNotification = ({ characteristics, btleCurrentDevice }) => {
  console.log('Inside btleStopNotification');
  console.log('characteristics in btleStopNotification: ', characteristics);
  console.log('Peripheral ID: ', btleCurrentDevice);

  //'24:71:89:E7:45:86'
  //const characteristicUUID = 'f000aa81-0451-4000-b000-000000000000';
  const characteristicUUID = 'f000aa81-0451-4000-b000-000000000000';
  const serviceUUID = 'f000aa80-0451-4000-b000-000000000000';
  return (dispatch) => {
    BleManager.stopNotification(btleCurrentDevice, serviceUUID, characteristicUUID)
    .then(() => {
        // Success code
        console.log('Notification stopped!!!!');
        dispatch({
            type: BTLE_NOTIFICATION_STOPPED,
            payload: true
        });
    })
    .catch((error) => {
        // Failure code
        console.log('Error inside btleStopNotification: ', error);
    });
  };
};

export const btleTurnSensorOn = ({ characteristics, btleCurrentDevice }) => {
  //console.log('Inside btleTurnSensorOn: ', characteristics);
  //I think this serviceUUID is for the entire motion sensor

  //const onSwitch = 0x0001;   <--   <--      Gyro Acc Mag WakeOnMotion  range  not used
  const arr = new Uint8Array([0xFF, 0xC0]); //111  111 1   0             11     000000
  const data = base64.fromByteArray(arr);
  //console.log('The Base64 encoded byte array: ', data);
  const characteristicUUID = 'f000aa81-0451-4000-b000-000000000000';
  const serviceUUID = 'f000aa80-0451-4000-b000-000000000000';
  //A write of the value 0x0001 should turn the sensor on - but not sure at this time
  return (dispatch) => {
    const rInput = new Uint8Array([0x16]);

    const resolution =  base64.fromByteArray(rInput);
    BleManager.write(btleCurrentDevice, stUuids.UUID_MOV_SERV, stUuids.UUID_MOV_CONF, data, 1000)
    .then(() => {
       // Success code
        //console.log('MOV sensors should be enabled: ', data);
        //Configure the MOV sensors resolution
        BleManager.write(btleCurrentDevice, stUuids.UUID_MOV_SERV, stUuids.UUID_MOV_PERI, resolution, 1000)
        .then(() => {
            console.log('Successfully set resolution: ', resolution);
            //If the write is successful then we can start notifications...            
            BleManager.startNotification(btleCurrentDevice, serviceUUID, characteristicUUID)
            .then(() => {
                // Success code
                console.log('Notifications for MOV system started!!!!');
                dispatch({
                    type: BTLE_NOTIFICATION_STARTED,
                    payload: true
                });
                dispatch({
                   type: BTLE_SENSOR_ENABLED,
                   payload: true 
                });
            })
            .catch((error) => {
                // Failure code
                console.log('Failed to set MOV notifications: ', error);
            });
        })
        .catch((error) => {
            console.log('Failed to set resolution: ', error);
        });
 
        })
    .catch((error) => {
        // Failure code
        console.log('Failed to enable MOV sensors: ', error);
    });
  };
};
