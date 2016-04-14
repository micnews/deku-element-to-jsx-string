import {html, js} from 'js-beautify';
import stringifyObject from 'stringify-object';
import Set from 'es6-set';
const filterAttributes = new Set(['dispatch', 'store', 'storeState', 'children']);

const toString = (element) => {
  if (typeof element === 'string') {
    return element;
  }

  const name = typeof element.type === 'string'
    ? element.type
    : element.type.name;

  if (!name) {
    throw new Error('Component name must be set');
  }

  const objects = [];

  const attributes = Object.keys(element.attributes)
    .filter((key) => {
      return !filterAttributes.has(key);
    })
    .map((key) => {
      const type = typeof element.attributes[key];
      let value;

      if (type === 'string') {
        value = `'${element.attributes[key]}'`;
      } else if (type === 'boolean' || type === 'number') {
        value = `{${element.attributes[key]}}`;
      } else if (type === 'object') {
        const stringified = stringifyObject(element.attributes[key]);
        objects.push(`const ${key} = ${stringified};`);
        value = `{${key}}`;
      } else {
        value = `{${type}}`;
      }
      return `${key}=${value}`;
    }).join(' ');

  let end = '/>';
  if (element.children && element.children.length) {
    const children = element.children.map(toString).join('');
    end = `>${children}</${name}>`;
  }

  const prettyObjects = objects.length
    ? js(objects.join('\n'), { indent_size: 2 }) + '\n'
    : '';

  return prettyObjects +
    html(`<${name}${attributes ? ' ' + attributes : '' }${end}`, { indent_size: 2, wrap_attributes: 'force' });
};

export default toString;
