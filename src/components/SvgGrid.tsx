import React from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { AppContext } from "../pages/Simulator";
import { data_class } from "../@types/data_class";
import SvgGridItem from "./SvgGridItem";

type Props = {};

export default function SvgGrid({}: Props) {
  const parser = new DOMParser();

  const { data, alignment } = React.useContext(AppContext);

  return (
    <div className=" bg-white flex items-center justify-start flex-col">
      
            {data.map((dataComponent: data_class) => (
              <SvgGridItem key={dataComponent.componentName} dataComponent={dataComponent} />
            ))}
    </div>
  );
}
