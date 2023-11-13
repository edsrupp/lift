import React from 'react';
import { Scene, Router, Actions } from 'react-native-router-flux';
import LoginForm from './components/LoginForm';
import EmployeeList from './components/EmployeeList';
import EmployeeCreate from './components/EmployeeCreate';
import EmployeeEdit from './components/EmployeeEdit';
import BtleManager from './components/BtleManager';
import LiftGraph from './components/LiftGraph';

const RouterComponent = () => {
  return (
      <Router sceneStyle={{ paddingTop: 65 }}>
        <Scene key="auth">
          <Scene key="login" component={LoginForm} title="Please Login" />
        </Scene>

        <Scene key="main">
          <Scene 
          onRight={() => Actions.employeeCreate()}
          rightTitle="Add" 
          onLeft={() => Actions.btleManager()}
          leftTitle="Bluetooth"
          key="employeeList" 
          component={LiftGraph} 
          title="Lift Performance"
          initial
          />
          <Scene key="employeeCreate" component={EmployeeCreate} title="Create Employee" />
          <Scene key="employeeEdit" component={EmployeeEdit} title="Edit Employee" />
          <Scene key="btleManager" component={BtleManager} title="BTLE Controls" />
        </Scene>      
      </Router>
  );
};

export default RouterComponent;
