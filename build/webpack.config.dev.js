const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

const baseWebpackConfig = require('./webpack.config.base');

// 本地服务
const devServer = {
    host: 'localhost',
    port: 8666,
    open: true,
    hot: true,
    compress: false,
    stats: "errors-only", // 终端仅打印 error
    contentBase: path.resolve(__dirname, 'dist')
};

const config = merge(baseWebpackConfig, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    devServer
    //...其它的一些配置
});

const smp = new SpeedMeasurePlugin();
module.exports = smp.wrap(config);

// module.exports = config;
