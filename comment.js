// -------------------------------------常见性能问题------------------------------
// 1. js css 压缩耗时比较多，如何启用thread-loader与mini-css-XXX
// 2. 优化手段，有的针对二次启动（如 webpack-dev-server？），有的针对冷启动(生产打包)
// 3. 一个是重启的时长，一个是热更新的时长
// 4. font 图片打包出来比较大，怎么办

// -----------------------------------打包文件设定--------------------------------
// 1. 测试 预上线 生产 各环境的区别主要限定在需要的 API baseUrl等的不同
// 2.  dev： mode：development
//           devtool: ''
//         vs prod 其他异同：为方便调试，不启用压缩，且配置一个本地服务 devServer
//         用途用法: 本地服务，以及测试环境测试问题使用（本地无法复现时）
// 3.  prod: mode: production
//           devtool: ''
//         vs dev 其他异同: 启用压缩等条件
//         用途用法：测试环境=>仿真环境=>生产环境，均用 prod 配置打包；
//           根据环境不同，设置 env 不同参数进行区分, 此参数仅用来区分不同环境设置 API baseURL
//           如：测试 env_url=dev; 仿真 env_url=preprod;  生产 env_url=prod


// -----------------------------------常用配置说明 -----------------------------
// mode： development || production
// devtool：source-map 的种类
// entry
// output
// devServer: 本地服务，可配置解决跨域，三种常用方式
//
// optimization： { splitChunks： {}}
// module: {
//   noParse: /jquery/  不解析 jquery 的依赖库，节省时间
//   rules: [
//     vue: 支持 scss | jsx | css 引入
//     js： 语法 pollyfill vue-jsx等
//     css: 测试: 支持scss css import|
//     img：css 内引用， html内引用
//     font file  html
//   ]
// }
// plugin: [
//   基本
//   HtmlWebpackPlugin | CleanWebpackPlugin | CopyWebpackPlugin
//   webpack.ProvidePlugin | webpack.DefinePlugin |  webpack.BannerPlugin | webpack.IgnorePlugin
//   Vue: VueLoaderPlugin (vue-template-complier)
//   Js： TerserWebpackPlugin
//   Css: MiniCssExtractPlugin | OptimizeCssPlugin
//
//   性能检测: speed-measure-webpack-plugin || webpack-bundle-analyzer
//   缓存： 自带缓存 || cache-loader || hard-source-webpack-plugin(一般也不用)
//   抽离： dll => optimization.split 功能提取node_module => 提取开发目录公共内容
//   拆分:  vue 多利用 router 的异步组件 +  代码中事件触发 webpack import 的异步引入
//   多核:  thread-loader(一般用也是用这个) || happypack 启用多核打包
//   图片，字体文件的处理 ？ Y ：N
// ]
// externals：{jquery: '$'} 表示外部引用的模块，一般是CDN引入，webpack 在处理打包时会跳过此模块
// resolve： {
//   alias: {'vue': 'vue/dist/vue.esm.min.js'} 别名
//   extensions: ['.js', '.vue'] 扩展名数组,从左到右顺序查找
//   modules: ['./src/components', 'node_modules'] 查找第三方模块的顺序，左 => 右，这样可以 'button' 引入components下组件
// }


 // -----------------------------------常用 Loader 配置说明-----------------------------------------------------
// 1. vue文件处理
//    1.1 loader
//        vue-loader: 会解析 .vue 文件，提取每个语言块，如有必要会通过其它 loader 处理，最后将他们组装成一个 ES Module，它默认导出一个 Vue.js 组件选项的对象。
//        vue-template-compiler: 会接解析 template 标签中的内容，预处理为 JS 渲染函数，并最终注入到从 <script> 导出的组件中。
//    1.2 new vueLoaderPlugin()
// 2. css： 解析/提取/提取目录/压缩：类名混淆
//    2.1 loader
//          vue-loader || mini-css-extract-plugin.loader 代替 style-loader
//          style-loader: 用于将 css 以内联方式注入到 index.html 的 head 内
//        style-loader: 用于将 css 以内联方式注入到 index.html 的 head 内
//        css-loader: 处理 css 文件，使其能在 js 文件内引用；可开启sourceMap： true
//        postcss-loader autoprefixer: css 预处理，为css属性添加前缀；浏览器兼容性处理
//        sass-loader node-sass： 用于处理 sass 文件
//    2.2 plugin
//        单独提取出css  mini-css-extract-plugin
//        压缩 css 文件  optimize-css-assets-webpack-plugin
// 3. js： 解析/提取/提取目录/压缩
//       3.1 loader： babel
//           3.1.1. @babel/core 是 Babel 的核心功能包，必须安装。
//           3.1.2. babel-loader 是 Webpack 用来转译 JS 代码的加载器。
//           3.1.3. @babel/preset-env 能根据当前的运行环境，自动确定需要的 plugins 和 polyfills。主要负责将代码转成 ES5 语法规则。
//           3.1.4. babel-polyfill。Babel 编译时只编译语法，并不会编译 API 和实例方法，如：async/await、Promise 等，babel-polyfill 会把这些没有的 API 全部挂载到全局对象，也就是所谓的“垫片”。
//       3.2 plugin
//          压缩插件：
//          webpack.optimize.UglifyJsPlugin : 自带，单线程，严重影响热更速度
//          webpack-parallel-uglify-plugin： 结合上述webpack自带压缩，启用多线程，打包 热更都慢
//          uglifyjs-webpack-plugin： 多线程压缩，打包 热更慢
// 4. 图片、字体、html等文件处理
//    loader
//       file-loader： 处理文件导入的问题, 字体处理，图片
//       url-loader：  类似file-loader， 但是可以将 url 地址对应的文件，打包成 base64 的 DataURL，提高访问效率
//       image-webpack-loader: 图片压缩loader


