import { DependencyList, useEffect, useState } from "react";

type PromiseState<T> = {
  result: T | null;
  error: Error | null;
  loading: boolean;
};

const useAsyncValue = <T>(
  callback: null | (() => Promise<T>),
  deps: DependencyList
) => {
  const [state, setState] = useState<PromiseState<T>>(() => ({
    result: null,
    error: null,
    loading: Boolean(callback),
  }));

  useEffect(() => {
    if (!callback) {
      return;
    }
    let cancelled = false;

    setState((oldState) =>
      oldState.loading ? oldState : { ...oldState, loading: true }
    );
    callback()
      .then((result) => {
        if (!cancelled) {
          setState({ loading: false, error: null, result });
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setState({ loading: false, result: null, error });
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line
  }, deps);

  return state;
};

export default useAsyncValue;
