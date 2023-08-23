import { ReactNode } from "react";

const If = ({ value, children }: { value: any, children: ReactNode }) => <>{!!value && children}</>;

If.not = function not({ value, children }: { value: any, children: ReactNode }) { return (<>{!value && children}</>) };

export default If;