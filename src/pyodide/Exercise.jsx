import { useState } from "react";
import CodeEditor from "./CodeEditor";
import { getPyodide } from "../pyodide/loadPyodide";

export default function Exercise() {
  const [code, setCode] = useState(`
def flux(lambda_, gradT):
    # TODO: compléter
    return 0
`);

  const [result, setResult] = useState("");

  const test = async () => {
    const pyodide = await getPyodide();

    try {
      pyodide.runPython(code);

      let testCode = `
result = flux(2, 3)
result
`;
      let res = pyodide.runPython(testCode);

      if (res === -6) {
        setResult("✅ Correct !");
      } else {
        setResult("❌ Incorrect");
      }
    } catch (e) {
      setResult(e.toString());
    }
  };

  return (
    <div>
      <h3>Exercice : Loi de Fourier</h3>
      <CodeEditor code={code} setCode={setCode} />
      <button onClick={test}>Tester</button>
      <p>{result}</p>
    </div>
  );
}