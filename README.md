# fast-publish

A util to publish npm package conveniently.


It will modify the version field of you 'package.json', then commit your changes to remote, and finally, tag you repository automatically.


## USAGE

- Installation

```bash
npm i -g fast-publish
# Or using yarn
yarn add global fast-publish
```

- Using with cmd/bash

```bash
# fast-publish
fast-publish

# Optionally, you can specify tag by using --dist-tag options. Example:
fast-publish --dist-tag latest
```

- Using with nodejs

```js
const fPub = require('fast-publish');

fPub.publish({
  distTag: 'latest', // By default, it is latest
  package: 'path/to/your/package', // By default, it is process.cwd()
  version: '0.1.0' // If no version is specified, program will ask for a answer.
});

```