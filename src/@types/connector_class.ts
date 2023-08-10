export class connector_class  {
  id: string;
  name: string;
  svgId: string;
  type: string;
  value: number;
  connectedTo: string[];
  connectorConfig: {};
  fullId: string;

  constructor(
    id: string,
    name: string,
    svgId: string,
    type: string,
    value: number = 0,
    connectedTo: string[],
    connectorConfig: {},
    fullId: string
  ) {
    this.id = id;
    this.name = name;
    this.svgId = svgId;
    this.type = type;
    this.value = value;
    this.connectedTo = connectedTo;
    this.connectorConfig = connectorConfig;
    this.fullId = fullId;
  }
}
