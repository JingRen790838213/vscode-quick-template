export function toCamelCase(str) {
  const re = /-(\w)/g;
  const newStr = str.replace(re, function ($0, $1) {
    return $1.toUpperCase();
  });
  return newStr[0].toUpperCase() + newStr.substring(1);
}

export const travelTree = (
  list,
  key,
  callback: (props: {
    parent: any[];
    current: Record<string, any>;
    curretnIndex: number;
  }) => void,
) => {
  try {
    list.forEach((item, index) => {
      if (item.key === key) {
        // list.splice(index, 1);
        callback({ parent: list, current: item, curretnIndex: index });
        throw Error('find item & stop');
      }
      if (item.children) {
        travelTree(item.children, key, callback);
      }
    });
  } catch (error) {}
};
