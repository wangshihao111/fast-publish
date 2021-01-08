#!/usr/bin/env node
const commander = require('commander');
const { publish } = require('../lib');

commander.version(require('../package.json').version, '-v --version');

commander
  .option('--dist-tag [distTag]', 'The dist tag of this publishing version')
  .option('--ver [newVersion]', 'The version you want to publish.')
  .option('--ignore-git', 'Ignore detecting whether the working tree is clean')
  .action((command) => {
    const { distTag = 'latest', ver, ignoreGit } = command;
    publish({ tag: distTag, version: ver, ignoreGit}).catch((e) => console.error(e));
  });

commander.parse(process.argv);
