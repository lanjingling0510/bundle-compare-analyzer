#! /usr/bin/env node

const commander = require('commander');


commander
  .version(require('../package.json').version)
  .usage(
`[command]

  Arguments:

    bundleDir        Directory containing all generated bundles.`
  )
  .command('add <bundleDir>', 'add the specified the version of the bundle files')
  .command('compare', 'compare multiple versions about bundle files information.')
  .command('remove', 'remove the specified version')
  .parse(process.argv);
