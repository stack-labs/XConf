export const isNotEmptyArray = <T = any>(item: any): item is T[] => {
  return !!(Array.isArray(item) && item.length);
};
