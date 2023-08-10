import { connector_class } from "../@types/connector_class";

export function addConnectortToMatrix(
  componentId: string,
  connectorList: connector_class[],
  connectorMtx: {}
) {
  //TODO: Fazer função para copiar
  let tempConnectorMtx = JSON.parse(JSON.stringify(connectorMtx));

  //JSON.parse(JSON.stringify(originalObj));
  //!TALVEZ O PROBLEMA ESTEJA AQUI ^^^^^^

  // Aqui é criada a matriz de conectividade
  // Os valores iniciais são sempre falsos
  // No caso dela ser nula é passado uma matriz com colunas e linhas do tamanho do primeiro componente adicionado
  if (Object.keys(connectorMtx).length === 0) {
    let row = {};

    connectorList.map((connector) => {
      row = { ...row, [connector.fullId]: null };
    });

    connectorList.map((connector) => {
      tempConnectorMtx = { ...tempConnectorMtx, [connector.fullId]: row };
    });
  } else {
    // Caso ela não seja nula é copiado a parte ja preenchida da matriz e adicionado a suas linhas valores falsos representando os novos connectors

    var row = {};
    Object.keys(tempConnectorMtx).map((k) => {
      for (let index = 0; index < connectorList.length; index++) {
        tempConnectorMtx[k] = {
          ...tempConnectorMtx[k],
          [connectorList[index].fullId]: null,
        };
        row = tempConnectorMtx[k];
      }
    });

    // E depois é adicionado as colunas desses novos connectors a matriz

    for (let index = 0; index < connectorList.length; index++) {
      Object.keys(row).forEach((k) => ((row as any)[k] = null));

      tempConnectorMtx = {
        ...tempConnectorMtx,
        [connectorList[index].fullId]: row,
      };
    }
  }

  return tempConnectorMtx;
}
