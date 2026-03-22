// src/pages/transferts/EnergieTemperature.jsx
import { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import MarkdownTex from "../../components/MarkdownTex";
import { usePyodide } from "../../pyodide/PyodideProvider";
import "../../styles/form.css";
import "../../styles/graph.css";

export default function EnergieTemperature() {
  const { pyodide, loading } = usePyodide();
  const pyReady = pyodide && !loading && pyodide.globals.has("T") && pyodide.globals.has("T_maison");
  const [form, setForm] = useState({
    T0: 100,
    Cp: 900,
    m: 2,
    h: 10,
    S: 0.1,
    Te: 25,
    tmax: 600,
    dt: 1
  });
  const [form2, setForm2] = useState({
    Tmin: 10,
    Tmax: 30,
    Cp2: 800,
    m2: 10000,
    h2: 10,
    S2: 120,
    tmax2: 86400,
    N: 300
  });
  const [graphData, setGraphData] = useState(null);
  const [graphData2, setGraphData2] = useState(null);   // masse
  const [graphData3, setGraphData3] = useState(null); // extérieur

  const markdownLienTemperatureEnergie = `
  Sans changement d'état de la matière, le lien entre la température et l'énergie par le biais
  d'une quantité appelée chaleur massique ou capacité thermique ou capacité calorifique.

  Concretement, un apport ou un prélevement d'énergie $Q$ sur un corps de masse $m$ et de capacité 
  calorifique massique $c_p$ est relié à une variation de température par la formule suivante
  $\\Delta T$

  $$
  Q = m \\cdot c_p \\cdot \\Delta T
  $$

  Autrement dit, cette capactité massique caractérise pour un corps (à masse donnée) le prix
  énergétique à payer pour augmenter ou diminuer sa température.

  On peut tout à fait avoir intêret à avoir des corps avec une grosse capacité thermique afin de :
  - stocker de l'énergie pendant longtemps
  - lisser des niveaux de température
  
  Exemple : l'utilisation de pain de glace dans une glacière. Si la capactité thermique de 
  ces pains de glace était faible (à l'enthalpie de changement d'état qui est loin d'être 
  négligeable et que l'on verra plus tard),
  exposer la glacière un court instant au soleil suffirait
  à apporter l'energie nécessaire pour chauffer les pains et donc augmenter la température
  de la glacière. On a donc tout intêret à avoir une grosse capactité massique car :
  - on souhaite faire en sorte que la quantité d'énergie apportée à la glacière sur le trajet
  jusqu'à la table de pique-nique par le soleil ne la réchauffe pas
  - on ne souhait pas avoir une glacière de 50 kg.

  Exemple 2 : On utilise des murs avec une forte capacité thermique pour que les variations de
  température du batiment soit la plus faible possible.

  `;

  const markdownEvolutionTemperatureGlaciere = `
Supposons une glacière de masse $m$ et de capacité massique $c_p$ baignant dans un milieu exterieur
de température $T_{ext}$ avec une surface $S$. On considère que le flux de chaleur échangée avec
le milieu extérieur s'écrit :

$$\\Phi = - S h (T - T_{ext})$$

avec $h$ un coefficient d'échange et $T$ la température de la glacière.

A partir de la relation reliant la température à l'énergie, on peut trouver l'équation d'évolution
temporelle de cette glacière. 

D'après le premeir principe, l'énergie se conserve et donc le flux de chaleur est égale à la
variation d'énergie de la glacière par unité de temps, cad sa dérivée.

$$\\frac{dE} {d t} = \\Phi$$

On peut écrire également ceci :

$$dE = \\Phi dt$$

On suppose la capacité massique de la glacière constante (sa masse sauf en cas de fuite, l'est également).

On a donc d'après l'équivalence vu plus haut :

$$dE = m \\cdot c_p \\cdot d T = \\Phi dt$$

On obtient alors l'équation aux dérivées ordinaire suivante : 

$$m \\cdot c_p \\cdot \\frac{d T}{dt} = - S h (T - T_{ext})$$

Cette équation différentielle à une solution analytique connue. Voici un petit formulaire
permettant de rentrer les valeurs des différentes grandeurs. Du congélateur jusqu'au pique nique,
il y a environ 10 min de voiture dans un coffre à 30 °C. La glacière est un cube de 50 cm de côté.
La masse de la glacière est de 7 kg et sa capacité massique est de 2100. Le coefficient
d'échange est de 10 $W.m^{-2}.K^{-1}$. La température initiale
de la glacière est de 0 °. Si la glacière dépasse les 10°C, le pique nique tombe à l'eau.
Nos protagoniste pourront ils savourer leur pique nique ?

  `;

  const markdownEvolutionMaison = `

  On se place cette fois du point de vue d'un habitant d'une maison qui souhaite ne pas avoir
  trop froid la nuit ni trop chaud la journée. Nous sommes le 24 juin, la température de nuit
  est minimum est de 15 °C et celle de jour maximum est de 30 °C. Les murs de sa maison qu'on assimile à un cube de
  10 m de côté sont en pierre pleines de 50 cm d'épaisseur. La capacité thermique de la pierre
  est d'environ 800 $J.kg^{-1}.K^{-1}$. Sa densité est de 2700 $kg.m^{-3}$. Le coefficient d'échange
  supposée constant est de 10 $W.m^{-2}.K^{-1}$. Quelle est l'épaisseur du mur nécessaire pour que
  la température de la maison ne varie pas de plus de 10 °C ?

  `;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: parseFloat(e.target.value) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || !pyodide) return;

    const { T0, Cp, m, h, S, Te, tmax, dt } = form;

    const Tfunc = pyodide.globals.get("T");
    const [pyTemps, pyTemp] = Tfunc(T0, Cp, m, h, S, Te, tmax, dt);
    const temps = Array.from(pyTemps);
    const temp = Array.from(pyTemp);
    setGraphData({ temps, temp });
  };

  const handleChange2 = (e) => setForm2({ ...form2, [e.target.name]: parseFloat(e.target.value) });

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    if (loading || !pyodide) return;

    const { Tmin, Tmax, Cp2, m2, h2, S2, tmax2, N } = form2;

    const Tfunc2 = pyodide.globals.get("T_maison");
    const [pyTemps, pyTempExt, pyTempMaison] = Tfunc2(m2, Cp2,h2,S2,Tmin,Tmax,tmax2,N);
    const temps = Array.from(pyTemps);
    const tempExt = Array.from(pyTempExt);
    const tempMaison = Array.from(pyTempMaison);
    setGraphData2({ temps, tempExt });
    setGraphData3({ temps, tempMaison });
  };

  return (
    <div className="page-container">
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Énergie et Température</h1>
      <MarkdownTex content={markdownLienTemperatureEnergie} />
      <MarkdownTex content={markdownEvolutionTemperatureGlaciere} />

      {loading || !pyodide ? (
        <p>Chargement de Pyodide...</p>
      ) : (
        <form onSubmit={handleSubmit} className="form-container">
          <div>
            <label>Température initiale (°C)</label>
            <input type="number" name="T0" value={form.T0} onChange={handleChange} />
          </div>
          <div>
            <label>Capacité thermique Cp (J/kg·K)</label>
            <input type="number" name="Cp" value={form.Cp} onChange={handleChange} />
          </div>
          <div>
            <label>Masse (kg)</label>
            <input type="number" name="m" value={form.m} step="any" onChange={handleChange} />
          </div>
          <div>
            <label>Coefficient d'échange h (W/m²·K)</label>
            <input type="number" name="h" value={form.h} step="any" onChange={handleChange} />
          </div>
          <div>
            <label>Surface (m²)</label>
            <input type="number" name="S" value={form.S} step="any" onChange={handleChange} />
          </div>
          <div>
            <label>Température extérieure (°C)</label>
            <input type="number" name="Te" value={form.Te} onChange={handleChange} />
          </div>
          <div>
            <label>Durée simulation (s)</label>
            <input type="number" name="tmax" value={form.tmax} onChange={handleChange} />
          </div>
          <div>
            <label>Pas de temps dt (s)</label>
            <input type="number" name="dt" value={form.dt} onChange={handleChange} />
          </div>
          <button type="submit">Calculer</button>
        </form>
      )}

      {graphData && (
        <div className="graph-container">
          <Plot
            data={[
              {
                x: graphData.temps,
                y: graphData.temp,
                type: "scatter",
                mode: "lines+markers",
                marker: { color: "red" },
                name: "Température"
              }
            ]}
            layout={{
              width: 700,
              height: 300,
              title: "Évolution de la température",
              xaxis: { title: "Temps (s)" },
              yaxis: { title: "Température (°C)" }
            }}
          />
        </div>
      )}

      <MarkdownTex content={markdownEvolutionMaison} />

      <form onSubmit={handleSubmit2} className="form-container">
          <div>
            <label>Température min (°C)</label>
            <input type="number" name="Tmin" value={form2.Tmin} onChange={handleChange2} />
          </div>
          <div>
            <label>Température max (°C)</label>
            <input type="number" name="Tmax" value={form2.Tmax} onChange={handleChange2} />
          </div>
          <div>
            <label>Capacité thermique Cp (J/kg·K)</label>
            <input type="number" name="Cp2" value={form2.Cp2} onChange={handleChange2} />
          </div>
          <div>
            <label>Masse (kg)</label>
            <input type="number" name="m2" value={form2.m2} step="any" onChange={handleChange2} />
          </div>
          <div>
            <label>Coefficient d'échange h (W/m²·K)</label>
            <input type="number" name="h2" value={form2.h2} step="any" onChange={handleChange2} />
          </div>
          <div>
            <label>Surface (m²)</label>
            <input type="number" name="S2" value={form2.S2} step="any" onChange={handleChange2} />
          </div>
          <div>
            <label>Durée simulation (s)</label>
            <input type="number" name="tmax2" value={form2.tmax2} onChange={handleChange2} />
          </div>
          <div>
            <label>Nombre de step</label>
            <input type="number" name="N" value={form2.N} onChange={handleChange2} />
          </div>
          <button type="submit">Calculer</button>
        </form>

      {graphData2 && graphData3 &&(
        <div className="graph-container">
          <Plot
            data={[
              {
                x: graphData2.temps,
                y: graphData2.tempExt,
                type: "scatter",
                mode: "lines+markers",
                marker: { color: "red" },
                name: "Température exterieur"
              },
              {
                x: graphData3.temps,
                y: graphData3.tempMaison,
                type: "scatter",
                mode: "lines+markers",
                marker: { color: "blue" },
                name: "Température maison"
              }
            ]}
            layout={{
              width: 700,
              height: 300,
              title: "Évolution de la température",
              xaxis: { title: "Temps (s)" },
              yaxis: { title: "Température (°C)" }
            }}
          />
        </div>
      )}
    </div>
  );
}