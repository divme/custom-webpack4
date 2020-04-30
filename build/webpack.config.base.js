const path = require('path');
const webpack = require('webpack');
const absolutePath = require('./absolute.path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const VueLoaderPlugin = require('vue-loader/lib/plugin');

const config = {
    entry: path.resolve(__dirname, "../src/index.js"),
    // entry: "./sscsrc/entry/main.js",
    output: {
        filename: 'js/[name].[hash:6].js',
        chunkFilename: "js/[name].[contenthash:6].js",
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/'
    },
    cache: true,
    stats: {
        all: false,
        assets: true,
        cached: false,
        cachedAssets: false,
        chunks: false,
        chunkGroups: false,
        builtAt: true
    },
    // 分隔代码块，先dll，然后合并node_modules公共模块，然后src下公共部分
    optimization: {
        splitChunks: { //分割代码块
            chunks: 'all',
            // automaticNameDelimiter: '-',
            cacheGroups: {
                vendor1: { //第三方依赖
                    priority: 10,
                    name: 'element',
                    // name(module, chunks, key) {
                    //   return 'element';
                    // },
                    test: /element-ui/,
                    // maxSize: 420000,
                    minSize: 100,
                    minChunks: 1 //重复引入了几次
                },
                vendor2: { //第三方依赖
                    priority: 5,
                    name: 'vue',
                    // name(module, chunks, key) {
                    //   return 'vue';
                    // },
                    test: /vue|vuex|vue-router/,
                    maxSize: 420000,
                    minSize: 100,
                    minChunks: 1 //重复引入了几次
                },
                vendor: { //第三方依赖
                    priority: 1,
                    name: 'omo',
                    // name(module, chunks, key) {
                    //   return 'omo';
                    // },
                    test: /node_modules/,
                    // maxSize: 420000,
                    minSize: 100,
                    minChunks: 1 //重复引入了几次
                },
                app: {
                    name: 'app',
                    test: /src/,
                    reuseExistingChunk: true,
                    maxSize: 400000,
                    minSize: 100000,
                    minChunks: 1 //重复引入了几次
                }
            }
        },
        runtimeChunk: {
            name: 'omoruntime'
        }
    },
    // 模块的引用规则
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        modules: ['./src/components', 'node_modules'],
        alias: Object.assign({
            'vue': 'vue/dist/vue.esm.js',
            '@': path.join(__dirname, '../src'),
            'jquery': 'jquery'
        }, absolutePath)
    },
    // 外部引用
    externals: {
        // 'jquery': 'jQuery'
    },
    module: {
        noParse: /jquery|lodash/,
        rules: [
            {
                test: /\.vue$/,
                include: [path.resolve(__dirname, '../src')],
                use: [
                    {
                        loader: 'vue-loader'
                    }
                ]
            },
            // 常规项的解析：Js[x] [s]css img font
            {
                test: /\.js[x]?$/,
                // exclude: /node_modules/,
                include: [path.resolve(__dirname, '../src')],
                use: [{
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true
                    }
                }]

            },
            {
                test: /\.(png|jpg|gif|jpeg|webp|svg|.gexf)$/,
                use: [
                  {
                    loader: 'url-loader',
                    options: {
                        name: './img/[name][contenthash:8].[ext]',
                        limit: 10240, //10K
                        esModule: false
                    }
                  }
                ]
            },
            {
                test: /\.(eot|ttf|woff|woff2|.gexf)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: './src/[name][contenthash:8].[ext]',
                            limit: 10240, //10K
                            esModule: false
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        // ------------ 必备项：---------------
        // 模板页 清空打包目录 拷贝静态文件 全局注入模块 定义环境变量
        new HtmlWebpackPlugin({
            template: './template/index.html',
            filename: 'index.html',
            cache: true,
            inject: false,
            minify: { // 模板页压缩选项
                collapseWhitespace: false, // 移除空格
                removeComments: false, // 移除注释
                removeAttributeQuotes: false // 移除双引号
            }
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['**/*', '!dll', '!dll/**']
        }),
        // 拷贝静态文件
        // new CopyWebpackPlugin([
        //     {
        //         from: 'template/js/*.js',
        //         to: path.resolve(__dirname, 'dist', 'js'),
        //         flatten: true,
        //     }
        // ], {
        //     ignore: ['other.js']
        // }),
        // 注入全局变量模块
        // new webpack.ProvidePlugin({
        //     // _map: ['lodash', 'map'],
        //     // Vue: ['vue/dist/vue.esm.js', 'default'],
        //     $: 'jquery'
        // }),

        // vue 单页应用其他js css规则
        new VueLoaderPlugin(),

        //--------- 公共优化项：-----------------
        // 4. 忽略模块中无用引用
        // new webpack.IgnorePlugin(/\.\/locale/, /moment/)
    ]
}

module.exports = config;
