import { logger } from './util';
import git from 'git-rev-sync';

export function checkWorkingTree() {
  try {
    if (git.isDirty()) {
      logger.warn('Please commit your change of your current working tree firstly.');
      process.exit(1);
    }
  } catch (error) {
    logger.warn('WARN: No GIT repository found in current cwd.');
  }
}
