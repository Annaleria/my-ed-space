import { Routes, Route } from "react-router-dom";
import CourseList from "./pages/CourseList";
import Checkout from "./pages/Checkout";
import Onboard from "./pages/Onboard";
import LmsDashboard from "./pages/LmsDashboard";
import CourseLessons from "./pages/CourseLessons";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CourseList />} />
      <Route path="/checkout/:courseId" element={<Checkout />} />
      <Route path="/onboard" element={<Onboard />} />
      <Route path="/lms" element={<LmsDashboard />} />
      <Route path="/lms/course/:courseId" element={<CourseLessons />} />
    </Routes>
  );
}

export default App;
