const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const path = require('path');
const packagePath = path.resolve(__dirname + '/../lib');
const config = {
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

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
