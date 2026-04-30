export type Session = {
  id: string;
  student_id: string;
};

export const sessions: Session[] = [];

export const SessionRepo = {
  getAll: () => sessions,
  add: (session: Session) => {
    sessions.push(session);
  },
};
