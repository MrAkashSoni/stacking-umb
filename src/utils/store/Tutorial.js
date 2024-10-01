import React from "react";

const TutorialContext = React.createContext();

const START = "START";
const NEXT = "NEXT";
const CLOSE = "CLOSE";

export const initialState = {
  step: 0,
};

export function reducer(state = {}, action = {}) {
  switch (action.type) {
    case START:
      return {
        step: 1,
      };
    case NEXT:
      return {
        step: state.step + 1,
      };
    case CLOSE:
      return {
        step: 0,
      };
    default:
      return state;
  }
}

export function startTutorial() {
  return { type: START };
}

export function nextStep() {
  return { type: NEXT };
}
export function closeTutorial() {
  return { type: CLOSE };
}

export function TutorialProvider({ children }) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <TutorialContext.Provider value={{ state, dispatch }}>
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  return React.useContext(TutorialContext);
}
