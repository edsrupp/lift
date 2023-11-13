import _ from 'lodash';
import { accRanges } from '../constants/SensorTagVals';


//Create a class that handles accumulations of gyro and accelerometer data
//Class will also produce the d element for ReactNativeArt Line rendering
//For this class:
//   The x axis is determined based on the granularity of sensor data
//   x, y and z data will be collected as notifications initiate said collection

//This is the layout of the data returned from the SensoTag
//G = Gyro
//A = Accelerometer
//M = Magnetometer
//GX GX GY GY GZ GZ AX AX AY AY AZ AZ MX MX MY MY MZ MZ
//71 FD 00 00 47 02 C3 EF 90 00 4D FE 86 01 41 02 CE 00
//Graph Vals: { this.props.btleCharacteristicUpdate.value }

class Accumulator {
    constructor(interval, duration) {
        //The sampling interval of the senor providing this data
        this.interval = interval;

        //Gryo Data
        this.gyroXData = [];
        this.gyroYData = [];
        this.gyroZData = [];

        //Accelerometer Data
        this.accXData = [];
        this.accYData = [];
        this.accZData = [];

        //Magnetometer Data
        this.magXData = [];
        this.magYData = [];
        this.magZData = [];
        this.masterArr = [this.gyroXData, this.gyroYData, this.gyroZData, 
                          this.accXData, this.accYData, this.accZData,
                          this.magXData, this.magYData, this.magZData];
        this.now = Date();
        this.then = Date();
        this.liftComplete = false;
        this.liftDuration = duration;
    }
    
    //Parses a hex string into an array of uint16 values
    accumulate(vals) {
      console.log('Accumulating!!!!', vals.value);
      var now = Date();
      if((now - this.then) >= this.liftDuration) { this.liftComplete = true; }
      for (var i = 0, j = 0; i < vals.value.length; i+=4, j++) {
        console.log('SensorTag Parsed Data as int: ', parseInt(vals.value.substring(i, i+3), 16));
        this.masterArr[j].push(parseInt(vals.value.substring(i, i+3), 16));
      }
      this.then = Date();
    }

    //TODO after accumulating data you need to prepare is for the Graphing d3 stuff
    //Create another function here that does that
    prepGraphData() {
      console.log('Inside prepGraphData!!!!');
      var data=[];
      var time = this.interval;
      for(i = 0; i < this.accYData.length; i++) {
          //TODO you need to make ACC_RANGE configurable somehow..
          data.push({x: time, y: this.convertMpu9250AccData(this.accYData[i], accRanges.ACC_RANGE_16G)});
          time += this.interval;
      }
      console.log('Graph Data has been prepped: ', data);
      return data;
    }
    /*
    TODO - look at how to plot gyro/accelerometer data for positional tracking
    TODO - figure out what a given weight's mass is and how to use that with G's to calculate power
    TODO - need to figure out how to track rotational changes in the sensor and use that to calculate the true
          value for power in the Y axis
   */
    prepGyroData() {
      var data=[];
      var time = this.interval;
      for (i = 0; i < this.gyroXData.length; i++) {
        data.push({x: time, y: this.convertMpu9250GyroData(this.gyroYData[i])});
        time += this.interval;
      }
      console.log('Gyro data has been prepped: ', data);
      return data;
    }

    findPeaksAndTroughs() {
      var start = 2;                        // Starting index to search
      var end = this.accYData.length - 2;           // Last index to search
      var obj = { peaks: [], troughs: [] };// Object to store the indexs of peaks/thoughs
      
      for(var i = start; i<=end; i++)
      {
        var current = this.accYData[i];
        var last = this.accYData[i-1];
        var lastlast = this.accYData[i-2];
        var next = this.accYData[i+1];
        var nextnext = this.accYData[i+2];
        
        if(current > next && current > last && 
           current > nextnext && current > lastlast) 
          obj.peaks.push(i*this.interval);
        else if(current < next && current < last &&
                current <  nextnext && current < lastlast) 
          obj.troughs.push(i*this.interval);
      }
      return obj;
    }

    runAccumulator(vals) {
      return () => {
             Promise((fulfill, reject) => {
              accumulate(vals, (error, data) => {
                if (error) {
                  reject(error);
                } else {
                  fulfill(data);
                }
              });
            });
          };
      }
 
      convertMpu9250GyroData(data)
      {
        //-- calculate rotation, unit deg/s, range -250, +250
        return (data * 1.0) / (65536 / 500);
      }

      convertMpu9250AccData(rawData, range)
      {
        var val;
      
        switch (range)
        {
        case accRanges.ACC_RANGE_2G:
          //-- calculate acceleration, unit G, range -2, +2
          val = (rawData * 1.0) / (32768/2);
          break;
      
        case accRanges.ACC_RANGE_4G:
          //-- calculate acceleration, unit G, range -4, +4
          val = (rawData * 1.0) / (32768/4);
          break;
      
        case accRanges.ACC_RANGE_8G:
          //-- calculate acceleration, unit G, range -8, +8
          val = (rawData * 1.0) / (32768/8);
          break;
      
        case accRanges.ACC_RANGE_16G:
          //-- calculate acceleration, unit G, range -16, +16
          val = (rawData * 1.0) / (32768/16);
          break;
        }
      
        return val;
      }

      clear() {
        console.log('Clearing Accumulator');
        for(var i = 0; i < this.masterArr.length; i++ ) {
          this.masterArr[i].length = 0;
        }
        //Gryo Data
        this.gyroXData.length = 0;
        this.gyroYData.length = 0;
        this.gyroZData.length = 0;

        //Accelerometer Data
        this.accXData.length = 0;
        this.accYData.length = 0;
        this.accZData.length = 0;

        //Magnetometer Data
        this.magXData.length = 0;
        this.magYData.length = 0;
        this.magZData.length = 0;
      }
}

export default Accumulator;
