import { Router } from "express";
import { generatePets } from "../utils/generatePets.js";
import { generateUser } from "../utils/generateUser.js";
import { generateFakeUsersAndPets } from "../services/mock.service.js";

const router = Router();

router.get("/mockingpets", (req, res) => {
  const pets = [];

  for (let i = 0; i < 50; i++) {
    pets.push(generatePets());
  }

  res.json({ status: "success", payload: pets });
});

router.get("/mockingusers", (req, res) => {
  const users = [];

  for (let i = 0; i < 50; i++) {
    users.push(generateUser());
  }

  res.json({ status: "success", payload: users });
});

router.post("/generateData", async (req, res) => {
  try {
    const { users, pets } = req.body;

    if (
      typeof users !== "number" ||
      typeof pets !== "number" ||
      users < 0 ||
      pets < 0
    ) {
      return res.status(400).json({
        status: "error",
        message:
          'You must provide numeric "users" and "pets" greater than or equal to 0',
      });
    }

    const result = await generateFakeUsersAndPets(users, pets);

    res.status(201).json({
      status: "success",
      message: `Inserted ${result.users.length} users and ${result.pets.length} pets`,
      payload: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

export default router;
