import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";

import MyForm1 from "./MyForm1";
import AgentRegistration from "./AgentRegistration";
import AgentLogin from "./AgentLogin";
import AgentDashboard from "./AgentDashboard";
import ForgotPassword from "./ForgotPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/get-quotation" element={<MyForm1 />} />
        <Route path="/agent-registration" element={<AgentRegistration />} />
        <Route path="/agent-login" element={<AgentLogin />} />
        <Route path="/agent-dashboard" element={<AgentDashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;

// import React from "react";
// import Form from "./Form";
// import MyForm1 from "./MyForm1";
// import HomePage from "./HomePage";

// function App() {
//   return (
//     <div>
//       <HomePage />
//     </div>
//   );
// }

// export default App;
