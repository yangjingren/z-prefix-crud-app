import "primereact/resources/themes/md-light-indigo/theme.css";
import "primeflex/primeflex.css";
import 'primeicons/primeicons.css';
import { Navbar } from "./Navbar";
import { BrowserRouter as Router , Routes, Route} from "react-router-dom";
import { createContext, useState } from "react";
import PersonalInventory from "../Warehouse/PersonalInventory";
import Inventory from "../Warehouse/Inventory";
import { Create } from "../Warehouse/Create";


export const AuthContext = createContext()

function App() {
  const [authStatus, setAuthStatus] = useState(false);

  

  return (
    <div>
        <AuthContext.Provider value={{authStatus, setAuthStatus}}>
            <Navbar />
            <Routes>
                <Route path="/" element={<Inventory/>} />
                <Route path="/personal" element={<PersonalInventory />} />
                <Route path="/create" element={<Create />} />
            </Routes>
        </AuthContext.Provider>
    </div>
  );
}

export default App;
