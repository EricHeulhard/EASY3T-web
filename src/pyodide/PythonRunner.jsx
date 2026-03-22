import { useState } from "react";
import { getPyodide } from "../pyodide/loadPyodide";

export default function PythonRunner({ code }) {
  const [output, setOutput] = useState("");

  const runCode = async () => {
    const pyodide = await getPyodide();

    try {
      let result = pyodide.runPython(code);
      setOutput(result?.toString() || "Exécuté");
    } catch (err) {
      setOutput(err.toString());
    }
  };

  return (
    <div>
      <button onClick={runCode}>Exécuter</button>
      <pre>{output}</pre>
    </div>
  );
}