// ----------------------------------- 常用 Plugin 解析 --------------------------------
// 0. css 抽离压缩：mini-css-extract-plugin + optimize-css-assets-webpack-plugin
// 0. js 压缩：TerserWebpackPlugin
// 1. 常用
//     构建前删除原文件插件：cleanWebpackPlugin
//     将指定文件夹内容直接拷贝到打包目录：copyWebpackPlugin
//     自动生成html，并动态引入打包后的css、js等文件插件： htmlWebpackPlugin
//
//     定义环境变量： webpack.definePlugin()
//     全局注入已经npm安装过的模块： webpack.providePlugin()
//     忽略某个包内对某个模块的引用: webpack.IgnorePlugin(/\.\/locale/, /moment/)
//     给打包出的js增加行首说明: webpack.bannerPlugin
//     热更需要的模块： webpack.HotModuleReplacementPlugin()
//        if (module && module.hot) {
//            module.hot.accept()
//        }

// ----------------------------------------------性能检测与优化详解---------------------------------------------------
// 3、性能检测与优化
// 3.1. 性能检测
//    3.1.1 slow-deps: npm install 时显示依赖大小，安装时间等
//    3.1.2 speed-measure-webpack-plugin: npm run build 时可视化编译耗时分布等，目前最好用
//    3.1.3 webpack-bundle-analyzer webpack 打包结果分析，找到打包过程中的性能瓶颈
// 3.2. 性能优化: 基础 缓存 多核 抽离 拆分
//   基础
//    3.2.1 loader 配置：exclude/include: 缩小loader处理范围，减少不必要的编译过程；cache 选项
//    3.2.6 jquery lodash 等较大的包，externals + cdn, 外部引用
//   缓存
//    3.2.2 很多loader 带cache选项，对loader就行缓存，比如babel-loader 的 cacheDiretory
//    3.2.3 cache-loader, 放在 loader 数组最前，缓存loader结果，无变化，直接取缓存
//    3.2.7 hard-source-webpack-plugin：缓存loader编译过程中的中间结果
//
//   多核(项目不够大不建议开启): thread-loader || HappyPack
//    3.2.4 HappyPack 配置多进程; 对loader处理，打包过程中的多进程
//    3.2.5 Js压缩过程中多进程：目前工程这个有问题，会严重影响热更速度：
//          0.1.1 webpack.optimize.UglifyJsPlugin : 自带，单线程，严重影响热更速度
//          0.1.2 webpack-parallel-uglify-plugin： 结合webpack自带，启用多线程，打包 热更都慢
//          uglifyjs-webpack-plugin： 独立多线程压缩插件；也是打包 热更慢
//   抽离: 抽离公共模块，结合webpack-bundle-analyzer，将不常变动又大的内容抽离出来，externals + cdn， 或者webpack-dll-plugin
//    3.2.2 提取公共模块到独立文件
//          webpack3 ： 插件 commonChunkPlugin
//          webpack4 ： 插件 optimization.splitChunk

//    3.2.3 动态链接库Dll
//       配置动态链接库：首先需要为动态链接库单独创建一个 Webpack 配置文件，比如叫做 webpack.vendor.config.js。
//          该配置对象需要引入 DllPlugin，其中的 entry 指定了把哪些模块打包为 vendor。
//       打包动态链接库并生成 vendor 清单：使用该配置文件进行打包（示例中运行 npm run dll）。
//          会生成一个 vendor.js 以及一个资源的清单，这个清单我们一般叫做 manifest.json，在内部每一个模块都会分配一个 ID。
//       将 vendor 连接到项目中：在工程的 webpack.config.js 中我们需要配置 DllReferencePlugin 来获取刚刚打包出来的模块清单。
//          这相当于工程代码和 vendor 连接的过程。
//   拆分：拆分业务逻辑
//      目前能想到的是 router 时，异步引入组件
