const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { buffer } = require("stream/consumers");
const agentes = require('./data/agentes.js')

const secretKey = "Llave Secreta";

const app = express();
app.use(express.json());
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  fs.readFile("index.html", "utf8", (err, data) => {
    res.end(data);
  });
});

app.get("/perfil", (req, res) => {
  fs.readFile("public/perfil.html", "utf8", (err, data) => {
    res.set("Content-Type", "text/html");
    res.end(data);
  });
});
app.get("/autenticado", (req, res) => {
  fs.readFile("public/autenticado.html", "utf8", (err, data) => {
    res.end(data);
  });    
});

app.post("/SignIn", (req, res) => {
    if(agentes.results.find(agente => agente.email == req.body.email && agente.password == req.body.password)){
        const token = jwt.sign(
            {
              expiresIn: "120s",
              data: {email: req.body.email, password: req.body.password},
            },
            secretKey
          );
            res.status(200).json({token});
    }else{
        res.status(401).json({mensaje: "Las credenciales no son validas" });
    }

});
app.get("/validar", (req, res) =>{
  const authorization  = req.headers.authorization.replace("Bearer ", "");
  jwt.verify(JSON.parse(authorization).token, secretKey, (err, data) => {
    err
      ? res.status(403).json({ mensaje: "Token Invalido" })
      : res.status(200).send({Success: true})
      
  });
})
app.listen("3000", () => {
  console.log("App levantada en el puerto 3000");
});

