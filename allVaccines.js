const express = require("express");
const fs = require("fs").promises;
const allVaccineRoute = express.Router();

const dataFilePath = "data.json";

const readJsonFile = async () => {
  try {
    const data = await fs.readFile(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
};

allVaccineRoute.get("/", async (req, res) => {
  let vaccines = await readJsonFile();
  if (vaccines === null) {
    return res
      .status(400)
      .send({ status: "Failed", message: "Empty Vaccine Array" });
  }

  return res.status(200).send({ status: "Success", vaccines });
});

module.exports = allVaccineRoute;
