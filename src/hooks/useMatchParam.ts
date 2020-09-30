import { useMemo } from "react";
import { useRouteMatch } from "react-router-dom";

const useMatchParam = <P>(key: keyof P) => {
  const match = useRouteMatch<P>();
  return useMemo(() => match.params[key], [match, key])
}

export default useMatchParam;