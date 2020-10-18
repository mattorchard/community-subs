import { Context, useContext } from "react";

const useContextSafe = <N extends T | null | undefined, T>(
  context: Context<N>
): NonNullable<N> => {
  const contextValue = useContext(context);
  if (contextValue === null || contextValue === undefined) {
    throw new Error(`Cannot use ${context.displayName} outside of provider`);
  }
  return contextValue as NonNullable<N>;
};

export default useContextSafe;
