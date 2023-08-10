import { connector_class } from "../@types/connector_class";
import { editorCodeCaller } from "./editorCodeCaller";

export function createConnectors(
  partComponent: string,
  breadboard: string,
  id: string,
  dragComponentName: string,
  behavior: string
) {
  const parser = new DOMParser();
  const partComponentText = parser.parseFromString(partComponent, "text/html");
  const svgComXML = parser.parseFromString(breadboard, "text/html");
  const svgPuro = svgComXML.getElementsByTagName("svg")[0];
  var connectorList = [];

  let behaviorFunctions = editorCodeCaller(undefined, behavior);
  let configOutput = behaviorFunctions.configPins;

  for (
    let index = 0;
    partComponentText.getElementsByTagName("connector")[index];
    index++
  ) {
    let connector = partComponentText.getElementsByTagName("connector")[index];

    let breadboardView =
      partComponentText.getElementsByTagName("breadboardView")[1];
    let p = breadboardView.querySelectorAll("[layer=breadboard]")[index];
    let connectorSvgId = p.getAttribute("svgId");

    if (!connectorSvgId) {
      break;
    }

    //Elemento que é um conector baseado no part
    const svgConnector = svgPuro.getElementById(connectorSvgId);

    if (!svgConnector) {
      break;
    }

    //! Não sei se o String foi uma boa solução
    let connectorConfig = configOutput[String(p.getAttribute("svgId"))];

    let connectorClass = new connector_class(
      String(connector.getAttribute("id")),
      String(connector.getAttribute("name")),
      String(p.getAttribute("svgId")),
      String(connector.getAttribute("type")),
      -1,
      [],
      connectorConfig,
      `${dragComponentName}/${connectorSvgId}/${id}`
    );

    connectorList.push(connectorClass);
  }

  return {
    svg: svgPuro,
    connectorList: connectorList,
  };
}
