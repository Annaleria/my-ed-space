// Handles mock session/authentication
import { randomUUID } from "node:crypto";
import { Session, SessionRepo } from "../repositories/sessionRepository.js";

export const SessionService = {
  createSession: (student_id: string) => {
    const session: Session = { id: randomUUID(), student_id };
    SessionRepo.add(session);
    return session;
  },
  getAll: () => SessionRepo.getAll(),
};
