import "primereact/resources/themes/md-light-indigo/theme.css";
import "primeflex/primeflex.css";
import Navbar from "./Navbar";
import { BrowserRouter as Router , Routes, Route} from "react-router-dom";
import Inventory from "../Warehouse/Inventory";
import { createContext, useState } from "react";

export const AuthContext = createContext()

function App() {
  const [authStatus, setAuthStatus] = useState(false);

  

  return (
    <div>
        <AuthContext.Provider value={{authStatus, setAuthStatus}}>
        <Navbar />
        <Router>
            <Routes>
                
                    <Route path="/" element={<Inventory/>} />
                
            </Routes>
        </Router>
        </AuthContext.Provider>
    </div>
  );
}

export default App;
