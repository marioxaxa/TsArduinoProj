export function editorCodeCaller(
  input: {} | undefined = undefined,
  editorCode: string
) {
  let splitedCode = editorCode.split("main(input){");

  let mainCode = splitedCode[1].slice(0, -1);

  let configCode = splitedCode[0].slice(13, -6);

  let configPins = new Function(configCode);

  if (!input) {
    let configHolder = configPins();
    return { main: undefined, configPins: configHolder };
  }

  let mainFunc = new Function("input", mainCode);

  let mainCodeF = mainFunc(input);
  let configHolder = configPins();

  return { main: mainCode, configPins: configCode };
}
