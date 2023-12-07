import React from "react";
import { ACTIONS } from "../App";
import "../App.css";

interface OperationButtonProps {
  dispatch: React.Dispatch<any>;
  operation: string;
}

const OperationButton: React.FC<OperationButtonProps> = ({ dispatch, operation }) => {
  return (
    <button
      className="operation"
      onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation } })}
    >
      {operation}
    </button>
  );
};

export default OperationButton;
