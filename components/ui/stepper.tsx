import { createContext, PropsWithChildren, useContext, useState } from "react";

interface StepperProps {
  stage: number
}

const StepperContext = createContext(0);

const StepperProvider = ({ children, stage }: PropsWithChildren<StepperProps>) => {
  return (
    <StepperContext.Provider value={stage}>
      {children}
    </StepperContext.Provider>
  );
}

const StepperScreen = ({ stage, children }: PropsWithChildren<StepperProps>) => {
  const stepperStage = useContext(StepperContext);
  return (<>{stage === stepperStage && children}</>);
}

export function useStepperControl(numScreens: number): [number, () => boolean, () => boolean, (num: number) => void] {
  const [stage, setStage] = useState(0);

  const nextStage = () => {
    if ((stage + 1) <= numScreens) {
      setStage(prev => prev + 1);
      return true;
    }
    return false;
  }

  const previousStage = () => {
    if ((stage - 1) >= 0) {
      setStage(prev => prev - 1);
      return true;
    }
    return false;
  }

  return [stage, nextStage, previousStage, setStage];
}

const Stepper = {
  Provider: StepperProvider,
  Screen: StepperScreen
};

export default Stepper;