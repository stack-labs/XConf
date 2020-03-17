import { useEffect, useRef, useState } from 'react';

interface PropsValue<T> {
  value?: T;
  onChange?: (value: T) => void;
}

export const usePropsValue = <T = unknown>({
  value: valueFromProps,
  onChange,
}: PropsValue<T>): [T, (value: T) => void] => {
  const [value, setValue] = useState<T>();

  const callback = useRef((value: T) => {
    if (valueFromProps === undefined) setValue(value);
    onChange && onChange(value);
  });

  useEffect(() => {
    valueFromProps !== undefined && setValue(valueFromProps);
  }, [valueFromProps]);

  return [value as T, callback.current];
};
