import { ValidationError } from "../../../validation_error";
import { Challenge } from "../types";

export const logic = (challenge: Challenge | null) => {
  if (!challenge) throw new ValidationError();
  return challenge;
};
