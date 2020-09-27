import React from "react";

export const Debug = (props: any) => (
  <pre>{JSON.stringify(props, null, 2)}</pre>
);
