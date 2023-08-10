import React from "react";
import { AppContext } from "../pages/Simulator";
import { component_class } from "../@types/component_class";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { connector_class } from "../@types/connector_class";
import { line_class } from "../@types/line_class";
import createLine from "../scripts/createLine";

type Props = {
  dragComponent: component_class;
  updatePositionCallback: Function;
};

export default function DragComponent({
  dragComponent,
  updatePositionCallback,
}: Props) {
  const {
    dragMap,
    setDragMap,
    lines,
    setLines,
    connectivityMtx,
    data,
    setConnectivityMtx,
  } = React.useContext(AppContext);

  if (
    !dragComponent.behavior ||
    !dragComponent.breadboard ||
    !dragComponent.part
  )
    throw "Component missing parts";

  const parser = new DOMParser();
  const connectorsDoc = parser.parseFromString(
    dragComponent.part!,
    "text/html"
  );
  const svgComXML = parser.parseFromString(
    dragComponent.breadboard!,
    "text/html"
  );
  const currentSvg = svgComXML.getElementsByTagName("svg")[0];

  //Função que seleciona os elementos no svg responsaveis pelos conectores e adiciona a classe 'connector' a eles
  function createSvgComponent() {
    for (
      let index = 0;
      connectorsDoc.getElementsByTagName("connector")[index];
      index++
    ) {
      let breadboardView =
        connectorsDoc.getElementsByTagName("breadboardView")[1];
      let p = breadboardView.querySelectorAll("[layer=breadboard]")[index];
      let connectorSvgId = p.getAttribute("svgId");

      //Elemento que é um conector baseado no part
      const svgConnector = currentSvg.getElementById(connectorSvgId!);

      if (!svgConnector) break;

      //Classe adicionada no conector
      svgConnector.setAttribute("class", "connector");
      //Classe adicionada no conector
      svgConnector.setAttribute(
        "id",
        `${name}/${connectorSvgId}/${dragComponent.id}`
      );

      svgConnector.setAttribute("pointer-events", "fill");

      currentSvg.appendChild(svgConnector);
    }

    return currentSvg.innerHTML;
  }

  const [{ x, y, width, height, zIndex }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    width: currentSvg.width.baseVal.value
      ? currentSvg.width.baseVal.value
      : currentSvg.height.baseVal.value,
    height: currentSvg.height.baseVal.value
      ? currentSvg.height.baseVal.value
      : currentSvg.width.baseVal.value,
    zIndex: 1,
  }));

  function DragComponent() {
    const bind = useDrag((params) => {
      // Função de inicialização do componente
      //! Bug: zindex não funciona
      api.start({
        zIndex: params.down ? 5 : 1,
        x: params.offset[0],
        y: params.offset[1],
      });

      //Função que atualiza a posição do componente
      api.set({
        x: params.offset[0],
        y: params.offset[1],
      });

      // Função para excluir o componente se ele for dropado na SideBar
      if (params.down === false) {
        let droppedOver = document.elementsFromPoint(
          params.xy[0],
          params.xy[1]
        );

        let finder = droppedOver.find((element) => {
          return element.className === "SideBar";
        });
        if (finder) {
          removeComponent();
        }
      }

      // Função para criação de linhas ao realizar um clique longo num conector
      if (
        params.tap &&
        params.elapsedTime >= 500 &&
        params.event.target!.className!.baseVal === "connector"
      ) {
        console.log("novanova");

        createLine(
          params.event.target,
          lines,
          setLines,
          dragMap,
          setDragMap,
          connectivityMtx,
          setConnectivityMtx
        );
      }

      //Função para atualizar a posição da linha
      updatePositionCallback(dragComponent.id);
    });
    return (
      <animated.div
        {...bind()}
        style={{ x, y, width, height, zIndex, pointerEvents: "auto" }}
        id={`animatedDiv/${dragComponent.id}`}
        className="animatedSvgDiv"
      >
        <svg
          className="dragSvg"
          dangerouslySetInnerHTML={{ __html: createSvgComponent() }}
          width={currentSvg.width.baseVal.value}
          height={currentSvg.height.baseVal.value}
        />
      </animated.div>
    );
  }

  function removeComponent() {
    //Aqui remove o componente do DragMap
    let filteredMap = dragMap.filter((item: component_class) => {
      return item.id !== dragComponent.id;
    });

    let removedComponent = dragMap.filter((item: component_class) => {
      return item.id == dragComponent.id;
    })[0];

    let toCleanList: string[] = [];
    removedComponent.connectors.forEach((c: connector_class) => {
      if (c.connectedTo.length > 0) {
        c.connectedTo.forEach((toBeRemoved: string) => {
          toCleanList.push(toBeRemoved);
        });
      }
    });

    // Aqui verificamos se algum dos componentes que não foram removidos estava conectado no componente removido e atualizamos seu campo connectedTo para null
    //! NÃO ESTA FUNCIONANDO POR CAUSA DO ATUALIZAÇÕES DO FULLID E CONNECTEDTO[]
    toCleanList.forEach((l) => {
      let splitedL = l.split("/");
      filteredMap.forEach((f: component_class) => {
        if (f.id === splitedL[1]) {
          f.connectors.forEach((c: connector_class) => {
            if (!c.connectedTo) return;
            console.log(c);
            console.log(removedComponent.id);
            c.connectedTo = c.connectedTo.filter((connected: string) => {
              let splitedC = connected.split("/");
              return splitedC !== removedComponent.id;
            });
          });
        }
      });
    });
    setDragMap(filteredMap);

    // Aqui remove o Leader Line
    let toRemoveLines = lines.filter((i: line_class) => {
      return (
        i.startLine.split("/")[1] === dragComponent.id ||
        i.endLine!.split("/")[1] === dragComponent.id
      );
    });

    toRemoveLines.forEach((line: line_class) => {
      line.sections.forEach((section: line_class) => {
        section.leaderLine.remove();
      });
    });

    console.log("checkpoint");

    //E aqui remove a linha do lines
    let filteredLines: line_class[] = lines.filter((i: line_class) => {
      return !(
        i.startLine.split("/")[1] === dragComponent.id ||
        i.endLine!.split("/")[1] === dragComponent.id
      );
    });

    setLines(filteredLines);
  }

  return (
    <div
      className="svgDiv"
      id={dragComponent.id}
      style={{
        position: "fixed",
        left: dragComponent.position[0],
        top: dragComponent.position[1],
        pointerEvents: "none",
      }}
      onDoubleClick={() => {
        removeComponent();
      }}
    >
      {DragComponent()}
    </div>
  );
}
