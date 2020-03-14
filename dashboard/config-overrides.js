const path = require('path');
const { override, fixBabelImports, addWebpackAlias } = require('customize-cra');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  webpack: function(config, env) {
    config = override(
      fixBabelImports('import', { libraryName: 'antd', libraryDirectory: 'es', style: 'css' }),
      addWebpackAlias({ '@src': path.resolve(__dirname, 'src') }),
    )(config);
    if (process.env.NODE_ENV === 'production') {
      // config.externals = {
      //   react: 'React',
      //   'react-dom': 'ReactDOM',
      //   'react-router-dom': 'ReactRouterDOM',
      // };
    }
    if (process.env.REACT_APP_NODE_ENV === 'analyzer') {
      config.plugins.push(new BundleAnalyzerPlugin());
    }
    return config;
  },
  jest: function(config) {
    config.moduleNameMapper = {
      ...config.moduleNameMapper,
      '@src/(.*)': path.resolve(__dirname, 'src/$1'),
    };
    return config;
  },
};
