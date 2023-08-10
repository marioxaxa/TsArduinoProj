import React from "react";
import { AppContext } from "../pages/Simulator";
import { createConnectors } from "../scripts/createConnectors";
import { component_class } from "../@types/component_class";
import { data_class } from "../@types/data_class";
import { v4 as uuidv4 } from "uuid";
import { addConnectortToMatrix } from "../scripts/addConnectorToMatrix";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { createPortal } from "react-dom";

type Props = {
  dataComponent: data_class;
};

export default function SvgGridItem({ dataComponent }: Props) {
  const {
    setDragMap,
    dragMap,
    connectivityMtx,
    setConnectivityMtx,
    eletronicMtx,
    setEletronicMtx,
  } = React.useContext(AppContext);

  if (
    !dataComponent.part ||
    !dataComponent.breadboard ||
    !dataComponent.behavior
  )
    throw "Missing data file";

  function dragMapHandler(xy: number[]) {
    // Aqui é criado um novo componente como objeto
    let tempMap = [...dragMap];
    let id = uuidv4();
    let connectors = createConnectors(
      dataComponent.part!,
      dataComponent.breadboard!,
      id,
      dataComponent.componentName,
      dataComponent.behavior!
    ).connectorList;
    let componentToPush = new component_class(
      dataComponent.componentName,
      dataComponent.behavior!,
      dataComponent.breadboard!,
      dataComponent.part!,
      connectors,
      id,
      xy
    );
    tempMap.push(componentToPush);

    // É chamada a função helper para a atualização da matriz de conectividade e do seu maping
    let matrixParams = addConnectortToMatrix(id, connectors, connectivityMtx);

    //Atualização dos states do contexto
    setConnectivityMtx(matrixParams);
    setDragMap(tempMap);
    console.log(tempMap)
  }

  const [{ x, y, scale, zIndex, height }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    zIndex: 5,
    height: "10%",
  }));

  const bind = useDrag((params) => {
    api.start({
      x: params.down ? params.movement[0] : 0,
      y: params.down ? params.movement[1] : 0,
      scale: params.down ? 1.2 : 1,
      zIndex: params.down ? 10 : 5,
    });

    if (params.down === false) {
      dragMapHandler(params.xy);
    }
  });

  const parser = new DOMParser();
  const doc = parser.parseFromString(dataComponent.breadboard!, "text/html");
  const svg = doc.getElementsByTagName("svg")[0];

  const svgViewBox = `${svg.viewBox.baseVal.x} ${svg.viewBox.baseVal.y} ${svg.viewBox.baseVal.width} ${svg.viewBox.baseVal.height}`;

  return (
    <>
      {createPortal(
        <div className="w-full h-48 px-2">
          <div className="w-full h-full bg-amber-900 flex justify-center items-center border-dotted border-amber-950 border-2 rounded-xl p-2">
            <animated.div
              {...bind()}
              style={{ x, y, scale, zIndex, pointerEvents: "auto" }}
              className="w-full h-full"
            >
                <svg
                  className="w-full h-full"
                  viewBox={svgViewBox.toString()}
                  preserveAspectRatio="xMidYMid meet"
                  dangerouslySetInnerHTML={{ __html: svg.innerHTML }}
                />
            </animated.div>
          </div>
        </div>,
        document.getElementById("sidebar")!
      )}
    </>
  );
}
