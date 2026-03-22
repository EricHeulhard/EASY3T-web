// src/pyodide/PyodideProvider.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const PyodideContext = createContext({ pyodide: null, loading: true });

export function PyodideProvider({ children }) {
  const [pyodide, setPyodide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPy() {
      // Si le script Pyodide n'est pas encore chargé
      if (!window.loadPyodide) {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js";
        script.onload = async () => {
          const py = await window.loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/"
          });

          // Charger numpy
          await py.loadPackage("numpy");

          // Définir les fonctions Python
          await py.runPythonAsync(`
import numpy as np
def T(T0, Cp, m, h, S, Te, tmax, dt):
    temps = np.arange(0, tmax+dt, dt)
    temp = Te + (T0-Te)*np.exp(-(h*S/(m*Cp))*temps)
    return temps.tolist(), temp.tolist()

def T_maison(m, Cp, h, S, T_ext_min, T_ext_max, t_simu, N):
    periode = 3600*24
    dt = t_simu/N
    temps = np.linspace(0, t_simu, N)
    T_moy = (T_ext_max+T_ext_min)/2
    A = (T_ext_max-T_ext_min)/2
    temp_ext = T_moy + A*np.sin(2*np.pi*temps/periode)
    temp_maison = np.zeros((N))
    temp_maison[0] = T_moy
    for i,t in enumerate(temps[1:]):
        flux = h*S*(temp_ext[i]-temp_maison[i])
        temp_maison[i+1] = temp_maison[i] + flux*dt/(m*Cp)
    return temps.tolist(), temp_ext.tolist(), temp_maison.tolist()
          `);

          setPyodide(py);
          setLoading(false);
        };
        document.body.appendChild(script);
      } else {
        // Si Pyodide est déjà chargé
        const py = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/"
        });
        await py.loadPackage("numpy");
        setPyodide(py);
        setLoading(false);
      }
    }

    loadPy();
  }, []);

  return (
    <PyodideContext.Provider value={{ pyodide, loading }}>
      {children}
    </PyodideContext.Provider>
  );
}

// Hook pour utiliser Pyodide
export function usePyodide() {
  return useContext(PyodideContext);
}