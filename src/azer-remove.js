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
    return Promise.reject('No version.');
  };

  let schema = [
    {
      type: 'checkbox',
      name: 'paths',
      message: promptMessage + 'Please select the version you want to delete .',
      default: [],
      choices: choices,
    },
  ];

    const result = await inquirer.prompt(schema);

    if (_.isEmpty(result.paths)) {
      return Promise.reject('No version selected.');
    };

    await result.paths.map(async (path) => {
      await fs.remove(path);
    });

}


function showError(error) {
  if (error) console.log(`\n  ☹️  ${chalk.red(error)}`);
  process.exit(1);
}
