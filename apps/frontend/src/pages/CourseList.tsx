import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { type Course } from "@myedspace/shared";

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch courses: ${res.status}`);
        }
        return res.json();
      })
      .then(setCourses)
      .catch((error) => {
        console.error("Failed to load courses", error);
      });
  }, []);

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto" }}>
      <h1>Available Courses</h1>
      <ul>
        {courses.map((c) => (
          <li key={c.id} style={{ margin: "1rem 0" }}>
            <div>
              <b>{c.subject}</b> <span>({c.year_range})</span> - £{c.price}
            </div>
            <button onClick={() => navigate(`/checkout/${c.id}`)}>Buy</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
