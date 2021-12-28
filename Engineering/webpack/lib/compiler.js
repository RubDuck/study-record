const { getAST, getDependencies, trnasform } = require("./parser");

module.exports class Compiler {
  constructor(options) {
    const { entry, output } = options;
    this.entry = entry;
    this.output = output;
    this.modules = [];
  },
  run() {
    const entryModule = this.buildModule(this.entry);
    this.modules.push(entryModule);
    this.modules.map((_module) => {
      _module.dependencies.map((dependency) => {
        this.modules.push(this.buildModule(dependency));
      });
    });
    this.emitFiles();
  },
  buildModule(filename, isEntry) {
    let ast;
    if (isEntry) {
      ast = getAST(filename);
    } else {
      const absolutePath = path.join(....);
      ast = getAST(absolutePath);
    }
    return {
      filename,
      dependencies: getDependencies(ast),
      transformCode: trnasform(ast),
    }
  },
  // 输出文件
  emitFiles() {
    const outputPath = path.join(this.output.path, this.output.filename);
    let modules = '';
    this.modules.map((_module) => {
      modules += `${_module.filename}: function(require, module, exports) {${_module.transformCode}}`
    });
    const bundle = `
      (function(modules) {
        const fn = modules[fileName];
        const module = { exports: {} };
        fn(require, module, module.exports);
        return modules.exports;
      }
       require('${this.entry})
      )({${modules}})
    `;
    fs.writeFileSync(outputPath, bundle, 'utf-8');
  },
}