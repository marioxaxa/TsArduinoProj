import { createContext, useState } from 'react'
import SideBar from '../components/SideBar';
import DragArea from '../components/DragArea';

type Props = {}


export const AppContext = createContext(null as any);

export default function Simulator({}: Props) {

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
                    <div className='h-screen w-screen bg-slate-950 overflow-hidden'>
                        <SideBar />
                        <DragArea />
                    </div>
                </AppContext.Provider>
            </div>
  )
}