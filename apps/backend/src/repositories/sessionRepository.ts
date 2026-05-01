import type { Session } from "@myedspace/shared";
export const sessions: Session[] = [];

export const SessionRepo = {
  getAll: () => [...sessions],
  add: (session: Session) => {
    sessions.push(session);
  },
};
