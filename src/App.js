import "./App.css";
import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Draggable from "react-draggable";

const items = [
  { id: "github", content: "Github", type: "text" },
  { id: "linkedin", content: "LinkedIn", type: "text" },
  { id: "twitter", content: "Twitter", type: "text" },
  { id: "instagram", content: "Instagram", type: "text" },
];

const ItemsContainer = styled.div`
  color: black;
  position: relative;
  background-color: white;
  width: 100%;
  height: 100%;
  border: 4px solid orange;
`;

const ExampleDiv = styled.div`
  position: relative;
  background-color: darkblue;
  color: white;
  padding: 0.5em 1em;
  width: 40%;
  margin: 0.3em;
  cursor: move;
`;

const ExampleImage = styled.img`
  width: 100%;
  height: auto;
`;

function App() {
  const [positions, setPositions] = useState({});
  const [hasLoaded, setHasLoaded] = useState(false);
  const nodeRef = useRef(null);

  useEffect(() => {
    // Load positions from local storage on component mount
    const existingDivPositions = JSON.parse(
      localStorage.getItem("positions_div")
    );
    setPositions(existingDivPositions);
    setHasLoaded(true);
    console.log(existingDivPositions);
    console.log("has loaded");

    // Cleanup function: Clear local storage on component unmount
    return () => {
      localStorage.removeItem("positions_div");
      console.log("Local storage cleared");
    };
  }, []);

  function handleStop(e, data) {
    let dummyPositions = { ...positions };
    const itemId = e.target.id;
    dummyPositions[itemId] = {};
    dummyPositions[itemId]["x"] = data.x;
    dummyPositions[itemId]["y"] = data.y;
    setPositions(dummyPositions);
  }

  useEffect(() => {
    localStorage.setItem(`positions_div`, JSON.stringify(positions));
  }, [positions]);

  const handleSave = () => {
    // Save elements to local storage
    localStorage.setItem(`positions_div`, JSON.stringify(positions));
    console.log("Saving to local storage:", positions);
  };

  return hasLoaded ? (
    <ItemsContainer>
      {items.map((item) => (
        <Draggable
          defaultPosition={
            positions === null
              ? { x: 0, y: 0 }
              : !positions[item.id]
              ? { x: 0, y: 0 }
              : { x: positions[item.id].x, y: positions[item.id].y }
          }
          position={null}
          key={item.id}
          nodeRef={nodeRef}
          onStop={handleStop}
        >
          <div ref={nodeRef}>
            {item.type === "text" ? (
              <ExampleDiv id={item.id}>{item.content}</ExampleDiv>
            ) : (
              <ExampleImage id={item.id} src={item.content} alt={item.id} />
            )}
          </div>
        </Draggable>
      ))}
      <button onClick={handleSave}>Save</button>
    </ItemsContainer>
  ) : null;
}

export default App;
