const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");
const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

//Verifica a existencia do repositório
function verifyExistRepository(req, res, next){
  if (!repositories.find(repos => repos.id === req.params.id)) {
    return res.status(400).json({ error: "Repository does not exist." });
  }
  next();
}

//pega o índice do repodistório
getRepoIndex = (id) => repositories.findIndex(repo => repo.id === id);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", verifyExistRepository, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repIndex = getRepoIndex(id);
  const likes = repositories[repIndex].likes;
  repositories[repIndex] = {
    id,
    title,
    url,
    techs,
    likes: likes,
  }
  return response.status(200).json(repositories[repIndex]);
});

app.delete("/repositories/:id", verifyExistRepository, (request, response) => {
  const repIndex = getRepoIndex(request.params.id);
  repositories.splice(repIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", verifyExistRepository, (request, response) => {
  const repIndex = getRepoIndex(request.params.id);
  repositories[repIndex].likes += 1;
  return response.status(200).json(repositories[repIndex]);
});

module.exports = app;
