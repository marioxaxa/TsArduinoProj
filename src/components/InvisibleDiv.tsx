import React, { useState } from "react";
import { AppContext } from "../pages/Simulator";
import { line_class } from "../@types/line_class";
import useMousePosition from "../hooks/linePositionHook";
import makeLeaderLine from "../scripts/makeLeaderLine";
import createLine from "../scripts/createLine";

type Props = {
  line: line_class;
  section: line_class;
  updatePositionCallback: Function;
};

export default function InvisibleDiv({
  line,
  section,
  updatePositionCallback,
}: Props) {
  const {
    dragMap,
    setDragMap,
    lines,
    setLines,
    connectivityMtx,
    setConnectivityMtx,
  } = React.useContext(AppContext);

  const [isStoped, setIsStoped] = useState(false);
  const [finalLocation, setFinalLocation] = useState({ x: 0, y: 0 });
  let tempPosition = useMousePosition();

  updatePositionCallback(lines);

  React.useEffect(() => {
    makeLeaderLine(lines, true);
  }, []);

  var mousePosition = { x: 0, y: 0 };

  if (!isStoped) {
    (mousePosition as any) = tempPosition;
  }

  function handleClick() {
    setIsStoped(true);
    setFinalLocation(mousePosition);

    let clickedOver = document.elementsFromPoint(
      mousePosition.x,
      mousePosition.y
    );

    let connectorCliked = clickedOver.find((element) => {
      return element.classList.contains("connector");
    });
    console.log("clccick");
    if (connectorCliked) {
      createLine(
        (connectorCliked as HTMLElement),
        dragMap,
        setDragMap,
        lines,
        setLines,
        connectivityMtx,
        setConnectivityMtx
      );
    } else {
      createLine(
        document.getElementById(section.id)!,
        dragMap,
        setDragMap,
        lines,
        setLines,
        connectivityMtx,
        setConnectivityMtx,
        true
      )
    }
  }

  function cancelLines(event : any) {
    event.preventDefault();
    event.stopPropagation();

    console.log("clcickl");
    line.sections.forEach((section) => {
      section.leaderLine.remove();
    });

    let filteredLines = lines.filter((listLine : line_class) => {
      return !(listLine.id === line.id || listLine.id === line.id);
    });

    setLines(filteredLines);
  }

  return (
    <div
      className="invisibleDiv"
      id={`section/${section.id}`}
      style={{
        display: "block",
        position: "fixed",
        width: "5px",
        height: "5px",
        top: isStoped ? finalLocation.y : mousePosition.y,
        left: isStoped ? finalLocation.x : mousePosition.x,
        zIndex: -5,
      }}
      
      stoped={isStoped.toString()}
      onClick={handleClick}
      onContextMenu={(e) => {
        cancelLines(e);
      }}
    />
  );
}
