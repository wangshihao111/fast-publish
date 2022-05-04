export function getNextVersion(version: string, type: 'patch' | 'minor' | 'major' | 'pre') {
  let versionNums: any[] = version.split('.').map((c) => {
    if (/^\d+$/.test(c)) {
      return Number(c);
    } else {
      return c;
    }
  });

  const oldIsPre = isPreRelease(version);
  if (oldIsPre && ['patch', 'major', 'minor'].includes(type)) {
    /(^\d+\.\d+\.\d+)(\-.*)?/.exec(version);
    versionNums = RegExp.$1.split('.').map(Number);
  } else if (!oldIsPre && type === 'pre') {
    versionNums[2] += 1;
    versionNums.push('alpha', 0);
    return versionNums.join('.');
  } else if (oldIsPre && type === 'pre') {
    (<number[]>versionNums)[versionNums.length - 1]++;
    return versionNums.join('.');
  }

  switch (type) {
    case 'major': {
      versionNums[0] += 1;
      versionNums[1] = versionNums[2] = 0;
      break;
    }
    case 'minor': {
      versionNums[1] += 1;
      versionNums[2] = 0;
      break;
    }
    case 'patch': {
      versionNums[2] += oldIsPre ? 0 : 1;
      break;
    }
    default:
      break;
  }
  return versionNums.join('.');
}

export function isPreRelease(version: string) {
  return version.includes('alpha') || version.includes('beta');
}
