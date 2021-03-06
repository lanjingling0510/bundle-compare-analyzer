#! /usr/bin/env node

const commander = require('commander');
const _ = require('lodash');
const fs = require('fs-extra');
const moment = require('moment');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const gzipSize = require('gzip-size');
const dir = require('./util/dir.js');
const ROOT_PATH = process.cwd();
const promptMessage = chalk.cyan('bundle-compare-analyzer') + ': ';
// bundle分析存储目录
const DEST_PATH = path.resolve(ROOT_PATH, '.azer');

commander.parse(process.argv);

if (_.isEmpty(commander.args)) {
  showError('Please enter the bundle path or file .');
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
  console.log(chalk.green('available version:'));
  console.log(chalk.green('.........................'));
  fileNames.forEach(name => {
    console.log(chalk.green(`\n${name}\n`));
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
      message: promptMessage + `Please enter a version name . (default: ${chalk.green(defaultID)})`,
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
    const statPromises =  stats.map(async stat => {
      const content = await fs.readFile(stat.path, 'utf8');
      return {
        thunk: stat.name.split('.')[0],
        ext: path.extname(stat.name),
        name: stat.name,
        size: stat.stat.size,
        gzipSize: gzipSize.sync(content)
      };
    });

    return Promise.all(statPromises);
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
        message: promptMessage + `Whether to coverwrite version ${chalk.cyan(versionID)}`,
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
  if (error) console.log(`\n  ☹️  ${chalk.red(error)}`);
  process.exit(1);
}
