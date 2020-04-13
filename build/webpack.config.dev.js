const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

// 性能分析
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// 开发模式性能优化
// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const baseWebpackConfig = require('./webpack.config.base');

const extraPlugins = [];
// 是否启用性能分析
if (process.env.env_feature === 'analysis') extraPlugins.push(new BundleAnalyzerPlugin());
if (process.env.env_feature !== 'server') {
  extraPlugins.push(new webpack.DllReferencePlugin({
    manifest: require(path.resolve(__dirname, '../dist/dll', 'manifest.json'))
  }));
}
// 本地服务
const devServer = {
    host: 'localhost',
    port: 8666,
    open: true,
    hot: true,
    compress: false,
    stats: "errors-only", // 终端仅打印 error
    contentBase: path.resolve(__dirname, '../dist')
};

const config = merge(baseWebpackConfig, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    devServer,
    // stats: 'errors-only',
    // stats: {
    //     assets: true,
    //     chunks: false
    // },
    module: {
      rules: [
        {
          test: /\.(sc|c|sa)ss$/,
          // include: [
          //   path.resolve(__dirname, '../src'),
          //   path.resolve(__dirname, '../node_modules/element-ui')
          // ],
          use:[
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: function () {
                  return [
                    require('autoprefixer')()
                  ]
                },
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        }
      ]
    },
    plugins: [
      // new HardSourceWebpackPlugin(),
      // new webpack.DefinePlugin(),
      ...extraPlugins
    ]
    //...其它的一些配置
});


const smp = new SpeedMeasurePlugin();
module.exports = process.env.env_feature === 'server' ? config : smp.wrap(config);
