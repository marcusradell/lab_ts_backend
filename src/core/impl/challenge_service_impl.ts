import { PrismaClient } from "@prisma/client";
import { ValidationError } from "../../validation_error";
import { ChallengeRepository } from "../ports/driven/challenge_repository";
import { IdentityGenerator } from "../ports/driven/identity_generator";
import { TimeProvider } from "../ports/driven/time_provider";
import { ChallengeService } from "../ports/driver/challenge_service";

export const challengeServiceImplFactory = (
  challengeRepository: ChallengeRepository,
  timeProvider: TimeProvider,
  identityGenerator: IdentityGenerator
): ChallengeService => {
  return {
    list: async () => {
      return await challengeRepository.getAll();
    },
    display: async (id) => {
      if (typeof id !== "string") {
        throw new ValidationError();
      }

      const challenge = await challengeRepository.getById(id);

      if (!challenge) {
        throw new ValidationError();
      }

      return challenge;
    },
    add: async ({ name, content }) => {
      if (typeof name !== "string" || typeof content !== "string") {
        throw new ValidationError();
      }

      const today = timeProvider.now();
      const MONDAY = 1;
      let level = 1;

      if (content.length > 100 && content.includes(";")) {
        level = 3;
      } else if (today.getDay() === MONDAY) {
        level = 2;
      }

      const data = { id: identityGenerator.v4(), name, content, level };

      try {
        await challengeRepository.add(data);
      } catch (error) {
        throw new ValidationError();
      }
    },
    remove: async (id) => {
      if (typeof id !== "string") {
        throw new ValidationError();
      }

      await challengeRepository.remove(id);
    },
  };
};
