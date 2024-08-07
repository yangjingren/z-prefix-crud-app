import "primereact/resources/themes/md-light-indigo/theme.css";
import "primeflex/primeflex.css";
import Navbar from "./Navbar";
import { BrowserRouter as Router , Routes, Route} from "react-router-dom";
import Inventory from "../Warehouse/Inventory";

function App() {

  return (
    <div>
        <Navbar />
        <Router>
            <Routes>
                <Route path="/" element={<Inventory/>} />
            </Routes>
        </Router>
    </div>
  );
}

export default App;
