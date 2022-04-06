import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

function App() {
  const canvasElement = useRef();

  const [elements, _] = useState([
    { alphabet: "A", value: 1 },
    { alphabet: "B", value: 2 },
    { alphabet: "C", value: 3 },
    { alphabet: "D", value: 4 },
    { alphabet: "E", value: 5 },
  ]);

  const [arithmeticOperators] = useState(["+", "-", "*", "/"]);
  const [comparisionOperators] = useState(["<", ">"]);
  const [currentComparator, setCurrentComparator] = useState("");

  const [rightHandSideInteger, setRightHandSideInteger] = useState("");
  const [finalEquation, setFinalEquation] = useState([]);

  const [dragElement, setDragElement] = useState("");

  const [mouseCoordinates, setMouseCoordinates] = useState({
    x: 0,
    y: 0,
  });

  const offset = {
    x: 50,
    y: 50,
  };

  // useEffect(() => {
  //   axios
  //     .get("https://equation-calc.herokuapp.com/getAlphabets/")
  //     .then((response) => setOperandsArr(response.data))
  //     .catch((err) => console.log(err));
  //   //for testing
  //   //setOperandsArr([{alphabet: "A", value:"1"},{alphabet: "B", value:"2"},{alphabet:"C", value:"3"}])
  // }, []);

  function drag(e) {
    setDragElement(
      <div
        className={e.target.className}
        data-value={e.target.getAttribute("data-value")}
      >
        {e.target.innerHTML}
      </div>
    );
    setMouseCoordinates({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  }

  function calculate(arr, comparator, rightHandSideInteger) {
    let final = "";
    arr.forEach((elem) => (final += elem.value + " "));
    final = final + comparator + " " + rightHandSideInteger;
    try {
      alert(eval(final));
    } catch (err) {
      alert("This is not a valid equation");
    }
  }

  function removeElement(e) {
    let value = e.target.getAttribute("data-value");
    setFinalEquation(
      finalEquation
        .filter((elem, index) => {
          return index !== value;
        })
        .map((elem, index) => {
          elem.position = index * 100 + 16;
          return elem;
        })
    );
  }

  function mouseMovement(e) {
    setMouseCoordinates({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  }

  function mouseUp(e) {
    if (dragElement !== "") {
      let value = e.target.getAttribute("data-value");
      let type = e.target.className;
      let alphabet = e.target.innerHTML;
      let canvasElementTop = canvasElement.current.offsetTop;
      let canvasElementHeight = canvasElement.current.clientHeight;
      let isInCanvasElement =
        e.clientY + window.scrollY > canvasElementTop &&
        e.clientY + window.scrollY < canvasElementTop + canvasElementHeight;

      setDragElement("");
      if (isInCanvasElement) {
        const boundRect = e.target.getBoundingClientRect();
        const position = boundRect.left + canvasElement.current.scrollLeft;
        setFinalEquation(
          [
            ...finalEquation,
            {
              value: value,
              type: type,
              alphabet: alphabet,
              position: position,
            },
          ]
            .sort((a, b) => {
              return a.position - b.position;
            })
            .map((elem, index) => {
              elem.position = index * 100 + 16;
              return elem;
            })
        );
      }
    }
  }

  function renderComponent(component) {
    return component;
  }

  return (
    <div className="h-screen flex items-center justify-center w-full">
      <div
        className="w-3/4 mx-auto"
        onMouseMove={(e) => mouseMovement(e)}
        onMouseUp={(e) => mouseUp(e)}
      >
        <div
          className={`fixed opacity-50 z-10 left-[]`}
          style={{
            position: "fixed",
            opacity: 0.6,
            zIndex: 3,
            left: mouseCoordinates.x,
            top: mouseCoordinates.y,
          }}
        >
          {dragElement}
        </div>

        <div className="flex justify-start items-center mb-6">
          {elements.map((element) => (
            <div
              className="w-[100px] h-[100px] mx-4 flex text-xl justify-center items-center cursor-pointer bg-lime-200"
              draggable="true"
              onDragStart={(e) => drag(e)}
              data-value={element.value}
            >
              {element.alphabet}
            </div>
          ))}
        </div>

        <div className="flex justify-start items-center mb-6">
          {arithmeticOperators.map((arithmeticOperator) => (
            <div
              className="w-[100px] h-[100px] border mx-4 flex text-xl justify-center items-center cursor-pointer bg-green-200"
              draggable="true"
              onDragStart={(e) => drag(e)}
              data-value={arithmeticOperator}
            >
              {arithmeticOperator}
            </div>
          ))}

          {comparisionOperators.map((comparisionOperator) => (
            <div
              className="w-[100px] h-[100px] border mx-4 flex text-xl justify-center items-center bg-green-200"
              data-value={currentComparator}
              onClick={(e) =>
                setCurrentComparator(e.target.getAttribute("data-value"))
              }
            >
              {comparisionOperator}
            </div>
          ))}

          <div
            className="w-[100px] h-[100px] border mx-4 flex text-xl text-center justify-center items-center cursor-pointer bg-green-200"
            onClick={() => {
              let rightHandSideInput = prompt(
                "What should be the rhs integer?",
                ""
              );
              rightHandSideInput.trim() !== ""
                ? setRightHandSideInteger(rightHandSideInteger)
                : setRightHandSideInteger("");
            }}
          >
            RHS Integer
          </div>
        </div>
        <br />
        <div
          className="w-full h-[200px] border flex items-center mx-4 border-dashed border-blue-500"
          ref={canvasElement}
        >
          {finalEquation.map((elem, index) => (
            <div className="relative flex items-center justify-center w-[100px] h-[100px] border mx-4">
              <span
                className="flex h-4 w-4 items-center justify-center absolute top-2 right-2 cursor-pointer z-10 text-red-600"
                onClick={(e) => removeElement(e)}
                data-value={index}
              >
                x
              </span>
              <span className="absolute cursor-pointer z-0">
                {elem.alphabet}
              </span>
            </div>
          ))}

          {currentComparator && (
            <div className="relative flex items-center justify-center w-[100px] h-[100px] border mx-4">
              <span
                className="flex h-4 w-4 items-center justify-center absolute top-2 right-2 cursor-pointer z-10 text-red-600"
                onClick={() => setCurrentComparator("")}
              >
                x
              </span>
              {currentComparator}
            </div>
          )}

          {rightHandSideInteger && (
            <div>
              <span
                className="flex h-4 w-4 items-center justify-center absolute top-2 right-2 cursor-pointer z-10 text-red-600"
                onClick={() => setRightHandSideInteger("")}
              >
                x
              </span>
              {rightHandSideInteger}
            </div>
          )}
        </div>
        <button
          className="w-full mt-4 py-2 bg-blue-500 text-white font-semibold text-xl mx-4"
          onClick={() =>
            calculate(finalEquation, currentComparator, rightHandSideInteger)
          }
        >
          Evaluate
        </button>
      </div>
    </div>
  );
}

export default App;
