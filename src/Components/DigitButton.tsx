import React from "react";
import { ACTIONS } from "../App";
import "../App.css";

interface DigitButtonProps {
  dispatch: React.Dispatch<any>;
  digit: string;
  className?: string;
}

function DigitButton({ dispatch, digit, className }: DigitButtonProps) {
  return (
    <button
      className={`input ${className || ""}`}
      onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}
    >
      {digit}
    </button>
  );
}

export default DigitButton;
