const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.log(logLabel);

  return next();
}

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id)) {
      return response.status(400).json({ error: 'Invalid project ID.' });
  }

  return next();
}

app.use(logRequests);
app.use('/projects/:id', validateProjectId);

app.get('/repositories', (request, response) => {
  const { title } = request.query;

  const results = title ? repositories.filter(repo => repo.title.includes(title)) : repositories;

  return response.json(results);
});


app.post('/repositories', (request, response) => {
  const repository = { 
    id: uuid(),
    title: 'Desafio Node.js', 
    url: 'http://github.com/...', 
    techs: ["Node.js", "..."], 
    likes: 0 }
  
    repositories.push(repository)    

  return response.json(repository)
  
} 
)

app.put('/repositories/:id', (req, res) => {
  const { id } = req.params;
  const {title, url, techs} = req.body;  
  const findindex = repositories.findIndex( repository => repository.id === id )

  if(findindex < 0){
    return res.status(400).json(['deu errado'])
  }

  if(title){
    repositories[findindex].title = title
    res.json(repositories[findindex])
  }

  if(url){
    repositories[findindex].url = url
    res.json(repositories[findindex])
  }

  if(techs){
    repositories[findindex].techs = [techs]
    res.json(repositories[findindex])
  }

  return res.json(repositories)
  }
)

app.delete('/repositories/:id', (request, response)=> {
  const { id } = request.params;
  const findindex = repositories.findIndex( repository => repository.id === id )

  if(findindex < 0){
    return response.status(400).json(['deu errado'])
  }
  
  repositories.splice(findindex, 1)

    response.status(204).json()
  }
)

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;
  const findindex = repositories.findIndex( repository => repository.id === id )
  const {likes} = repositories[findindex]; 

  if(findindex < 0){
    return response.status(400).json(['deu errado'])
  }

  if(findindex > 0){
    repositories[findindex].likes = likes + 1;
  }

  return response.json(repositories[findindex])
  } 
)


module.exports = app;
