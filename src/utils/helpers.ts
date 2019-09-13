export function yell(text: string) {
  return text.toUpperCase();
}
export function section(name, options) {
  if (!this._sections) this._sections = {};
  this._sections[name] = options.fn(this);
  return null;
}
export function t(category: string, text: string, locale: string = null) {
  // console.log(category, text, locale);
  return category + text + '(' + locale + ')';
}
