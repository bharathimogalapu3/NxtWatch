const express = require("express");
const app = express();
const cors=require("cors");
app.use(cors());

const videos=require("./API1.json");
const trending=require("./API2.json");
const gaming=require("./API3.json");

app.listen(3000,()=>{
    console.log("server started");
})

app.get("/",(req,res)=>{
    res.send("Welcome to NxtWatch!");
});

app.get("/videos",(req,res)=>{
    res.send(videos);
});

app.get("/videos/trending",(req,res)=>{
    res.send(trending);
});

app.get("/videos/gaming",(req,res)=>{
    res.send(gaming);
});


app.get("/videos/:id",(req,res)=>{
    const {id}=req.params;
    const index=videos.videos.findIndex(obj=>{
        return obj.id===id
    })
    res.send(videos.videos[index]);
});

app.get("/videos/:title",(req,res)=>{
    let result=[];
    const {title}=req.params;
    const video=videos[videos];
    for(let singleVideo of video)
    {
        if(singleVideo[title]===title){
            result.push(singleVideo);
        }
    }
    res.send(result);
});


module.exports = app;