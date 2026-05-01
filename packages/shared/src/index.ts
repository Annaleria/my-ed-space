export type Course = {
  id: string;
  subject: string;
  year_range: string;
  price: number;
};

export type Lesson = {
  id: string;
  course_id: string;
  title: string;
  content: string;
};

export type StudentLesson = {
  id: string;
  student_id: string;
  lesson_id: string;
};

export type Enrolment = {
  id: string;
  student_id: string;
  course_id: string;
};

export type Student = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Parent = {
  id: string;
  email: string;
};

export type Purchase = {
  id: string;
  parent_id: string;
  course_id: string;
  student_email: string;
  invite_token: string;
};

export type Session = {
  id: string;
  student_id: string;
};
