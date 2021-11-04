import inquirer from 'inquirer';
import { getNextVersion, logger } from './util';

export async function queryVersion(currentVersion: string) {
  let enterVersion: string;
  try {
    const res = await inquirer.prompt([
      {
        type: 'list',
        message: 'Please select publish version:',
        name: 'type',
        choices: [
          {
            name: `Patch (${getNextVersion(currentVersion, 'patch')})`,
            value: getNextVersion(currentVersion, 'patch'),
          },
          {
            name: `Minor (${getNextVersion(currentVersion, 'minor')})`,
            value: getNextVersion(currentVersion, 'minor'),
          },
          {
            name: `Major (${getNextVersion(currentVersion, 'major')})`,
            value: getNextVersion(currentVersion, 'major'),
          },
          {
            name: `Custom Prerelease`,
            value: 'cp',
          },
          {
            name: 'Custom version',
            value: 'cv',
          },
        ],
      },
    ]);
    if (res.type === 'cp') {
      const defaultV = getNextVersion(currentVersion, 'pre');
      const input = await inquirer.prompt([
        {
          type: 'text',
          message: `Please enter version (default is ${defaultV}): `,
          name: 'version',
        },
      ]);

      enterVersion = input.version || defaultV;
    } else if (res.type === 'cv') {
      const r = await inquirer.prompt([
        {
          type: 'text',
          message: `Please enter version: `,
          name: 'version',
        },
      ]);
      enterVersion = r.version;
    } else if (res.type) {
      enterVersion = res.type;
    } else {
      logger.error('Please select a version.');
      process.exit(1);
    }
    logger.info('Version to publish is:', enterVersion);
    return enterVersion;
  } catch (e) {
    if (e) {
      console.error(e);
    }
  }
}
