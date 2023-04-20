import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { v4 } from "uuid";

const serviceFactory = (prismaClient: PrismaClient) => {
  return {
    getAll: async () => await prismaClient.challengeRow.findMany(),
    create: async (input: { name: string; content: string }) => {
      const { name, content } = input;

      if (typeof name !== "string" || typeof content !== "string") {
        throw new Error("Invalid");
      }

      const today = new Date();
      const MONDAY = 1;
      let level = 1;

      if (content.length > 100 && content.includes(";")) {
        level = 3;
      } else if (today.getDay() === MONDAY) {
        level = 2;
      }

      const id = v4();

      await prismaClient.challengeRow.create({
        data: { id, name, content, level },
      });

      return { id };
    },
  };
};

export const challengesFactory = (prismaClient: PrismaClient) => {
  const service = serviceFactory(prismaClient);

  return {
    service,
    routerFactory: () => {
      const router = Router();

      router.get("/", async (req, res) => {
        res.json(await service.getAll());
      });

      router.get("/:id", async (req, res) => {
        const id = req.params.id;

        if (typeof id !== "string") {
          return res.sendStatus(400);
        }

        const challenge = await prismaClient.challengeRow.findUnique({
          where: { id },
        });

        if (!challenge) return res.sendStatus(400);

        res.json(challenge);
      });

      router.post("/", async (req, res) => {
        try {
          res.json(service.create(req.body));
        } catch (error) {
          return res.sendStatus(400);
        }
      });

      router.delete("/:id", async (req, res) => {
        const id = req.params.id;

        if (typeof id !== "string") return res.sendStatus(400);

        await prismaClient.challengeRow.delete({ where: { id } });
        res.sendStatus(200);
      });

      return router;
    },
  };
};
