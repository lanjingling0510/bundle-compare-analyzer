#! /usr/bin/env node

const commander = require('commander');

commander
  .version(require('../package.json').version)
  .usage(
`[command] [flags]

  Arguments:

    bundleDir        Directory containing all generated bundles.
                     They will be analyzed and generate an analysis file into the .analyzer.`
  )
  .command('add <bundleDir>', 'add the specified the version name of the bundle analysis file')
  .command('compare [files]', 'compare multiple analysis files')
  .parse(process.argv);
