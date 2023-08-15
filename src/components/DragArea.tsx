import React from "react";
import { AppContext } from "../pages/Simulator";
import { line_class } from "../@types/line_class";
import { component_class } from "../@types/component_class";
import makeLeaderLine from "../scripts/makeLeaderLine";
import DragComponent from "./DragComponent";
import InvisibleDiv from "./InvisibleDiv";

type Props = {};

export default function DragArea({}: Props) {
  const { dragMap, lines } = React.useContext(AppContext);

  //Função para atualizar a linha quando o componente recebe um drag
  function updateComponentPosition(componentId: string) {
    //const elementId = targetId.split('/')[1]
    let filteredSections: line_class[] = [];
    //Aqui é pego todas as linhas que estão ligadas ao componente que esta se movendo.
    lines.forEach((line: line_class) => {
      if (
        line.startLine.split("/")[2] === componentId ||
        line.endLine!.split("/")[2] === componentId
      ) {
        line.sections.forEach((section) => {
          filteredSections.push(section);
        });
      }
    });

    //Aqui é chamada a função que atualiza a LeaderLine
    filteredSections.forEach((section: line_class) => {
      if (!section.leaderLine) return;
      section.leaderLine.position();
    });
  }

  React.useEffect(() => {
    console.log(lines.lenght);
    if (lines.length) {
      console.log(lines);
      makeLeaderLine(lines, false, true);
    }
  }, [lines]);

  //Função para atualizar a linha quando o componente recebe um drag
  function updateLinePosition(lines : line_class[]) {
    //const elementId = targetId.split('/')[1]
    let filteredSections : line_class[] = []
    //Aqui é pego todas as linhas que estão ligadas ao componente que esta se movendo.
    lines.forEach(line => {
        if (line.status === 'Em aberto') {
            line.sections.forEach(section => {
                filteredSections.push(section)
            })
        }
    })

    //console.log(filteredSections)

    //Aqui é chamada a função que atualiza a LeaderLine
    filteredSections.forEach(section => {
        if (!section.leaderLine) return
        section.leaderLine.position()
    })
}

  return (
    <div className="DragAreaDiv">
      {dragMap.map((dragComponent: component_class) => {
        return (
          <DragComponent
            dragComponent={dragComponent}
            updatePositionCallback={updateComponentPosition}
            key={dragComponent.id}
          />
        );
      })}
      {lines.map((line: line_class) => {
        line.sections.map((section: line_class) => {
            return (
                <InvisibleDiv section={section} key={line.id} line={line} updatePositionCallback={updateLinePosition} />
              );
        })
        
      })}
    </div>
  );
}
