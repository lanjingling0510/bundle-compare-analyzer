#! /usr/bin/env node

const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const _ = require('lodash');
const filesize = require('filesize');
const dir = require('./util/dir.js');
const {
  baseTable,
  compareTable,
  analyzeTable,
  summaryBox,
  tipBox,
} = require('./util/blessed.js');
const ROOT_PATH = process.cwd();
// bundle分析存储目录
const DEST_PATH = path.resolve(ROOT_PATH, '.azer');

let baseVersion, compareVersion, baseBundle, compareBundle;

async function main() {
  try {
    // 选择目标版本
    await selectBaseVersion();

    // 选择对比版本
    await selectCompareVersion();
  } catch (err) {
    showError(err);
  }
}

main();

// 选择目标版本
async function selectBaseVersion() {
  const choices = await dir
    .traverse(DEST_PATH)
    .then(stats => stats.map(stat => [path.basename(stat.name, '.json')]));
  baseTable.updateView(choices);
  // 监听选择事件
  baseTable.on('select', value => {
    baseVersion = value.content.trim();
    // 更新summary视图
    updateSummaryView();
    if (compareVersion) {
      (async () => {
        // 分析数据
        await getBundles();
        const analyzeList = await analyzeBundles();
        // 渲染数据
        renderAnalyzeResult(analyzeList);
      })();
    }
  });
}

// 选择对比版本
async function selectCompareVersion() {
  const choices = await dir
    .traverse(DEST_PATH)
    .then(stats => stats.map(stat => [path.basename(stat.name, '.json')]));
  compareTable.updateView(choices);
  // 监听选择事件
  compareTable.on('select', value => {
    compareVersion = value.content.trim();
    // 更新summary视图
    updateSummaryView();

    if (baseVersion) {
      (async () => {
        // 分析数据
        await getBundles();
        const analyzeList = await analyzeBundles();
        // 渲染数据
        renderAnalyzeResult(analyzeList);
      })();
    }
  });
}

// 获得分析数据
async function getBundles() {
  baseBundle = await fs.readJson(path.join(DEST_PATH, baseVersion + '.json'));
  compareBundle = await fs.readJson(
    path.join(DEST_PATH, compareVersion + '.json'),
  );
}

// 分析数据
async function analyzeBundles() {
  const allKeys = _.uniq(
    baseBundle.stats
      .map(stat => stat.thunk + stat.ext)
      .concat(compareBundle.stats.map(stat => stat.thunk + stat.ext)),
  );

  const groupBaseBundle = _.groupBy(
    baseBundle.stats,
    value => value.thunk + value.ext,
  );

  const groupCompareBundle = _.groupBy(
    compareBundle.stats,
    value => value.thunk + value.ext,
  );

  const analyzeList = _.chain(allKeys)
    .map(key => {
      const base = groupBaseBundle[key] || [];
      const compare = groupCompareBundle[key] || [];
      const baseSize = base.reduce((a, b) => a + b.size, 0);
      const compareSize = compare.reduce((a, b) => a + b.size, 0);
      const gzipBaseSize = base.reduce((a, b) => a + b.gzipSize, 0);
      const gzipCompareSize = compare.reduce((a, b) => a + b.gzipSize, 0);
      return {
        key,
        base,
        compare,
        baseSize,
        compareSize,
        rankSize: baseSize - compareSize,
        gzipBaseSize: gzipBaseSize,
        gzipRankSize: gzipBaseSize - gzipCompareSize,
      };
    })
    .sortBy(item => - item.baseSize);

  return analyzeList;
}

// 渲染分析数据
function renderAnalyzeResult(list) {
  const data = list.map(item => [
    item.key,
    filesize(item.baseSize),
    filesize(item.compareSize),
    formatRank(item.rankSize),
    formatRank(item.gzipRankSize),
  ]);

  // 清除提示框
  tipBox.detach();

  analyzeTable.updateView(data);

  const allSize = list.reduce((a, b) => a + b.baseSize, 0);
  const allGzipSize = list.reduce((a, b) => a + b.gzipBaseSize, 0);
  const allCompareSize = list.reduce((a, b) => a + b.compareSize, 0);
  const allRankSize = list.reduce((a, b) => a + b.rankSize, 0);
  const allGzipRankSize = list.reduce((a, b) => a + b.gzipRankSize, 0);

  let summaryBoxContent = `\n\n{center}All Size: ${filesize(allSize)} / (gzip) ${filesize(allGzipSize)}`;
  if (allRankSize > 0) {
    summaryBoxContent += chalk.red(
      `   ↑ ${filesize(allRankSize)} / (gzip) ${filesize(allGzipRankSize)}`,
    );
    summaryBoxContent += chalk.red(
      `   optimize: ${((allCompareSize - allSize) / allSize * 100).toFixed(2)}%`,
    );
    summaryBoxContent += '  😕';
  } else if (allRankSize < 0) {
    summaryBoxContent += chalk.green(
      `   ↓ ${filesize(-allRankSize)} / (gzip) ${filesize(-allGzipRankSize)}`,
    );
    summaryBoxContent += chalk.green(
      `   optimize: ${((allCompareSize - allSize) / allSize * 100).toFixed(2)}%`,
    );
    summaryBoxContent += '  😝';
  } else {
    summaryBoxContent += '    -     -';
  }

  summaryBoxContent += '{/center}\n';
  summaryBox.content += summaryBoxContent;
}

// 更新概览视图
function updateSummaryView() {
  let content = '';
  if (baseVersion) {
    content = chalk.green('Base    Version: ' + baseVersion + '\n');
  }

  if (compareVersion) {
    content += chalk.green('Compare Version: ' + compareVersion + '\n');
  }
  summaryBox.updateView(content);
}

// 格式化变化量
function formatRank(size) {
  if (size > 0) {
    return chalk.red(`↑  ${filesize(size)}`);
  } else if (size < 0) {
    return chalk.green(`↓  ${filesize(-size)}`);
  }

  return '-';
}

function showError(error) {
  if (error) console.log(`\n  ${chalk.magenta(error)}`);
  process.exit(1);
}
