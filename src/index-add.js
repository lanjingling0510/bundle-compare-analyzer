#! /usr/bin/env node

const commander = require('commander');

commander
.option('-n --name [name]', 'the version name')
.parse(process.argv);

console.log(commander.args);
