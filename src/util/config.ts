import { getPkg } from './pkg';

export interface ConfigFile {
  gitTagTpl?: string; // eg: v${VERSION}
  pushGit?: boolean;
  autoTag?: boolean;
  commitTpl?: string; // eg: Publish:${COMMIT_MSG}
  npmClient?: string;
}

export const defaultConfig: ConfigFile = {
  autoTag: true,
  pushGit: true,
  gitTagTpl: 'v${VERSION}',
  commitTpl: 'Publish: ${VERSION}',
};

export const getConfig = (): ConfigFile => {
  const pkg = getPkg();
  return Object.assign({}, defaultConfig, pkg.fastPublish || {});
};
