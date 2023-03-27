import { Express } from "express";
import { ChallengeServiceImpl } from "./challenge_service_impl";

export const ChallengeController = (
  app: Express,
  challengeService: ChallengeServiceImpl
) => {
  app.get("/challenge", async (req, res) => {
    const challenges = await challengeService.list();

    res.json(challenges);
  });

  app.get("/challenge/[id]", async (req, res) => {
    const id = req.query.id;

    try {
      const challenge = await challengeService.display(id);

      res.json(challenge);
    } catch (error) {
      return res.sendStatus(400);
    }
  });

  app.post("/challenge", async (req, res) => {
    const { name } = req.body;

    // type check as string

    await challengeService.add(name);

    res.sendStatus(200);
  });

  app.delete("/challenge", async (req, res) => {
    const { id } = req.body;

    try {
      await challengeService.remove(id);

      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(400);
    }
  });
};
