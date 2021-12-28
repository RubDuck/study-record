const fs = require('fs');
// require('@babel/parser')
const parse = {};
// require('@babel/traverse').default
const traverse = {};
// require('babel-core')
const transformFormAst = {};

module.exports = {
  getAST(path) {
    const source = fs.readFileSync(path, 'utf-8');
    return parse.parse(source, {
      sourceType: 'module',
    });
  },
  getDependencies(ast) {
    const dependencies = [];
    traverse(ast, {
      ImportDeclaration: ({ node }) => {
        dependencies.push(node.source.value);
      };
    });
  },
  trnasform(ast) {
    const { code } = transformFormAst(ast, null, {
      presets: ['env'],
    });
    return code;
  },
}