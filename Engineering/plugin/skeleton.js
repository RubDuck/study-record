const fs = require("fs")
const path = require("path")
const render = require("./render");

const DEFAULT_PLUGIN_OPTIONS = {
  webpackConfig: {},
  insertAfter: '<div id="app">',
  insertCss: '</head>',
  quiet: false
};

const Skeleton = function Skeleton(options) {
  this.options = Object.assign({}, DEFAULT_PLUGIN_OPTIONS, options);
}

function createSkeletonWebpackConfig(options) {
  console.log('___________  createSkeletonWebpackConfig options is ：', options);
  var skeletonWebpackConfig = {
    entry: '',
    output: {
      filename: '',
    },
  };
  skeletonWebpackConfig.entry = options.entry;
  skeletonWebpackConfig.output.filename = "skeleton-tets.js";
  return skeletonWebpackConfig;
}

function insertAtHtml(html, skeleton, idx) {
  return html.slice(0, idx) + skeleton + html.slice(idx);
}

// 插件本质 - 调用对象apply
/**
 *  基础流程
 *  初始化配置
 *  结合配置生成compiler对象
 *  加载内置插件
 *  入口初始化构建
 *  编译（构建module子类 --> 解析转译module 内容 --> 解析为AST --> 遍历完成调用模块处理 --> 处理...）
 */
Skeleton.prototype.apply = function apply (compiler) {
  console.log('____________ 自定义 hook 开始执行：');
  if (compiler.hooks) {
    compiler.hooks.make.tapAsync('Skeleton', (compilation, cb) => { // hooks make 阶段
      console.log('_________  自定义 hook 开始编译：');
      cb();
      if (!compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing) {
        console.error('___________  VueSkeletonWebpackPlugin must be placed after HtmlWebpackPlugin in `plugins`.');
        return;
      }
      render(createSkeletonWebpackConfig(this.options), {compilation: compilation, context: compiler.context}).then((result) =>{
        compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync('Skeleton', (htmlPluginData, callbalk) => {  // hooks 解析html 阶段
          console.log('___________  plugin options is：', this.options);
          const html = htmlPluginData.html;
          const jsInsertStart = html.lastIndexOf(this.options.insertAfter) + this.options.insertAfter.length;
          const cssinsertStart = html.lastIndexOf(this.options.insertCss) + this.options.insertCss.length;
          htmlPluginData.html = insertAtHtml(html, result.HTML, jsInsertStart);
          console.log('______ 自定义插件 hook 观测：', htmlPluginData);
          callbalk(null, htmlPluginData);
        })
      })
    })
  }
}

module.exports = Skeleton