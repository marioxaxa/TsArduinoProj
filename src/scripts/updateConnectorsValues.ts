import { editorCodeCaller } from "./editorCodeCaller";

export function updateConnectorsValues(valuesHolder: any, editorCode: string) {
  let configHolder = editorCodeCaller(valuesHolder, editorCode).configPins;

  Object.keys(configHolder).map((c) => {
    if (c == "events") {
      /*
            Object.keys(configHolder.events).map((e) => {
                valuesHolder = { ...valuesHolder, events: { ...valuesHolder.events, [e]: [false, configHolder.events[e], undefined] } }
            })
*/
    } else {
      valuesHolder = {
        ...valuesHolder,
        [c]: { value: valuesHolder[c].value, type: configHolder[c] },
      };
    }
  });

  return valuesHolder;
}
