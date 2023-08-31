/*
1. create a basic setup with npm cli, write the steps to do so, using express
- Initialize a project using "npm init -y"
- Since we need express for the project we can install it next in the project directory by using "npm i express"
- We can then import express and create an express app
- Then we define the port for the app to listen on and start creating API endpoints.
*/
const express = require("express");
const app = express();

const PORT = 3000;

//2. Create an API named getInfo with server.js as main file and configure using nodemon
app.get("/getInfo", (req, res) => {
  return res.status(200).send({ message: "This is getInfo API" });
});

/*
3. Explain the purpose of express elements - Application, Request, Response and Router
- Application is the express instance of the web app.
- Request is the request object which contains data about the HTTP request made to the server
- Response is the response object which contains the data server is sending back to the client.
- Router allows us to organise the API routes into modular components which enhances maintablity and structure.
*/

/*
4. What will happen if we don't have package.lock.json in our application
- package.lock.json consists of list of the exact dependencies versions that have used to build the project. Without it, different builds of the project in different environments can become inconsistent and can lead to compatiblity issues.
*/

//5. Create an api name getVaccine with get method, pass info like - vaccineName, price, doses pass these information using query string and save it into a json file on server also send back the same as response
const fs = require("fs").promises;
const dataFilePath = "data.json";

const readJsonFile = async () => {
  try {
    const data = await fs.readFile(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      return []; // Return an empty array if the file doesn't exist yet
    }
    throw error;
  }
};

const writeJsonFile = async (jsonArray) => {
  await fs.writeFile(dataFilePath, JSON.stringify(jsonArray, null, 2), "utf8");
};

app.get("/getVaccine", async (req, res) => {
  const { vaccineName, price, doses } = req.query;

  if (!vaccineName || !price || !doses) {
    return res.status(400).send({
      status: "Failed",
      message: "Some parameter is missing. Please check.",
    });
  }

  const newVaccine = {
    vaccineName,
    price,
    doses,
  };

  try {
    let vaccines = await readJsonFile();
    vaccines.push(newVaccine);
    await writeJsonFile(vaccines);

    return res.status(200).send({
      status: "Success",
      ...newVaccine,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send({
      status: "Error",
      message: "An error occurred while processing your request.",
    });
  }
});

/*
6. What is the purpose of RESTFul API and what specifications are must to make a service RESTFul

- We use RESTful API to make stateless HTTP, HTTPS protocol stateful.Specifications  to make a service RESTful are it should be using HTTP/HTTPS protocol, it should have a client-server architecture and should use the REST methods like GET, POST, PUT, DELETE, PATCH, etc.
*/

//7. Create an example of Application mounting using vaccination API's
const allVaccine = express();
const allVaccineRoute = require("./allVaccines");
app.use("/all", allVaccine);
allVaccine.use("/", allVaccineRoute);

//8. Create an API to demonstrate route param usage like - getVaccineByID
app.get("/getById/:id", async (req, res) => {
  const { id } = req.params;
  vaccines = await readJsonFile();
  if (vaccines === null || vaccines.length === 0 || vaccines.length <= id) {
    return res
      .status(400)
      .send({ status: "Failed", message: "No vaccine found" });
  }
  return res.status(200).send({ status: "Success", ...vaccines[id] });
});

app.listen(PORT, () => {
  console.log(`🚀 Server launched on port: ${PORT}`);
});
