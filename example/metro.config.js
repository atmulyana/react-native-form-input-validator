/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const path = require('path');
const packagePath = path.resolve(__dirname + '/../lib');

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    extraNodeModules: new Proxy({}, {
      get: (_, moduleName) =>
        moduleName == 'react-native-form-input-validator' 
          ? packagePath
          : path.join(__dirname, `node_modules/${moduleName}`)
    }),
  },
  watchFolders: [packagePath],
};
