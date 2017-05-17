const fs = require('fs-extra');
const path = require('path');
const valid_extensions = ['.js', '.css', '.json'];

// 解析bundle路径
async function traverse(dir) {
  // 最终返回的state解析对象
  const state = [];

  async function recurse(dir) {
    const stat = await fs.stat(dir);
    if (stat.isFile()) {
      // 如果是文件

      // 做些什么...
      if (~valid_extensions.indexOf(path.extname(dir))) {
        state.push({
          name: path.basename(dir),
          path: dir,
          stat: stat,
        });
      }

    } else {
      // 如果是路径
      const files = await fs.readdir(dir);

      const promises = files.map(async file => {
        const dest = path.join(dir, file);
        await recurse(dest);
      });

      await Promise.all(promises);
    }
  }

  await recurse(dir);

  return state.reverse();
}

module.exports = {
  traverse: traverse,
};
