# fast-publish

A util to publish npm package conveniently.


It will do the next steps:
- Modify the version field of you 'package.json'.
- Commit your changes to remote repository.
- Tag you repository and push tags to the remote automatically.

## USAGE

- Installation

```bash
npm i -g fast-publish
# Or using yarn
yarn add global fast-publish
```

### Using with cmd/bash 

```fast-publish [options]```

Examples:
```bash
fast-publish

# Optionally, you can specify tag by using --dist-tag options. Example:
fast-publish --dist-tag latest

# Also, you can specify the version you want to publish by using --ver options. Example:
fast-publish --ver 0.1.0
```

Available options:
- --dist-tag {string}: The dist-tag of this version.
- --ver {string}: The version of the publishing package.
- --ignore-git {boolean}: Ignore detecting whether the working tree is clean
- --help -h: Display help for command
- --version -v: Output the version number

### Using with nodejs

```js
const fPub = require('fast-publish');

fPub.publish({
  distTag: 'latest', // By default, it is latest
  package: 'path/to/your/package', // By default, it is process.cwd()
  version: '0.1.0' // If no version is specified, program will ask for a answer.
});

```