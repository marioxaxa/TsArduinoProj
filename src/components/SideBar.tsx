import React from "react";
import DropZone from "./DropZone";
import SvgGrid from "./SvgGrid";

type Props = {};

export default function SideBar({}: Props) {
  return (
    <div
      id="sidebar"
      className="absolute left-0 h-full bg-amber-950 w-64 flex flex-col gap-2"
    >
      <DropZone />
      <SvgGrid />
    </div>
  );
}
