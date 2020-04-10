const path = require('path');
const webpack = require('webpack');
const absolutePath = require('./absolute.path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const VueLoaderPlugin = require('vue-loader/lib/plugin');


// 优化
// 多核： 启用 thread-loader

// 未启用优化: 多核 和 硬盘缓存，在项目没达到一定量级时不建议开启
// const Happypack = require('happypack');
// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const config = {
    entry: path.resolve(__dirname, "../src/index.js"),
    // entry: "./sscsrc/entry/main.js",
    output: {
        filename: 'js/[name].[hash:6].js',
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/'
    },
    // 分隔代码块，先dll，然后合并node_modules公共模块，然后src下公共部分
    optimization: {
        splitChunks: { //分割代码块
            chunks: 'all',
            cacheGroups: {
                vendor: { //第三方依赖
                    priority: 1,
                    name: 'vendor',
                    test: /node_modules/,
                    chunks: 'initial',
                    minSize: 100,
                    minChunks: 1 //重复引入了几次
                },
                app: {
                    name: 'app',
                    chunks: 'initial',
                    reuseExistingChunk: true,
                    minSize: 100,
                    minChunks: 2 //重复引入了几次
                }
            }
        },
        runtimeChunk: {
            name: 'mainifest'
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
                exclude: /node_modules/,
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
            minify: { // 模板页压缩选项
                collapseWhitespace: true, // 移除空格
                removeComments: true, // 移除注释
                removeAttributeQuotes: true // 移除双引号
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
        // 定义环境变量
        // new webpack.DefinePlugin(),
        // vue 单页应用其他js css规则
        new VueLoaderPlugin(),


        //--------- 优化项：-----------------
        // 1. Dll + optimization.splitChunks
        new webpack.DllReferencePlugin({
            manifest: require(path.resolve(__dirname, '../dist/dll', 'manifest.json'))
        }),
        // 4. 忽略模块中无用引用
        // new webpack.IgnorePlugin(/\.\/locale/, /moment/),
        // 5. 缓存 loader 编译过程中的中间结果
        // new HardSourceWebpackPlugin()
    ]
}

module.exports = config;
