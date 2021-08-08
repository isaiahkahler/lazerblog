const If = ({value, children}: {value: any, children: React.ReactNode}) => <>{!!value && children}</>;

If.not = function not({value, children}: {value: any, children: React.ReactNode}) {return(<>{!value && children}</>)};

export default If;