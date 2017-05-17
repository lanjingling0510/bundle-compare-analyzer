#! /usr/bin/env node

const commander = require('commander');
const fs = require('fs-extra');
const moment = require('moment');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const _ = require('lodash');
const dir = require('./util/dir.js');
const ROOT_PATH = process.cwd();
const promptMessage = chalk.cyan('bundle-compare-analyzer') + ': ';
// bundle分析存储目录
const DEST_PATH = path.resolve(ROOT_PATH, '.azer');

commander.parse(process.argv);

if (_.isEmpty(commander.args)) {
  showError('  😌  请输入生成的bundle路径.');
}

async function main() {
  try {
    // 展示已有的版本ID
    await showAllVersionID();
    // 设置versionID
    const versionID = await getVersionID();
    // 生成bundle信息
    const bundleStats = await generateBundleStats();
    // 存储到本地的bundle数据
    await writeLocalFile(versionID, bundleStats);

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
  const fileNames = await dir
    .traverse(DEST_PATH)
    .then(stats => stats.map(stat => path.basename(stat.name, '.json')));

  if (_.isEmpty(fileNames)) return;

  console.log();
  console.log(chalk.green('当前已有的bundle版本名称:'));
  console.log(chalk.green('.........................'));
  fileNames.forEach(name => {
    console.log(`${name}\n`);
  });
  console.log(chalk.green('.........................'));
}

// 获得版本ID
async function getVersionID() {
  const pkg = await fs.readJson('./package.json');
  const defaultID = `${pkg.version}_${moment().format('MMDDHH:mm:ss')}`;

  let schemaVersionID = [
    {
      type: 'input',
      name: 'value',
      message: promptMessage + `请输入版本名称（默认为${chalk.green(defaultID)}）`,
    },
  ];
  const versionIDObj = await inquirer.prompt(schemaVersionID);
  return versionIDObj.value || defaultID;
}

// 生成bundle信息
async function generateBundleStats() {
  const bundleDir = commander.args.map(value => path.resolve(ROOT_PATH, value));
  const promises = bundleDir.map(async value => {
    const stats = await dir.traverse(value);
    return stats.map(stat => ({
      thunk: stat.name.split('.')[0],
      ext: path.extname(stat.name),
      name: stat.name,
      size: stat.stat.size,
    }));
  });

  return Promise.all(promises);
}

// 存储到本地的bundle数据
async function writeLocalFile(versionID, bundleStats) {
  const bundleData = {
    id: versionID,
    stats: _.merge(...bundleStats),
  };

  await fs.ensureDir(DEST_PATH);

  const destPath = path.join(DEST_PATH, `${versionID}.json`);

  // 是否覆盖掉之前的bundle文件
  if (await fs.pathExists(destPath)) {
    let schema = [
      {
        type: 'confirm',
        name: 'confirm',
        message: `是否覆盖掉之前生成的${chalk.cyan(versionID)}.json分析文件`,
        default: true,
      },
    ];

    const result = await inquirer.prompt(schema);
    if (!result.confirm) {
      process.exit(1);
    }
  }

  // 写入文件中
  await fs.writeJson(destPath, bundleData);
}

function showError(error) {
  if (error) console.log(`\n  ${chalk.red(error)}`);
  process.exit(1);
}
