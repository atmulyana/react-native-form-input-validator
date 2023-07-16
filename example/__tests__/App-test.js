/**
 * https://github.com/atmulyana/react-native-form-input-validator
 * @format
 */

import 'react-native';
import React from 'react';
import './_includes/rn-mock';
import './_includes/validator-mock';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  renderer.create(<App />);
});
