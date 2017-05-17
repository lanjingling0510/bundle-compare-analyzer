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
  makeList('  📝  目标版本', [24]),
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
  makeList('  📝  对比版本', [30]),
);

compareTable.updateView = data => {
  compareTable.setData({headers: [], data: data});
  screen.render();
};

// 分析视图
const analyzeTable = grid.set(0, 0, 9, 8, contrib.table, {
  label: '  🌈  对比分析视图',
  fg: 'white',
  selectedFg: 'white',
  interactive: false,
  columnSpacing: 1,
  columnWidth: [30, 20, 20, 20],
});

analyzeTable.updateView = data => {
  analyzeTable.setData({
    headers: ['File Name', 'Base Version', 'Compare Version', 'Rank'],
    data: data,
  });
  screen.render();
};

// 总览视图
const summaryBox = grid.set(9, 0, 3, 8, blessed.box, {
  label: '  💖  统计',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    border: { fg: 'cyan' },
    hover: { border: { fg: 'green' }, }
  }
});

summaryBox.updateView = (content) => {
  summaryBox.content = content;
  screen.render();
}

// 提示框
const tipBox = grid.set(3, 2, 4, 4, blessed.box, {
  tags: true,
  style: {
    border: {
      fg: 'white'
    }
  },
  content: `
    Welcome!  😘
    DOWN/UP = Moves cursor between lines
    ENTER = Select version
    ESC, CTRL_C, q = Abort
  `
});

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

screen.on('resize', function() {
  baseTable.emit('attach');
  compareTable.emit('attach');
  analyzeTable.emit('attach');
});

// 允许键盘操作
baseTable.focus();
compareTable.focus();

screen.render();

function makeList(label, columnWidth) {
  return {
    vi: true,
    tags: true,
    mouse: true,
    keys: true,
    label: label,
    columnSpacing: 1,
    columnWidth: columnWidth,
    border: {
      type: 'line', // or bg
    },
    style: {
      fg: 'white',
      border: {fg: 'cyan'},
      hover: {border: {fg: 'green'}},
      scrollbar: {bg: 'green', fg: 'white'},
    },
    scrollbar: {ch: ' '},
  };
}

module.exports = {
  baseTable: baseTable,
  compareTable: compareTable,
  analyzeTable: analyzeTable,
  summaryBox: summaryBox,
  tipBox: tipBox,
};
