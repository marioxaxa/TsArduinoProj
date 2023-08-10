//import { editorCodeCaller } from "../helpers/functionHelpers";

export class data_class {
  componentName: string;
  breadboard?: string;
  part?: string;
  behavior?: string;
  config?: any; //?????????????????????

  constructor(
    componentName: string,
    behavior?: string,
    breadboard?: string,
    part?: string
  ) {
    this.componentName = componentName;
    this.behavior = behavior;
    this.breadboard = breadboard;
    this.part = part;
    /*
        let behaviorFunctions = editorCodeCaller(undefined, behavior)
        this.config = behaviorFunctions.configPins
        */
  }
}
