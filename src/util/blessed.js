const blessed = require('blessed');
const contrib = require('blessed-contrib');

// 屏幕
const screen = blessed.screen({
  fullUnicode: true, // emoji or bust
  smartCSR: true,
  autoPadding: true,
  title: '✨💖 bundle-compare-analyzer 💖✨',
});

const grid = new contrib.grid({rows: 12, cols: 12, screen: screen});

// 目标版本
const baseTable = grid.set(
  0,
  9,
  6,
  3,
  blessed.listtable,
  makeScrollList([30]),
);

baseTable.updateView = data => {
  baseTable.setData([[], ...data]);
  screen.render();
};

// 对比版本
const compareTable = grid.set(
  6,
  9,
  6,
  3,
  blessed.listtable,
  makeScrollList([30]),
);

compareTable.updateView = data => {
  compareTable.setData([[], ...data]);
  screen.render();
};

// 分析视图
const analyzeTable = grid.set(
  0,
  0,
  10,
  9,
  blessed.listtable,
  makeScrollList([30, 20, 20, 20, 20]),
);

analyzeTable.updateView = data => {
  const headers = ['File Name', 'Base Version', 'Compare Version', 'Rank', 'Gizp Rank'];
  analyzeTable.setData([headers, ...data]);
  screen.render();
};

// 总览视图
const summaryBox = grid.set(9, 0, 3, 9, blessed.box, makeScrollBox());

summaryBox.updateView = content => {
  summaryBox.content = content;
  screen.render();
};

// 提示框
const tipBox = grid.set(3, 3, 4, 4, blessed.box, {
  tags: true,
  style: {
    border: {
      fg: 'white',
    },
  },
  content: `
    Welcome!  😘
    DOWN/UP = Moves cursor between lines
    ENTER = Select version
    ESC, CTRL_C, q = Abort
  `,
});

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

screen.on('resize', function() {
  baseTable.emit('attach');
  compareTable.emit('attach');
  analyzeTable.emit('attach');
  summaryBox.emit('attach');
});


baseTable.focus();
screen.render();

// 设置标签名
analyzeTable.setLabel('  🌈  Analytic View');
baseTable.setLabel('  📝  Base Version');
compareTable.setLabel('  📝  Compare Version');
summaryBox.setLabel('  💖  Summary');

function makeScrollList(columnWidth) {
  const options = makeList(columnWidth);
  options.scrollable = true;
  options.scrollbar = {ch: ' '};
  options.style.scrollbar = {bg: 'green', fg: 'white'};
  options.style.header = {fg: 'cyan'};
  options.vi = true;
  options.alwaysScroll = true;
  options.mouse = true;
  return options;
}

function makeList(columnWidth) {
  const options = makeBox();
  options.columnSpacing = 1;
  options.padding = 1;
  options.noCellBorders = true;
  options.align = 'left';
  options.columnWidth = columnWidth;
  options.interactive = true;
  options.selectedBg = 'blue';
  return options;
}

function makeBox() {
  return {
    keys: true,
    tags: true,
    // draggable: true,
    border: {
      type: 'line', // or bg
    },
    style: {
      fg: 'white',
      border: {fg: 'cyan'},
      hover: {border: {fg: 'green'}},
    },
  };
}

function makeScrollBox() {
  const options = makeBox();
  options.scrollable = true;
  options.scrollbar = {ch: ' '};
  options.style.scrollbar = {bg: 'green', fg: 'white'};
  options.style.header = {fg: 'cyan'};
  options.vi = true;
  options.alwaysScroll = true;
  options.mouse = true;
  return options;
}

module.exports = {
  baseTable: baseTable,
  compareTable: compareTable,
  analyzeTable: analyzeTable,
  summaryBox: summaryBox,
  tipBox: tipBox,
};
