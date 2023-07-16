module.exports = {
  preset: 'react-native',
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
    "!**/__tests__/_includes/**"
  ],
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|@react-native|react-native-feather|@react-native-picker|@react-native-community/datetimepicker|react-native-simple-radio-button|jssimpledateformat)/)"
  ],
};
