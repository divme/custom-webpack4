const path = require('path');
const absolutePath = require('./absolute.path');
const webpack = require('webpack');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

// 优化包
const Happypack = require('happypack');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
// const TerserPlugin = require('terser-webpack-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// 本地服务
const devServer = {
    host: 'localhost',
    port: 8666,
    hot: true,
    stats: "errors-only", // 终端仅打印 error
    contentBase: path.resolve(__dirname, 'dist')
};

const config = {
    entry: "./src/index.js",
    output: {
        filename: 'js/[name].[contentHash:4].js',
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/'
    },
    devServer,
    optimization: {
        splitChunks: { //分割代码块
            cacheGroups: {
                vendor: {
                    //第三方依赖
                    priority: 1,
                    name: 'vendor',
                    test: /node_modules/,
                    chunks: 'initial',
                    minSize: 100,
                    minChunks: 2 //重复引入了几次
                },
                public: {
                    name: 'vendor',
                    chunks: 'initial',
                    minSize: 100,
                    minChunks: 2 //重复引入了几次
                }
            }
        },
        runtimeChunk: {
            name: 'mainifest'
        },
        // minimize: true,
        // minimizer: [
        //     new TerserPlugin({
        //         test: /\.js(\?.*)?$/i,
        //     }),
        // ],
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
                test: /\.js[x]?$/,
                use: 'Happypack/loader?id=js',
                include: [path.resolve(__dirname, 'src')]
            },
            {
                test: /\.css$/,
                use: 'Happypack/loader?id=css',
                include: [
                    path.resolve(__dirname, 'src'),
                    path.resolve(__dirname, 'node_modules', 'antd', 'dist'),
                    path.resolve(__dirname, 'node_modules', 'bootstrap', 'dist')
                ]
            },
            {
                test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2|.gexf)$/,
                use: 'Happypack/loader?id=file',
                include: [
                    path.resolve(__dirname, 'src'),
                    path.resolve(__dirname, 'public'),
                    path.resolve(__dirname, 'node_modules', 'bootstrap', 'dist')
                ]
            }
        ]
    },
    plugins: [
        // 必备项：模板页 清空打包目录 拷贝静态文件 全局注入模块 定义环境变量
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
        // new CopyWebpackPlugin([
        //     {
        //         from: 'template/js/*.js',
        //         to: path.resolve(__dirname, 'dist', 'js'),
        //         flatten: true,
        //     }
        // ], {
        //     ignore: ['other.js']
        // }),
        // new webpack.ProvidePlugin({
        //     // _map: ['lodash', 'map'],
        //     // Vue: ['vue/dist/vue.esm.js', 'default'],
        //     $: 'jquery'
        // }),
        // new webpack.DefinePlugin(),

        // 优化项：
        // 1. HappyPack || thread-loader
        new Happypack({
            id: 'js', //和rule中的id=js对应
            //将之前 rule 中的 loader 在此配置
            use: ['babel-loader'] //必须是数组
        }),
        new Happypack({
            id: 'css',//和rule中的id=css对应
            use: ['style-loader', 'css-loader', 'postcss-loader'],
        }),
        new Happypack({
            id: 'file', //和rule中的id=file对应
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 10240, //10K
                    esModule: false
                }
            }],
        }),
        // 2. Dll
        // new webpack.DllReferencePlugin({
        //     manifest: require(path.resolve(__dirname, 'dist', 'dll', 'manifest.json'))
        // }),
        // 3. 局部热更
        // new webpack.HotModuleReplacementPlugin(),
        // 4. 忽略模块中无用引用
        new webpack.IgnorePlugin(/\.\/locale/, /moment/),
        // 5. 缓存 loader 编译过程中的中间结果
        new HardSourceWebpackPlugin()
    ]
}

module.exports = config;
