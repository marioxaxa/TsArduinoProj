import React from "react";
import DropZone from "./DropZone";
import SvgGrid from "./SvgGrid";
import { AppContext } from "../pages/Simulator";

type Props = {};

export default function SideBar({}: Props) {
  const {
    dragMap,
    lines,
    connectivityMtx,
    data,
  } = React.useContext(AppContext);

  const testFunc = () => {
    console.log(data);
    console.log(dragMap);
    console.log(lines);
    console.log(connectivityMtx);
  };

  return (
    <div
      id="sidebar"
      className="absolute left-0 h-full bg-amber-950 w-64 flex flex-col gap-2"
    >
      <DropZone />
      <SvgGrid />
      <div
        className="h-6 w-12 bg-green-400 rounded-2xl absolute bottom-0 right-0 z-20"
        onClick={testFunc}
      >
        Test
      </div>
    </div>
  );
}
