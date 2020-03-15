export const debounce = (fn: Function, wait: number, option?: { immediately?: boolean }) => {
  let self: any, args: any[], timer: NodeJS.Timeout | null;
  const immediately = option?.immediately ?? false;

  const callback = () => {
    if (!immediately) fn.apply(self, args);
    timer = null;
  };

  const _debounce = function(this: any, ..._args: any[]) {
    self = this as any;
    args = _args;

    if (timer) {
      clearTimeout(timer);
      timer = setTimeout(callback, wait);
      return;
    }

    if (immediately) fn.apply(self, args);
    timer = setTimeout(callback, wait);
  };

  _debounce.cancel = function() {
    if (timer) clearTimeout(timer);
    timer = null;
  };

  return _debounce;
};

export const throttle = (fn: Function, interval: number, option?: { heading?: boolean; trailing?: boolean }) => {
  let self: any, args: any[], timer: NodeJS.Timeout | null, previous: number;
  const heading = option?.heading ?? true;
  const trailing = option?.trailing ?? true;

  const _throttle = function(this: any, ..._args: any[]) {
    self = this;
    args = _args;

    const now = Date.now();
    if (!previous && !heading) previous = now;

    const remain = interval - (now - previous);
    if (remain <= 0) {
      fn.apply(self, args);
      previous = Date.now();
    } else if (trailing) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(self, args);
        previous = Date.now();
      }, remain);
    }
  };

  _throttle.cancel = () => {
    if (timer) clearTimeout(timer);
    timer = null;
    previous = 0;
  };

  return _throttle;
};
