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

  const attributes = Object.keys(element.attributes)
    .map((key) => {
      const type = typeof element.attributes[key];
      let value;

      if (type.toLowerCase() === 'string') {
        value = `'${element.attributes[key]}'`;
      } else if (type.toLowerCase() === 'boolean' || type.toLowerCase() === 'number') {
        value = `{${element.attributes[key]}}`;
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

  return `<${name}${attributes ? ' ' + attributes : '' }${end}`;
};

export default toString;
