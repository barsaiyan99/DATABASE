const express = require("express");
const { faker } = require('@faker-js/faker');
const mysql= require("mysql2");
const path = require("path");
const methodOverride = require("method-override");
const { uuid } = require("uuidv4");
let app = express();
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
let port = 8080;
let getRandomUser=()=>{
    return [
         faker.datatype.uuid(),
         faker.internet.userName(),
         faker.internet.email(),
         faker.internet.password(),
    ];
}
let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database : "delta_app",
    password : "D!vyd!tya1911",
});
app.get("/",(req,res)=>{
 let q = `select count(*) from user`;
  try {
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let count = result[0]["count(*)"];
            res.render("home.ejs",{count});
        });
    } catch (error) {
        console.log(error);
    }
});
app.get("/user",(req,res)=>{
    let q = `select * from user`;
    try {
        connection.query(q,(err,users)=>{
            if(err) throw err;
            res.render("users.ejs",{users});
        });
    } catch (error) {
        console.log(error);
    }
});
app.get("/user/:id/edit",(req,res)=>{
    let{id} = req.params;
    let q = `select * from user where id = '${id}'`;
    try {
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let user = result[0];
            res.render("edit.ejs",{user});
        });
    } catch (error) {
        console.log(error);
    }
});
app.patch("/user/:id",(req,res)=>{
    let{id} = req.params;
    let{username,password} = req.body;
    let q = `select * from user where id = '${id}'`; 
    try {
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let user = result[0];
            if(password!=user.password){
                res.send("WRONG PASSWORD");
            }
            else{
                let q2 = `update user set username = '${username}' where id = '${id}'`;
                connection.query(q2,(err,result)=>{
                    if(err) throw err;
                    console.log("updated");
                    res.redirect("/user");
                });
            }
        });
    } catch (error) {
        console.log(error);
    }


});
app.get("/user/new",(req,res)=>{
     res.render("new.ejs");
});
app.post("/user/new",(req,res)=>{
    let {username,email,password} = req.body;
    let id =uuid();
    let q = `insert into user(id,username,email,password) values("${id}","${username}","${email}","${password}")`;
    try {
        connection.query(q, (err, result) => {
          if (err) throw err;
          console.log("added new user");
          res.redirect("/user");
        });
      } catch (err) {
        res.send("some error occurred");
      }
});
app.get("/user/:id/delete", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM user WHERE id='${id}'`;
  
    try {
      connection.query(q, (err, result) => {
        if (err) throw err;
        let user = result[0];
        res.render("delete.ejs", { user });
      });
    } catch (err) {
      res.send("some error with DB");
    }
  });
  
  app.delete("/user/:id/", (req, res) => {
    let { id } = req.params;
    let { password } = req.body;
    let q = `SELECT * FROM user WHERE id='${id}'`;
  
    try {
      connection.query(q, (err, result) => {
        if (err) throw err;
        let user = result[0];
  
        if (user.password != password) {
          res.send("WRONG Password entered!");
        } else {
          let q2 = `DELETE FROM user WHERE id='${id}'`; //Query to Delete
          connection.query(q2, (err, result) => {
            if (err) throw err;
            else {
              console.log(result);
              console.log("deleted!");
              res.redirect("/user");
            }
          });
        }
      });
    } catch (err) {
      res.send("some error with DB");
    }
  });
app.listen(port,()=>{
    console.log(`app is listening at port ${port}`);
});
    // let q = `INSERT INTO user(id,username,email,password) values ?`;
    // let data = [];
    // for(let i=1;i<=100;i++){
    //    data.push(getRandomUser());
    // }
    // try {
    //     connection.query(q,[data],(err,result)=>{
    //         if(err) throw err;
    //         console.log(result);
    //     });
    // } catch (error) {
    //     console.log(error);
    // }
    // connection.end();
