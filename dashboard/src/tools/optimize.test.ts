import { debounce } from './optimize';

jest.useFakeTimers();

describe('debounce', () => {
  test('Normal', () => {
    const callback = jest.fn();
    const fn = debounce(callback, 500);

    for (let i = 0; i < 3; i++) {
      fn(i);
      jest.runTimersToTime(300);
    }
    expect(callback).not.toBeCalled();
    jest.runTimersToTime(1000);
    expect(callback).toBeCalledTimes(1);
    expect(callback).toHaveBeenLastCalledWith(2);
  });
  test('With immediately is true', () => {
    const callback = jest.fn();
    const fn = debounce(callback, 500, { immediately: true });

    for (let i = 0; i < 3; i++) {
      fn(i);
      jest.runTimersToTime(300);
    }
    expect(callback).toBeCalled();
    jest.runTimersToTime(1000);
    expect(callback).toBeCalledTimes(1);
    expect(callback).toHaveBeenLastCalledWith(0);
  });
  test('Call interval is less than the wait interval', () => {
    const callback = jest.fn();
    const fn = debounce(callback, 200);

    for (let i = 0; i < 3; i++) {
      fn(i);
      jest.runTimersToTime(300);
    }
    expect(callback).toBeCalledTimes(3);
    expect(callback).toHaveBeenCalledWith(0);
    expect(callback).toHaveBeenCalledWith(1);
    expect(callback).toHaveBeenCalledWith(2);
  });
});
