export const renderTpl = (tpl: string, placeholder: string, value: string) => {
  return tpl.replace(new RegExp(`\\$\\{\\\s*${placeholder}\\s*\}`), value);
};
