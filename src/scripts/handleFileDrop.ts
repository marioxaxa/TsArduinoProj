import JSZip from "jszip";
import { data_class } from "../@types/data_class";
import React from "react";
import { component_class } from "../@types/component_class";
import { line_class } from "../@types/line_class";
//Função responsavel por extrair arquivos do zip e adicionalos no data
export function unzipFile(
  file: File,
  data: data_class[],
  setData: React.Dispatch<React.SetStateAction<data_class[]>>,
  dragMap: component_class[],
  setDragMap: React.Dispatch<React.SetStateAction<component_class[]>>,
  lines: line_class[],
  setLines: React.Dispatch<React.SetStateAction<line_class[]>>,
  connectivityMtx: {},
  setConnectivityMtx: React.Dispatch<React.SetStateAction<{}>>
) {
  return new Promise((resolve, reject) => {
    var jsZip = new JSZip();

    //Variavel temporaria para onde é passada os arquivos
    //se você apenas referenciar o data, ele não vai mudar a referencia, logo não vai atualizar
    //o estado. O ruim é perdere memória =), para não fazer assim a gente teria que implementar
    //algum outro estado que sinalizasse ou forçasse o update

    let tempData = [...data];
    let tempDragMap: component_class[] = [];
    let tempLines: line_class[] = [];
    let tempConnectivityMtx: any[] = [];

    //Aqui o arquivo é lido como um buffer
    const bufferReader = new FileReader();

    bufferReader.onload = () => {
      //Depois é extraído do .zip
      jsZip.loadAsync(bufferReader.result).then(function (zip: JSZip) {
        Object.keys(zip.files).forEach(function (filename) {
          zip.files[filename]
            .async("string")
            .then(function (fileData) {
              if (filename.split("/")[0] === "data") {
                /* 
                            ! O formato do nome do arquivo deverá ser tipoDeComponente.nome.formatoDoArquivo
                            ! Ex: breadboard.arduinoUnoV3.svg
                            ! Os arquvios fzb serão excessão devendo ser da seguinte forma:
                            ! nome.fzb
                            */

                //E adicionado a variavel temporaria formando um objeto composto pelo nome do arquivo e seu conteudo em texto

                let cortado = filename.split(".");

                let componentName: string;
                let contentType: string;

                //Condicional para dividir os arquivos entre Svgs, fzb e fzp
                if (!cortado[1]) {
                  //A primeira leitura será sempre um arquivo vazio com o nome da pasta
                  return 0;
                } else if (
                  cortado[2] === "svg" ||
                  cortado[2] === "fzp" ||
                  cortado[2] === "js"
                ) {
                  //componentName = cortado[2].slice(0,-(cortado[1].length))
                  //componentName = componentName.substring(0,20)
                  componentName = cortado[1].substring(0, 20);

                  var directoryName = cortado[0].split("/");

                  //? O filename pode possuir ou não o nome da pasta onde ele esta inserido por isso esse teste. Não sei ao certo o que define isso.
                  if (directoryName[1]) {
                    contentType = directoryName[1];
                  } else {
                    contentType = directoryName[0];
                  }
                } else {
                  componentName = `${cortado[0]}_fzbList`;
                  contentType = cortado[1];
                }

                //Condional para testar se ja existe um objeto que condiz ao componente atual
                if (contentType === "fzb") {
                  /* Nesse caso ja existe um objeto guardando os fzbs
                                let index = tempData.findIndex(e => e.componentName === `${cortado[0]}_fzbList`)
                                tempData[index][contentType] = fileData
                                */
                } else if (
                  tempData.some((e) => e.componentName === componentName)
                ) {
                  //Nesse caso ja existe um objeto guardando o componente atual então apenas adicionamos um novo svg nele

                  let index = tempData.findIndex(
                    (e) => e.componentName === componentName
                  );
                  (tempData as any)[index][contentType] = fileData;
                } else {
                  //Nesse caso ainda não existe um objeto que corresponda ao componente atual então é criado um
                  //Objeto temporario para guardar as variaveis de nome e o arquivo html convertido em texto
                  let tempObj = new data_class(componentName);
                  (tempObj as any)[contentType] = fileData;

                  tempData.push(tempObj);
                }
              } else if (filename.split("/")[0] === "dragMap") {
                tempDragMap.push(JSON.parse(fileData));
              } else if (filename.split("/")[0] === "lines") {
                tempLines.push(JSON.parse(fileData));
              } else if (filename.split("/")[0] === "connectivityMtx") {
                tempConnectivityMtx.push(JSON.parse(fileData));
              }
            })
            .then(() => {
              console.log(tempData);
              //Aqui transferimos para a variavel global
              setData([...tempData]);
              setDragMap([...tempDragMap]);
              setLines([...tempLines]);
              setConnectivityMtx(tempConnectivityMtx);
            });
        });
      });
    };

    bufferReader.readAsArrayBuffer(file);
  });
}

//Função que lida com os arquivos dropados
export async function handleFileDrop(
  e: any, //! Descobrir esse tipo
  data: data_class[],
  setData: React.Dispatch<React.SetStateAction<data_class[]>>,
  dragMap: component_class[],
  setDragMap: React.Dispatch<React.SetStateAction<component_class[]>>,
  lines: line_class[],
  setLines: React.Dispatch<React.SetStateAction<line_class[]>>,
  connectivityMtx: {},
  setConnectivityMtx: React.Dispatch<React.SetStateAction<{}>>
) {
  e.preventDefault();
  e.stopPropagation();

  //Arquivos dropados antes de serem lidos
  const droppedFiles = e.dataTransfer.files;

  //Para cada arquivo(i) dropado será realizado essa função onde nela os arquivos serão lidos e salvos na variavel files
  for (let i in droppedFiles) {
    let item = droppedFiles[i];
    if (typeof item === "object") {
      //Função que extrai e adiciona os arquivos a variavel data
      await unzipFile(
        item,
        data,
        setData,
        dragMap,
        setDragMap,
        lines,
        setLines,
        connectivityMtx,
        setConnectivityMtx
      );
    }
  }
}
