import "./App.css";
import DigitButton from "./Components/DigitButton";
import OperationButton from "./Components/OperationButton";
import Modal from "./Components/Modal";
import { useReducer, useState } from "react";

//operasi kalkulator
export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
  SET_RESULT: "set-result",
};

//hook buat input sama case
function reducer(
  state: any,
  { type, payload }: { type: string; payload: any }
) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      // console.log({ msg: "Add Digit", state });

      //kondisi abis kli = nanti hasil diganti ke input
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }

      //passing digit dari payload ke reducer
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }

      //Error fix 3
      if (state.currentOperand == null) {
        return {
          ...state,
          currentOperand: payload.digit,
        };
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }

      //ganti operator
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };

    //balikin overwrite kefalse
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }

      //gaada operand gausah ngapa-ngapain
      if (state.currentOperand == null) return state;

      //sisa 1 digit diubah jadi empty string
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }

      //default case
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };

    case ACTIONS.EVALUATE:
      //minimum 3 input
      // console.log(1);
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        // console.log(2);
        return state;
      }
      // console.log(3);

      //kalo udh selesai di kosongin
      const result = evaluate(state);
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: result,
        //masukin ke history
        results: [...state.results, result],
      };

    case ACTIONS.CLEAR:
      return {
        ...state,
        currentOperand: "",
        previousOperand: "",
        operation: "",
        overwrite: false,
      };

    default:
      return state;
  }
}

function evaluate({ currentOperand, previousOperand, operation }: any) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);

  if (isNaN(prev) || isNaN(current)) return "";

  //error case
  if (operation === "/" && current === 0) {
    return "Err";
  }

  let computation: string = "";
  //  Error Fix 1
  switch (operation) {
    case "+":
      computation = (prev + current).toString();
      break;
    case "-":
      computation = (prev - current).toString();
      break;
    case "X":
      computation = (prev * current).toString();
      break;
    case "/":
      computation = (prev / current).toString();
      break;
  }

  // Error Fix 2
  if (isNaN(parseFloat(computation))) {
    return "Err";
  }

  return computation;
}

// format angka
const FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatOperand(operand: any) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return FORMATTER.format(integer);
}

function App() {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  //manage state kalkulasi
  const [{ currentOperand, previousOperand, operation, results }, dispatch] =
    useReducer(reducer, {
      reducer: [],
      results: [],
      currentOperand: "0"
    });

  return (
    <div className="container">
      <h1>The Calculator</h1>
      <div className="calc-container">
        <div className="calculator-grid">
          <div className="output">
            <div className="result-scroll">
              {/* looping buat display history */}
              {results.map((result: any, index: number) => (
                <div key={index}>{result}</div>
              ))}
            </div>
            <div className="current-operand">
              {operation}
              {formatOperand(currentOperand)}
            </div>
          </div>

          <button
            className="input"
            onClick={() => dispatch({ type: ACTIONS.CLEAR, payload: {} })}
          >
            C
          </button>

          <button
            className="input"
            onClick={() =>
              dispatch({ type: ACTIONS.DELETE_DIGIT, payload: {} })
            }
          >
            DEL
          </button>
          <button onClick={openModal} className="input support">
            {" "}
            ?
          </button>
          <Modal isOpen={modalOpen} onClose={closeModal} />

          <OperationButton operation="/" dispatch={dispatch} />
          <DigitButton digit="1" dispatch={dispatch} />
          <DigitButton digit="2" dispatch={dispatch} />
          <DigitButton digit="3" dispatch={dispatch} />
          <OperationButton operation="X" dispatch={dispatch} />
          <DigitButton digit="4" dispatch={dispatch} />
          <DigitButton digit="5" dispatch={dispatch} />
          <DigitButton digit="6" dispatch={dispatch} />
          <OperationButton operation="-" dispatch={dispatch} />
          <DigitButton digit="7" dispatch={dispatch} />
          <DigitButton digit="8" dispatch={dispatch} />
          <DigitButton digit="9" dispatch={dispatch} />
          <OperationButton operation="+" dispatch={dispatch} />
          <DigitButton digit="0" dispatch={dispatch} className="span-two" />

          <button
            className="span-two operation"
            onClick={() => dispatch({ type: ACTIONS.EVALUATE, payload: {} })}
          >
            =
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
