#!/usr/bin/env node

const commander = require('commander');
const { publish } = require('../lib');

commander.version(require('../package.json').version, '-v --version');

commander
  .option('-t, --dist-tag [distTag]', 'The dist tag of this publishing version')
  .option('-V, --ver [newVersion]', 'The version you want to publish.')
  .option('-ig, --ignore-git', 'Ignore detecting whether the working tree is clean')
  .option('-fp, --from-package', 'Publish a version that defined in package.json')
  .action((command) => {
    const { distTag = 'latest', ver, ignoreGit, fromPackage } = command;
    publish({ tag: distTag, version: ver, ignoreGit, fromPackage }).catch((e) => console.error(e));
  });

commander.parse(process.argv);
