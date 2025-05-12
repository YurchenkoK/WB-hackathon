import './App.css'
import FraudTable from "./components/FraudTable/FraudTable.jsx";
import { Routes, Route } from "react-router-dom";
import DiagramsPage from "./components/DiagramsComponent/DiagramsPage.jsx";


function App() {
    return (
        <Routes>
            <Route path="/" element={<FraudTable />} />
            <Route path="/diagrams" element={<DiagramsPage />} />
        </Routes>
    );
}

export default App
