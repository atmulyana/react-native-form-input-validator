/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// import messages from 'react-native-form-input-validator/messages';
// messages.required = '${name} must be filled';

AppRegistry.registerComponent(appName, () => App);
