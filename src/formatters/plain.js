const format = (val) => {
  if (typeof val === 'object') {
    return '[complex value]';
  }
  if (typeof val === 'string') {
    return `'${val}'`;
  }
  if (val === null) {
    return null;
  }
  return val;
};

const plain = (data) => {
  const iter = (children, parent) => {
    const diffColl = children.flatMap((node) => {
      const newPath = parent ? `${parent}.${node.name}` : `${node.name}`;
      switch (node.type) {
        case 'nested':
          return iter(node.children, newPath);
        // если узел не менялся не выводим []
        case 'unchanged':
          return [];
        case 'deleted':
          return `Property '${newPath}' was removed`;
        case 'added':
          return `Property '${newPath}' was added with value: ${format(node.value2)}`;
        case 'changed':
          return `Property '${newPath}' was updated. From ${format(node.value1)} to ${format(node.value2)}`;
        default:
          return null;
      }
    });
    return diffColl.join('\n');
  };
  const result = iter(data, '');
  return result;
};

export default plain;
