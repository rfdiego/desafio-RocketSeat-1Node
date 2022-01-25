/* 1º DESAFIO BACK END ROCKESEAT  */

const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];


app.post("/repositories", (request, response) => {
 
  const { title, url , techs } = request.body

  const repositorio = { id: uuid() , title: title, 
    url: url,  
    techs: techs, 
    likes:0}

  repositories.push(repositorio);  

  return response.json(repositorio);

});

app.get("/repositories", (request, response) => {
  const { title } = request.query

  //console.log("repositories")
  const results = title
  ? repositories.filter(repositorio=> repositorio.title.includes(title)) // se tiver algum filtro query, busca no array com o nome title
  : repositories//se tiver vazio return all

  return response.json(results)
}); 

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, techs, url } = request.body

  const registroIndex = repositories.findIndex(repositorio => repositorio.id === id);
  
  if (registroIndex === -1) {
    return response.status(400).json({error:"repositório não encontrado!"})  
  }

  const temp = {
    id,
    title,
    techs,
    url,
    likes: repositories[registroIndex].likes,
  }  

  repositories[registroIndex] = temp

  return response.json(temp)

});

app.delete("/repositories/:id", (request, response) => {

  const { id } = request.params
  
  const registroIndex = repositories.findIndex(repositorio => repositorio.id === id);

  if (registroIndex < 0) {
    return response.status(400).json({error:"repositório não encontrado!"})  
  }

  repositories.splice(registroIndex, 1)

  return response.status(204).json()

});  

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const registroIndex = repositories.findIndex(repositorio => repositorio.id === id);

  if (registroIndex < 0) {
    return response.status(400).json({error:"repositório não encontrado!"})  
  }

  repositories[registroIndex].likes++

  return response.json(repositories[registroIndex]);


});

module.exports = app;
