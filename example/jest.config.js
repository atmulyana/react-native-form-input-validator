module.exports = {
  preset: 'react-native',
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
    "!**/__tests__/_includes/**"
  ],
  transformIgnorePatterns: [
    "node_modules/(?!(jssimpledateformat|@react-native|react-native|react-native-feather|@react-native-community/datetimepicker|@react-native-picker|react-native-simple-radio-button|rn-select-option|rn-style-props)/)"
  ],
};
