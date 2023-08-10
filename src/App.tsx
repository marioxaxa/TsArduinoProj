import { createContext, useState } from "react";
import "./styles/global.css";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Simulator from "./pages/Simulator";
import Editor from "./pages/Editor";


function App() {
    const [dragMap, setDragMap] = useState([]);

    const [lines, setLines] = useState([]);

    const [data, setData] = useState([]);

    const [alignment, setAlignment] = useState("simulador");

    const [connectivityMtx, setConnectivityMtx] = useState({});

    const [eletronicMtx, setEletronicMtx] = useState(null);

    const [eletronicStateList, setEletronicStateList] = useState({});

    const [running, setRunning] = useState(false);

    const [buildingCircuit, setBuildingCircuit] = useState(false);

    return (
        <>
            <div>
                <AppContext.Provider
                    value={{
                        data,
                        setData,
                        dragMap,
                        setDragMap,
                        lines,
                        setLines,
                        alignment,
                        setAlignment,
                        connectivityMtx,
                        setConnectivityMtx,
                        eletronicMtx,
                        setEletronicMtx,
                        eletronicStateList,
                        setEletronicStateList,
                        running,
                        setRunning,
                        buildingCircuit,
                        setBuildingCircuit,
                    }}
                >
                    <Routes>
                        <Route path="/" element={<Simulator />} />
                        <Route path="editor" element={<Editor />} />
                    </Routes>
                </AppContext.Provider>
            </div>
        </>
    );
}

export default App;
