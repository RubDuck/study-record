const fs = require('fs');
const childProcess = require('child_process');

const msgPath = process.env.GIT_PARAMS;
const msg = fs.readFileSync(msgPath, 'utf-8').trim();


/**
 * feat：新增功能
 * update: 现有功能(文件)更新
 * fix：bug 修复
 * docs：文档更新
 * style：不影响程序逻辑的代码修改(修改空白字符，格式缩进，补全缺失的分号等，没有改变代码逻辑)
 *    不要和页面样式修改搞混,页面样式修改请使用update
 * refactor：重构代码(既没有新增功能，也没有修复 bug)
 * test：新增测试用例或是更新现有测试
 * chore：项目构建功能修改
 * revert：回滚某个更早之前的提交
 */
 const commitRE = /^(feat|update|fix|docs|style|refactor|test|chore|revert): .{1,50}/;

 if (!commitRE.test(msg)) {
   console.error('提交的消息内容格式不正确')
   process.exit(1)
 }
 
 const girBranch = 'git symbolic-ref --short -q HEAD';
 
 const branch = childProcess.execSync(girBranch).toString().trim();
 
 const msgSplitArray = msg.split(':');
 
 const newMsgSplitArray = [msgSplitArray[0], `(${branch}):`, msgSplitArray.slice(1)];
 
 fs.writeFileSync(msgPath, newMsgSplitArray.join(''), { encoding: 'utf-8' });
 
 process.exit(0);
 