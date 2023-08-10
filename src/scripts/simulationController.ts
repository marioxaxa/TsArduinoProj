import { component_class } from "../@types/component_class";
import { data_class } from "../@types/data_class";
import { line_class } from "../@types/line_class";

export function newSimulationController(
  connectivityMtx: {},
  dragMap: component_class[],
  data: data_class[],
  lines: line_class[],
  eletronicStateList: any[],
  circuitChanged: boolean,
  setCircuitChanged: React.Dispatch<React.SetStateAction<boolean>>
) {
  console.log("simulacao comecoua ");

  var eletronicMtxHOLDER = JSON.parse(JSON.stringify(connectivityMtx));
  Object.keys(connectivityMtx).forEach((outConnectorLoop) => {
    Object.keys(connectivityMtx).forEach((inConnectorLoop) => {
      eletronicMtxHOLDER[outConnectorLoop][inConnectorLoop] = null;
    });
  });

  // Aqui filtramos os componentes e fazemos um Set com apenas aqueles que estão em conexão com um outro componente
  const toBeLookedComponentsSet = new Set();
  lines.forEach((line) => {
    let id;
    id = line.startLine.split("/")[2];
    toBeLookedComponentsSet.add(id);
    id = line.endLine.split("/")[2];
    toBeLookedComponentsSet.add(id);
  });

  // Baseado na filtragem acima conseguimos um dragMap filtrado
  let allSimulatedComponents : component_class[];
  allSimulatedComponents = dragMap.filter((component) => {
    return toBeLookedComponentsSet.has(component.id);
  });

  var toBeSimulatedComponents : component_class[] = [];
  var simulatedComponents : component_class[] = [];

  // Aqui definimos o primeiro elemento a ser simulado e adicionamos no segundo Set
  allSimulatedComponents.forEach((component) => {
    if(!component.config.type) throw ('Missing type in component config')
    if (component.config.type === "power_source") {
      toBeSimulatedComponents.push(component);
    }
  });

  // Aqui simulamos o primeiro elemento vulgo elemento de alimentação
  let input = {};

  //TODO Fazer ele ir tirando os componentes que já foram simulados e parar em algum momento e continuar quando tiver mudanças

  while (toBeSimulatedComponents.length > 0) {
    toBeSimulatedComponents.forEach((component) => {
      // Aqui iteramos pela eletronicMtxHolder para achar qualquer valor de entrada não nulo para o componente atual e guardamos no input
      component.connectors.forEach((connectorPin) => {
        Object.keys(eletronicMtxHOLDER).forEach((inComponent) => {
          console.log(inComponent);
          console.log(connectorPin);
          if (eletronicMtxHOLDER[inComponent][connectorPin.fullId] !== null) {
            //! Ver o caso de multiplos inputs
            (input as any)[connectorPin.svgId] =
              eletronicMtxHOLDER[inComponent][connectorPin.fullId];
          }
        });
      });

      (input as any).id = component.id;

      console.log(input);

      // Então pegamos o output pelo behavior do componente
      let output = component.doBehavior(input);

      // Depois disso iteramos por cada pino do componente
      if(!component.config.pins) throw ('Missing pins in component config')
      Object.keys(component.config.pins).forEach((connectorPin) => {
        // Seguindo apenas com aqueles que são de saida
        //! Ver caso de in-out
        if (!component.config.pins[connectorPin] === "out") return; //??????????????????????

        // Aqui atualizamos o valor do eletronicMtx para todos que estão conectados com o devido pino
        component.connectors.forEach((connector) => {
          if (connector.svgId === connectorPin) {
            connector.connectedTo.forEach((connectedTo) => {
              eletronicMtxHOLDER[connector.fullId][connectedTo] =
                output[connectorPin];

              // Aqui adicionamos o componente connectado ao pino atual e o adicionamos na fila.
              let toAddComponent = allSimulatedComponents.find((component) => {
                console.log(component.id);
                console.log(connectedTo.split("/")[2]);
                return component.id === connectedTo.split("/")[2];
              });
              if(!toAddComponent) return
              if (
                toBeSimulatedComponents.some(
                  (component) => component === toAddComponent
                )
              )
                return;
              if (
                simulatedComponents.some(
                  (component) => component === toAddComponent
                )
              )
                return;
              toBeSimulatedComponents.push(toAddComponent);
            });
          }
        });
      });

      simulatedComponents.push(component);
      toBeSimulatedComponents.shift();

      console.log(toBeSimulatedComponents);
      console.log(simulatedComponents);
      console.log(eletronicMtxHOLDER);
    });
  }
}

function resetComponents(allSimulatedComponents : component_class[], simulatedComponents : component_class[]) {
  let notSimulatedComponents : component_class[] = [];
  allSimulatedComponents.forEach((component : component_class) => {
    if (!simulatedComponents.some((component : component_class) => component === component))
      notSimulatedComponents.push(component);
  });

  notSimulatedComponents.forEach((component) => {
    let input = {};

    (input as any).id = component.id;

    component.connectors.forEach((connector) => {
      (input as any)[connector.svgId] = null;
    });

    component.doBehavior(input);
  });
}
