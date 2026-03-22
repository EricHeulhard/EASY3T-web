import { loadPyodide } from "pyodide";

let pyodide = null;

export async function getPyodide() {
  if (!pyodide) {
    pyodide = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/"
    });
    await pyodide.loadPackage(["numpy", "matplotlib"]);
  }
  return pyodide;
}