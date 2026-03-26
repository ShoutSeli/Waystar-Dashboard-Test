import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import EligibilityCheck from "./Components/EligibilityCheck";
import ClaimSubmission from "./Components/ClaimSubmission";
import BillingDetails from "./Components/BillingDetails";
import ClaimStatusMonitor from "./Components/ClaimStatusMonitor";
import RejectionReview from "./Components/RejectionReview";
import InsurancePayerView from "./Components/InsurancePayerView";
import Settings from "./Components/Settings"; 

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/eligibility" element={<EligibilityCheck />} />
        <Route path="/submission" element={<ClaimSubmission />} />
        <Route path="/billing" element={<BillingDetails />} />
        <Route path="/status" element={<ClaimStatusMonitor />} />
        <Route path="/rejections" element={<RejectionReview />} />
        <Route path="/insurancepayerview" element={<InsurancePayerView />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
