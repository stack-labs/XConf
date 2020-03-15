interface BFSOption<T> {
  dataSource: T[];
  isTarget: (item: T) => boolean;
  children?: string;
}

export const BFS = <T = unknown>({ dataSource, isTarget, children = 'children' }: BFSOption<T>): T | undefined => {
  let res: T | undefined;

  const queue = [...dataSource];
  while (!res && queue.length) {
    const items = [...queue];
    queue.length = 0;
    for (let i = 0, len = items.length; i < len; i++) {
      const item = items[i];
      if (isTarget(item)) {
        res = item;
        break;
      }
      if (Array.isArray((item as any)[children])) queue.push(...(item as any)[children]);
    }
  }
  return res;
};
