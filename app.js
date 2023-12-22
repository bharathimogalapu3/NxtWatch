const express = require("express");
const {open}=require("sqlite");
const sqlite3=require("sqlite3");
const path=require("path");
const cors=require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const dbPath=path.join(__dirname,"APIDatabase.db");
let db=null;

const InitializeDatabaseAndServer=async ()=>{
    try{
        db=await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        app.listen(3000,()=>{
            console.log("server started");
        });
    }
    catch(e){
        console.log(`DB ERROR: ${e.message}`);
        process.exit(1);
    }
}

InitializeDatabaseAndServer();


const videos=require("./API1.json");
const trending=require("./API2.json");
const gaming=require("./API3.json");

app.get("/addData",async (req,res)=>{
    for (let book of videos.videos){
        let {id,title,thumbnail_url,channel,view_count,published_at}=book;
        const dbQuery=`INSERT INTO API1 VALUES("${id}","${title}","${thumbnail_url}","${channel.name}","${channel.profile_image_url}","${view_count}","${published_at}");`
        await db.run(dbQuery);
    }
    console.log("Data Inserted!");
});

app.get("/addData/API2",async (req,res)=>{
    for (let book of trending.videos){
        let {id,title,thumbnail_url,channel,view_count,published_at}=book;
        const dbQuery=`INSERT INTO API2 VALUES("${id}","${title}","${thumbnail_url}","${channel.name}","${channel.profile_image_url}","${view_count}","${published_at}");`
        await db.run(dbQuery);
    }
    console.log("Data Inserted!");
});

app.get("/addData/API3",async (req,res)=>{
    for (let book of gaming.videos){
        let {id,title,thumbnail_url,view_count}=book;
        const dbQuery=`INSERT INTO API3 VALUES("${id}","${title}","${thumbnail_url}","${view_count}");`
        await db.run(dbQuery);
    }
    console.log("Data Inserted!");
});

app.get("/",(req,res)=>{
    res.send("Welcome to NxtWatch!");
});

function displayOutput(response){
    let updated_response=[];
    for (let book of response){
        updated_res={};
        updated_res.id=book.id;
        updated_res.title=book.title;
        updated_res.thumbnail_url=book.thumbnail_url;
        updated_res.channel={
            name:book.name,
            "profile_image_url":book. profile_image_url,
        };
        updated_res.view_count=book.view_count;
        updated_res.published_at=book.published_at;
        updated_response.push(updated_res);
        
    }
    return updated_response;
}

app.get("/videos/search",async (req,res)=>{
    const dbquery=`SELECT * from API1`;
    const response=await db.all(dbquery);
    let updated_response=displayOutput(response);
    res.send({"videos":updated_response,"total":updated_res.length});
});

app.get("/videos/trending",async (req,res)=>{
    const dbquery=`SELECT * from API2`;
    const response=await db.all(dbquery);
    let updated_response=displayOutput(response);
    res.send({"videos":updated_response,"total":updated_res.length});
});

app.get("/videos/gaming",async (req,res)=>{
    const dbquery=`SELECT * from API3`;
    const response=await db.all(dbquery);
    res.send({"videos":response,"total":response.length});
});


app.get("/videos/:id",async (req,res)=>{
    const {id}=req.params;
    const dbQuery=`SELECT * from  API1 where id="${id}";`
    const response=await db.get(dbQuery);
    res.send(response);
});

app.get("/videos/search/:title",async (req,res)=>{
    const {title}=req.params;
    const dbQuery=`SELECT * from  API1 where title like "%${title}%";`
    const response=await db.all(dbQuery);
    res.send(response);
});

module.exports = app;