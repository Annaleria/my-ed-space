import { Routes, Route } from "react-router-dom";
import CourseList from "./pages/CourseList";
import Checkout from "./pages/Checkout";
import Onboard from "./pages/Onboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CourseList />} />
      <Route path="/checkout/:courseId" element={<Checkout />} />
      <Route path="/onboard" element={<Onboard />} />
    </Routes>
  );
}

export default App;
