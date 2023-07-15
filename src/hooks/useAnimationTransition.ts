"use client";

import { useEffect, useState } from "react";
import animationStyles from '@/styles/animations.module.css';
import { stat } from "fs";

type TransitionDef = { className: string, duration: number };

type TransitionGroup = SequentialTransitionGroup | SimultaneousTransitionGroup | OverlapTransitionGroup;

type SequentialTransitionGroup = {
  transitions: TransitionDef[],
  type: 'sequential'
}

type SimultaneousTransitionGroup = {
  transitions: TransitionDef[],
  type: 'simultaneous'
}

type OverlapTransitionGroup = {
  transitions: TransitionDef[],
  type: 'overlap',
  overlapDuration: number
}


export const Animations: { [key: string]: TransitionDef } = {
  fadeIn: { className: animationStyles.fadeIn, duration: 250 },
  fadeInUp: { className: animationStyles.fadeInUp, duration: 250 },
  fadeInDown: { className: animationStyles.fadeInDown, duration: 250 },
  fadeInLeft: { className: animationStyles.fadeInLeft, duration: 250 },
  fadeInRight: { className: animationStyles.fadeInRight, duration: 250 },
  expandVertical: { className: animationStyles.expandVertical, duration: 500 },
  fadeOut: { className: animationStyles.fadeOut, duration: 250 },
  fadeOutUp: { className: animationStyles.fadeOutUp, duration: 250 },
  fadeOutDown: { className: animationStyles.fadeOutDown, duration: 250 },
  fadeOutLeft: { className: animationStyles.fadeOutLeft, duration: 250 },
  fadeOutRight: { className: animationStyles.fadeOutRight, duration: 250 },
  collapseVertical: { className: animationStyles.collapseVertical, duration: 250 },
  shake: { className: animationStyles.shake, duration: 800 },
};

interface AnimationTransitionOptions {
  entrance?: TransitionDef,
  exit?: TransitionDef,
  main?: string
}

/**
 * hook for managing CSS animation entrance/exit class names using state
 * @param showElement true = the element should be shown; false = should be hidden
 * @param options 
 * @returns [outputState, outputEntranceClass?, outputExitClass?]
 */
export function useAnimationTransition(showElement: boolean, options: AnimationTransitionOptions) {
  const { entrance, main, exit } = options;
  // const {className: entranceClassName, duration: entranceDuration} = entrance;
  const entranceDuration = entrance ? entrance.duration : 0;
  const exitDuration = exit ? exit.duration : 0;

  const transitionState = useTransitionStateManager(showElement, entranceDuration, exitDuration);


  let outputState = showElement;
  let outputEntranceClass = ''; //entrance?.className || ''
  let outputMainClass = ''; // main || ''
  let outputExitClass = ''; // exit?.className || ''

  switch (transitionState) {
    case 'initial':
      // console.log('state is initial')
      outputState = showElement;
      break;
    case 'entrance':
      outputState = true;
      // console.log('state is entrance')
      outputEntranceClass = entrance?.className || '';
      break;
    case 'main':
      // console.log('state is main')
      outputState = true;
      outputMainClass = main || '';
      break;
    case 'exit':
      // console.log('state is exit')
      outputState = true;
      outputExitClass = exit?.className || '';
      break;
  }

  return {
    showElement: outputState,
    transitionEntrance: outputEntranceClass,
    transitionMain: outputMainClass,
    transitionExit: outputExitClass
  };

  /*
  const [outputState, setOutputState] = useState(false);
  const [outputEntrance, setOutputEntrance] = useState<string>('');
  const [outputExit, setOutputExit] = useState<string>('');
  const [outputMain, setOutputMain] = useState<string>('');
  const { entrance, exit, main } = options;


  // update the output state to match, if its true
  useEffect(() => {
    if (showElement) setOutputState(true);
  }, [showElement]);

  // update the state to match immediately if there is no exit class
  useEffect(() => {
    if (!showElement && !exit) setOutputState(false);
  }, [exit, showElement])

  // if theres an entrance, remove the class after finished 
  useEffect(() => {
    if (!entrance) return;
    if (showElement) {
      setOutputEntrance(entrance.className);

      const handleEntrance = () => {
        setOutputEntrance('');
        if (main) setOutputMain(main.className);
      }


      setTimeout(handleEntrance, entrance.duration);
    }
  }, [showElement, entrance, main]);

  // if there's an exit, apply the class, delay the transition state
  useEffect(() => {
    if (!exit) return;
    if (!showElement) {
      setOutputExit(exit.className);
      setTimeout(() => {
        setOutputState(false);
        setOutputExit('');
      }, exit.duration);
    }
  }, [showElement, exit])

  // if there's a main, apply the class after entrance and remove before exit
  useEffect(() => {

  }, [])

  // no transition, return initial state
  if (!entrance && !exit) return [showElement];

  if (entrance) {
    if (exit) {
      return [outputState, outputEntrance, outputExit]
    }
    return [outputState, outputEntrance];
  }
  return [outputState, outputExit];
  */
}


interface AnimationEffectOptions {
  transitionDelay?: number,
  effect: TransitionDef
}

/**
 * hook for managing CSS animation class name for a temporary effect.
 * works easiest with CSS transition properties. 
 * @param showElement 
 * @param options 
 */
export function useAnimationEffect(showEffect: boolean, options: AnimationEffectOptions) {

  /* 
  lifecycle:
  - element is regular
  - apply class

  */
}


// function useAnimationTransition2(showElement: boolean, options: AnimationTransitionOptions) {
//   const [outputState, setOutputState] = useState(false);

//   const [stateManager, setStateManager] = useState()
//   const [outputEntrance, setOutputEntrance] = useState<string>('');
//   const [outputExit, setOutputExit] = useState<string>('');
//   const [outputMain, setOutputMain] = useState<string>('');
//   const { entrance, exit, main } = options;


// }



// function useAnimation(definition: Animation | TransitionGroup) {

// }





// how to make a state manager ? 


type TransitionState = 'initial' | 'entrance' | 'main' | 'exit';

const stateDefinitions: { [index: number]: TransitionState } = {
  0: 'initial',
  1: 'entrance',
  2: 'main',
  3: 'exit'
}

function useTransitionStateManager(showElement: boolean, entranceDuration = 250, exitDuration = 250) {
  const [state, setState] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [currentTimeout, setCurrentTimeout] = useState<number | NodeJS.Timeout | null>(null);

  // when showElement is true, move to 'entrance' state
  useEffect(() => {
    if (showElement && stateDefinitions[state] === 'initial') {
      setState(1); // 1 = entrance

      // move to 'main' state after entrance duration
      const entranceTimeout = setTimeout(() => setState(2), entranceDuration)
      setCurrentTimeout(entranceTimeout);
    };
    return;
  }, [entranceDuration, showElement, state]);


  // when showElement is false, move to 'exit' state
  useEffect(() => {
    if (!showElement && (state === 1 || state == 2)) {
      // clear the timeout if in the middle of the entrance transition 
      if (currentTimeout) {
        clearTimeout(currentTimeout);
        setCurrentTimeout(null);
      }
      setState(3); // 3 = exit

      // move to 'initial' state after duration
      setTimeout(() => setState(0), exitDuration);
    };
  }, [showElement, state, exitDuration, currentTimeout]);

  return stateDefinitions[state];
}