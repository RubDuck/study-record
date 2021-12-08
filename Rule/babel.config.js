/**
 * 基础说明
 */
module.exports = {
  presets: [  // 预设置配置
    [
      "@babel/preset-env",  // preset-env 集成环境，兼容大多数es语法
      {
        "modules": false,  // import 导入， 不添加会被转为 require();
        "useBuiltIns": "usage", // 按需求引入polyfill
        "corejs": "3",  // 添加来去除引入polyfill警告
        'targets': {
          'browsers': ["ie >= 8", "iOS 7"] // 支持ie8，直接使用iOS浏览器版本7
        }
      }
    ]
  ],
  plugins: [ // 插件配置
    [
      "@babel/plugin-transform-runtime", // 沙箱环境
      {
        "corejs": 2
      }
    ]
  ]
}


// 选项："usage"| "entry"| false，默认为false。
// entry我们已经用过了，意义就是在入口处将根据我们配置的浏览器兼容，将目标浏览器环境所有不支持的API都引入。
// usage就很nb了，当配置成usage的时候，babel会扫描你的每个文件，然后检查你都用到了哪些新的API，跟进我们配置的浏览器兼容，只引入相应API的polyfill，我们把useBuiltIns属性设置为usage再来看下编译效果
// 我们需要在preset-env配置项中指定core-js版本，这样就不会再有警告⚠️了


/**
 * jsx应用
 */

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    ['@vue/babel-preset-jsx', { compositionAPI: true }],
  ],
  plugins: [
    ['import', {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: (name) => `${name}/style/less`,
    }, 'vant'],
    ['@babel/plugin-transform-typescript', { isTSX: true }],
  ],
};