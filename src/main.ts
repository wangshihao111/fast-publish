import { spawn } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import prettier from 'prettier';
import chalk from 'chalk';

import { cwd, getConfig, getNextVersion, logger, renderTpl } from './util';
import { checkWorkingTree } from './util/git';
import { queryVersion } from './query';

/**
 * tag: npm tag.
 * package: The path of you package to publish.
 * version: The target version to publish.
 */
export interface PublishArg {
  tag?: string;
  package?: string;
  version?: string;
  ignoreGit?: string;
  fromPackage?: boolean;
}

/**
 * publish a package
 * @param arg { PublishArg }
 */
export async function publish(arg: PublishArg) {
  const { tag = 'latest', package: pkg, version, ignoreGit, fromPackage } = arg;
  if (!ignoreGit) {
    checkWorkingTree();
  }
  const pkgPath = pkg || cwd;
  const pkgJsonPath = path.resolve(pkgPath, 'package.json');
  const currentVersion = require(pkgJsonPath).version;
  logger.info('Current version:', currentVersion);
  let enterVersion: string = version;
  if (fromPackage) {
    enterVersion = currentVersion;
  }
  if (!enterVersion) {
    enterVersion = await queryVersion(currentVersion);
  }
  if (!enterVersion) {
    console.log(chalk.red('Please enter a legal version number.'));
    process.exit(1);
  }
  await runPublish({ version: enterVersion, distTag: tag, pkg: pkgPath });
}

async function runPublish({ version, distTag, pkg = cwd }) {
  const { pushGit, gitTagTpl, autoTag, commitTpl } = getConfig();
  if (version) {
    const pkgPath = path.resolve(pkg, 'package.json');
    const content = JSON.parse(readFileSync(pkgPath, 'utf8'));
    content.version = version;
    const writeContent = prettier.format(JSON.stringify(content), { parser: 'json' });
    writeFileSync(pkgPath, writeContent, 'utf8');
    const queue = [
      `npm publish --tag ${distTag}`,
      'git add .',
      `git commit -m "${renderTpl(commitTpl, 'VERSION', version)}"`,
      pushGit && 'git push',
      autoTag && `git tag ${renderTpl(gitTagTpl, 'VERSION', version)}`,
      autoTag && 'git push --tags',
    ].filter(Boolean);
    for (let index = 0; index < queue.length; index++) {
      const script = queue[index];
      await new Promise((resolve, reject) => {
        const child = spawn(script, {
          shell: true,
          cwd: pkg,
          stdio: ['ignore', process.stdout, process.stderr],
        });
        child.on('error', (e) => {
          reject(e);
        });
        child.on('exit', (code) => {
          if (code !== 0) {
            reject();
            console.log(chalk.red(`Run command: [${script}] failed.`));
          } else {
            console.log(chalk.green(`Run command: [${script}] successfully.`));
            resolve(undefined);
          }
        });
      });
    }
  }
}
