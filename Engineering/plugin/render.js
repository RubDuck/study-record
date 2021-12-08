var path = require('path');
var webpack = require('webpack');
var webpackMajorVersion = require('webpack/package.json').version.split('.')[0];
var NodeTemplatePlugin = require('webpack/lib/node/NodeTemplatePlugin');
var NodeTargetPlugin = require('webpack/lib/node/NodeTargetPlugin');
var LoaderTargetPlugin = require('webpack/lib/LoaderTargetPlugin');
var LibraryTemplatePlugin = require('webpack/lib/LibraryTemplatePlugin');
var SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
var MultiEntryPlugin = require('webpack/lib/MultiEntryPlugin');
var ExternalsPlugin = require('webpack/lib/ExternalsPlugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');

var createBundleRenderer = require('vue-server-renderer').createBundleRenderer;
var nodeExternals = require('webpack-node-externals');


module.exports = function render(webpackConfig, ref) {
  // oneTap  初始化配置 「 合成用户配置 --> 校验配置 --> 合并最终配置 」
  var compilation = ref.compilation;
  var context = ref.context;
  
  var options = compilation.outputOptions;

  var outputPath = options.path;
  var outputPublicPath = options.publicpath;

  var outputJSPath = path.join(outputPath, webpackConfig.output.filename);
  var outputBaseName = path.basename(outputJSPath, path.extname(outputJSPath));
  var outputCssBase = outputBaseName + '.css';
  var outputCssPath = path.join(outputPath, outputCssBase);


  var outputOptions = {
    filename: outputJSPath,
    public: outputPublicPath,
  };


  // twoTap 结合配置创建compiler 对象
  var childCompiler = compilation.createChildCompiler('mine-test-plugin-compiler', outputOptions);

  childCompiler.context = context;
  
  // threeTap 初始化编译环境 加载各种内置插件
  new LibraryTemplatePlugin(undefined, 'commonjs2').apply(childCompiler);
  new NodeTargetPlugin().apply(childCompiler);

  // 入口初始化构建
  if (Array.isArray(webpackConfig.entry)) {
    new MultiEntryPlugin(context, webpackConfig.entry, undefined).apply(childCompiler);
  } else {
    new SingleEntryPlugin(context, webpackConfig.entry, undefined).apply(childCompiler);
  }

  // css 解析 >>>>>

  console.log('______ outputcss path is: ', outputCssPath, '_________ outputjs path is: ', outputJSPath);
  new LoaderTargetPlugin('node').apply(childCompiler);

  new ExternalsPlugin('commonjs2', webpackConfig.externals || nodeExternals({
    whitelist: /\.css$/
  })).apply(childCompiler);

  new MiniCssExtractPlugin({
    filename: outputCssPath,
  }).apply(childCompiler);

  console.log('___________ current compiler is : ', childCompiler);

  return new Promise(function(resolve, reject) {
    // 开始编译 「 构建module子类  --> laoder-runner 解析转译 module 内容  --> acorn 解析为AST --> 遍历完成调用模块处理 --> 重复以上步骤 」
    childCompiler.runAsChild(function(err, entries, childCompilation) {
      console.log('________ current assets source: ', childCompilation.assets);
      var bundle = childCompilation.assets[outputJSPath].source();
      var skeletonCSS = '';
      console.log('_____ current assets css has: ', childCompilation.assets[outputCssPath]);
      if (childCompilation.assets[outputCssPath]) {
        skeletonCSS = childCompilation.assets[outputCssPath].source();
      }
      var renderer = createBundleRenderer(bundle);
      renderer.renderToString({}, function(err, skeletoHtml) {
        console.log('______ current render to html is：', skeletoHtml);
        resolve({
          HTML: skeletoHtml,
          CSS: skeletonCSS,
        });
      })
    })
  })
}