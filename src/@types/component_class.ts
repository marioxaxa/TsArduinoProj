//import { editorCodeCaller } from "../helpers/functionHelpers"
import { editorCodeCaller } from "../scripts/editorCodeCaller";
import { connector_class } from "./connector_class";
import { data_class } from "./data_class";

export class component_class extends data_class {
  connectors: connector_class[];
  id: string;
  position: any[];
  config: {};

  constructor(
    name: string,
    behavior: string,
    breadboard: string,
    part: string,
    connectors: connector_class[],
    id: string,
    position: any[]
  ) {
    super(name, behavior, breadboard, part);
    this.connectors = connectors;
    this.id = id;
    this.position = position;

    let behaviorFunctions = editorCodeCaller(undefined, behavior);
    this.config = behaviorFunctions.configPins;
  }

  doBehavior(input : {}) {
    //eletronicMtx

    if (!this.behavior ) {
      return 'Behavior not defined'
    }
    let behaviorFunctions = editorCodeCaller(input, this.behavior);

    if(!behaviorFunctions.main) {
      return 'Error in behavior';
    }
    let mainFunc = new Function("input", behaviorFunctions.main);

    let output = mainFunc(input);

    return output;
  }
}
