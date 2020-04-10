const path = require("path");
const webpack = require("webpack");
const merge = require('webpack-merge');
// 性能分析
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// 压缩
const TerserWebpackPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');

const baseWebpackConfig = require('./webpack.config.base');

const extraPlugins = [];
// 是否启用性能分析
if (process.env.env_feature === 'analysis') extraPlugins.push(new BundleAnalyzerPlugin());

const config = merge(baseWebpackConfig, {
    mode: 'production',
    devtool: 'source-map',
    performance: {
        hints: "warning", // "error" 或者 false 都是有效值
        maxEntrypointSize: 600000,
        maxAssetSize: 300000,
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserWebpackPlugin({
            parallel: true,
            test: /\.js(\?.*)?$/i
        })]
    },
    module: {
        rules: [
            {
                test: /\.(sc|c|sa)ss$/,
                use:[
                    MiniCssExtractPlugin.loader,
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
            },
        ]
    },
    plugins: [
        // 1. Dll + optimization.splitChunks
        new webpack.DllReferencePlugin({
            manifest: require(path.resolve(__dirname, '../dist/dll', 'manifest.json'))
        }),
        // css 抽离 与 压缩
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:6].css'
        }),
        new OptimizeCssPlugin(),
        ...extraPlugins
    ]
    //...其它的一些配置
});

const smp = new SpeedMeasurePlugin();
module.exports = process.env.env_feature === 'analysis' ? smp.wrap(config) : config;

