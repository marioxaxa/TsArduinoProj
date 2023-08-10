import { FileArrowUp } from "@phosphor-icons/react";
import React from "react";
import { AppContext } from "../pages/Simulator";
import { handleFileDrop } from "../scripts/handleFileDrop";

type Props = {};

export default function DropZone({}: Props) {
  const {
    data,
    setData,
    dragMap,
    setDragMap,
    lines,
    setLines,
    connectivityMtx,
    setConnectivityMtx,
    buildingCircuit,
    setBuildingCircuit,
  } = React.useContext(AppContext);

  const drop = React.useRef<HTMLDivElement>(null);

  const [hasDropped, setHasDropped] = React.useState(false);

  const [dragging, setDragging] = React.useState(false);

  //Hook para definir e excluir os eventListener no componentDidMount e componentAnmount
  React.useEffect(() => {
    
    if(!drop.current) return
    drop.current.addEventListener("dragover", handleDragOver);
    drop.current.addEventListener("dragenter", handleDragEnter);
    drop.current.addEventListener("dragleave", handleDragLeave);
    drop.current.addEventListener("drop", handleDrop);

  }, []);

  //Funções para previnir que orquivo seja aberto por outras funções do dispositivo
  function handleDragEnter(e : Event) {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }

  function handleDragLeave(e : Event) {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }

  function handleDragOver(e : Event) {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }

  function handleDrop(e : Event) {
    console.log(e);
    setBuildingCircuit(true);
    console.log(buildingCircuit);

    //Função que lida com os arquivos dropados
    handleFileDrop(
      e,
      data,
      setData,
      dragMap,
      setDragMap,
      lines,
      setLines,
      connectivityMtx,
      setConnectivityMtx
    );

    setDragging(false);
  }

  return (
    <div ref={drop} className="w-full h-40 p-2 group">
      <div className="w-full h-full border-dashed border-2 border-amber-900 rounded-2xl items-center justify-center flex transition ease-in-out delay-100 group-hover:border-amber-600">
        <FileArrowUp
          size={48}
          className="text-amber-900 transition ease-in-out delay-100 group-hover:text-amber-600 group-hover:scale-125"
        />
      </div>
    </div>
  );
}
