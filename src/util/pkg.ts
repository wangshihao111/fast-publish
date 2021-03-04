import { accessSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { ConfigFile } from './config';
import { cwd } from './constant';

export const pkgPath = resolve(process.cwd(), 'package.json');

export const getPkgPath = () => {
  let folds = 3;
  const getPath = (base: string): string | undefined => {
    if (folds === 0) {
      return undefined;
    }
    try {
      const pkg = resolve(base, 'package.json');
      accessSync(pkg);
      return pkg;
    } catch (error) {
      folds--;
      return getPath(resolve(base, '../'));
    }
  };
  return getPath(cwd);
};

export const getPkg = (): any => {
  const path = getPkgPath();
  if (path) {
    return JSON.parse(readFileSync(path, 'utf8'));
  }
  return {};
};
