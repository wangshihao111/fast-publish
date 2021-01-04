const commander = require('commander');
const { publish } = require('../lib');

commander.option('--dist-tag <distTag>').action((command) => {
  const { distTag = 'latest' } = command;
  console.log('distTag', distTag);
  publish({ tag: distTag });
});

commander.parse(process.argv);
