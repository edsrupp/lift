import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, TouchableOpacity, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { CardSection } from './common';
import { 
  connectCurrentDevice
   } from '../actions';

class ListBtleDevices extends Component {

  componentWillMount() {
    console.log('ListBtleDevices: ', this.props.device);
  }

  onRowPress() {
      console.log('Inside ListBtleDevices onPress: ', this.props.device[1]);
      this.props.connectCurrentDevice(this.props.device[1]);
  }

  render() {
      const name = this.props.device[0];
      return (
        <TouchableOpacity onPress={this.onRowPress.bind(this)}>
         <View>
          <CardSection>
            <Text style={styles.titleStyle}>
              Btle device name: {name}
            </Text>
          </CardSection>
         </View>
        </TouchableOpacity>
      );
  }
}

const styles = {
    titleStyle: {
        fontSize: 18,
        paddingLeft: 15
    }
};

export default connect(null, { connectCurrentDevice })(ListBtleDevices);
