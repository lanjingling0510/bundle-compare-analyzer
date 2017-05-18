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
  8,
  6,
  4,
  contrib.table,
  makeList([24]),
);

baseTable.updateView = data => {
  baseTable.setData({headers: [], data: data});
  screen.render();
};

// 对比版本
const compareTable = grid.set(
  6,
  8,
  6,
  4,
  contrib.table,
  makeList([30]),
);

compareTable.updateView = data => {
  compareTable.setData({headers: [], data: data});
  screen.render();
};

// 分析视图
const analyzeTable = grid.set(
  0,
  0,
  9,
  8,
  blessed.listtable,
  makeScrollList([30, 20, 20, 20, 20]),
);

analyzeTable.updateView = data => {
  const headers = ['File Name', 'Base Version', 'Compare Version', 'Rank', 'Gizp Rank'];
  analyzeTable.setData([headers, ...data]);
  screen.render();
};

// 总览视图
const summaryBox = grid.set(9, 0, 3, 8, blessed.box, {
  label: '  💖  统计',
  tags: true,
  padding: 1,
  border: {
    type: 'line',
  },
  style: {
    fg: 'white',
    border: {fg: 'cyan'},
    hover: {border: {fg: 'green'}},
  },
});

summaryBox.updateView = content => {
  summaryBox.content = content;
  screen.render();
};

// 提示框
const tipBox = grid.set(3, 2, 4, 4, blessed.box, {
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
analyzeTable.setLabel('  🌈  对比分析视图');
baseTable.setLabel('  📝  目标版本');
compareTable.setLabel('  📝  对比版本');

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
  options.noCellBorders = true;
  options.align = 'left';
  options.columnWidth = columnWidth;
  options.interactive = true;
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

module.exports = {
  baseTable: baseTable,
  compareTable: compareTable,
  analyzeTable: analyzeTable,
  summaryBox: summaryBox,
  tipBox: tipBox,
};
