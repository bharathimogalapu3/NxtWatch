const express = require("express");
const app = express();
const videos=require("./API1.json");

app.listen(4000,()=>{
    console.log("server started");
})

app.get("/",(req,res)=>{
    res.send("Welcome");
});

app.get("/videos/all",(req,res)=>{
    res.send(videos);
});

module.exports = app;