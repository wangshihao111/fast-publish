import { spawn } from 'child_process';
import inquirer from 'inquirer';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import prettier from 'prettier';
import chalk from 'chalk';

/**
 * tag: npm tag.
 * package: The path of you package to publish.
 * version: The target version to publish.
 */
export interface PublishArg {
  tag?: string;
  package?: string;
  version?: string;
}

const cwd = process.cwd();

/**
 * publish a package
 * @param arg { PublishArg }
 */
export async function publish(arg: PublishArg) {
  const { tag = 'latest', package: pkg, version } = arg;
  const pkgPath = path.resolve(pkg || cwd, 'package.json');
  console.log(chalk.blueBright('Current version:'), require(pkgPath).version);
  let enterVersion: string = version;
  if (!enterVersion) {
    try {
      const res = await inquirer
        .prompt([
          {
            type: 'text',
            message: 'Please enter version: ',
            name: 'version',
          },
        ]);
      enterVersion = res.version;
    } catch (e) {
      if (e) {
        console.error(e);
      }
    }
  }
  if (!enterVersion) {
    console.log(chalk.red("Please enter a legal version number."));
    process.exit(1);
  }
  await runPublish({ version: enterVersion, distTag: tag })
}

async function runPublish({ version, distTag }) {
  if (version) {
    const pkgPath = path.resolve(__dirname, '../package.json');
    const content = JSON.parse(readFileSync(pkgPath, 'utf8'));
    content.version = version;
    const writeContent = prettier.format(JSON.stringify(content), { parser: 'json' });
    writeFileSync(pkgPath, writeContent, 'utf8');
    const queue = [
      `npm publish --tag ${distTag}`,
      'git add .',
      `git commit -m "Publish: ${version}"`,
      'git push',
      `git tag v${version}`,
      'git push --tags',
    ];
    for (let index = 0; index < queue.length; index++) {
      const script = queue[index];
      await new Promise((resolve, reject) => {
        const child = spawn(script, {
          shell: true,
          cwd: process.cwd(),
          stdio: ['ignore', process.stdout, process.stderr],
        });
        child.on('error', (e) => {
          reject(e);
        });
        child.on('exit', (code) => {
          if (code !== 0) {
            reject();
            console.log(chalk.red(`Run command: ${script} failed.`));
          } else {
            console.log(chalk.green(`Run command: ${script} successfully.`));
            resolve(undefined);
          }
        });
      });
    }
  }
}