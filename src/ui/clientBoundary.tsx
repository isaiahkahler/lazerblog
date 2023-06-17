"use client";

import { PropsWithChildren, useEffect, useState } from "react";

export default function ClientBoundary (props: PropsWithChildren<any>) {
  const {children} = props;
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  if(domLoaded) {
    return <>{children}</>;
  }

  return <></>;
}