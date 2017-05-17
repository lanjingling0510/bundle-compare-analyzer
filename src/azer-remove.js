#! /usr/bin/env node

const chalk = require('chalk');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const path = require('path');
const _ = require('lodash');
const dir = require('./util/dir.js');
const ROOT_PATH = process.cwd();
const promptMessage = chalk.cyan('bundle-compare-analyzer') + ': ';
// bundle分析存储目录
const DEST_PATH = path.resolve(ROOT_PATH, '.azer');

async function main() {
  try {
    // 展示已有的版本ID
    await showAllVersionID();

    console.log();
    console.log(chalk.green('😁  Good Job!'));
    console.log();
  } catch (err) {
    showError(err);
  }
}

main();

// 显示已有的版本ID
async function showAllVersionID() {
  await fs.ensureDir(DEST_PATH);
  const choices = await dir
    .traverse(DEST_PATH)
    .then(stats => stats.map(stat => ({
      name: path.basename(stat.name, '.json'),
      value: stat.path,
    })));

  if (_.isEmpty(choices)) {
    return Promise.reject('当前还没有添加版本.');
  };

  let schema = [
    {
      type: 'list',
      name: 'path',
      message: promptMessage + '请选择要删除的版本',
      default: 0,
      choices: choices,
    },
  ];

    const result = await inquirer.prompt(schema);

    if (result.path) {
      await fs.remove(result.path);
    }
}


function showError(error) {
  if (error) console.log(`\n  ${chalk.red(error)}`);
  process.exit(1);
}
