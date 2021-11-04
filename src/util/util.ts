import chalk from 'chalk';

export const renderTpl = (tpl: string, placeholder: string, value: string) => {
  return tpl.replace(new RegExp(`\\$\\{\\\s*${placeholder}\\s*\}`), value);
};

export const logger = {
  info(label: string, message: string) {
    console.log(chalk.blueBright(label), message);
  },
  error(message: string) {
    console.log(chalk.red(message));
  },
  warn(message: string) {
    console.log(chalk.yellow(message));
  },
};
