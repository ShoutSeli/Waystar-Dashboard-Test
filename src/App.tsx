import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import EligibilityCheck from "./Components/EligibilityCheck";
import ClaimSubmission from "./Components/ClaimSubmission";
import BillingDetails from "./Components/BillingDetails";
import ClaimStatusMonitor from "./Components/ClaimStatusMonitor";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/eligibility" element={<EligibilityCheck />} />
        <Route path="/submission" element={<ClaimSubmission />} />
        <Route path="/billing" element={<BillingDetails />} />
        <Route path="/status" element={<ClaimStatusMonitor />} />
      </Routes>
    </Router>
  );
}

export default App;
