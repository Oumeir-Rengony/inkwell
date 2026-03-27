import debounce from "lodash.debounce";
import { useMemo } from "react";
import { useUnmount } from "@/hooks/use-unmount";

interface DebounceSettings {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  fn: T,
  wait = 500,
  dependencies: React.DependencyList = [],
  options?: DebounceSettings
): {
  (this: ThisParameterType<T>, ...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
} {
  const handler = useMemo(
    () => debounce(fn, wait, options),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fn, wait, options, ...dependencies]
  );

  useUnmount(() => {
    handler.cancel();
  });

  return handler;
}

export default useDebouncedCallback;