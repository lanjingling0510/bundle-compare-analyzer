#! /usr/bin/env node

const commander = require('commander');

const program = commander
.option('-n --name [name]', 'the version name')
.parse(process.argv);

console.log(commander.args);
console.log(program.name);
