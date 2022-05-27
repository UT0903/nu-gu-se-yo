const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express();
const mysql = require('mysql')
const sha3_256 = require('js-sha3').sha3_256;

// const PORT = 3002;

const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    database: "project_db"
})

db.connect();

app.use(bodyParser.urlencoded({extended: true}))
app.use(cors());
app.use(express.json())

app.post("/api/login", (req,res)=>{
    const id = req.body.id;
    const password = req.body.password;

    db.query("SELECT * FROM (SELECT COUNT(1) AS A FROM user WHERE id = ?) AS T CROSS JOIN (SELECT COUNT(1) AS B FROM user WHERE id = ? AND password = ?);", [id, id, password],(err,result) =>{
        if (result[0]["A"] == 1 && result[0]["B"] == 1 ) {
            res.send({'status': 'ok'})
        }
        else if (result[0]["A"] == 1 && result[0]["B"] == 0 ){
            res.send({'status': 'fail'})
        }
        else {
            db.query("INSERT INTO user VALUES(?, ?)", [id, password],(err,result)=>{
                if(err) {
                    console.log(err)
                }
            });
            res.send({'status': 'ok'})
        }
    });
});


app.post("/api/execute", (req,res)=>{
    const account_address = req.body.account_address;
    const bene_mail = req.body.bene_mail;
    const bene_rate = req.body.bene_rate;
    const sqlInsert_2 = "INSERT INTO testament_rate (account_address, bene_mail, bene_rate) VALUES (?,?,?)"
    db.query(sqlInsert_2, [account_address, bene_mail, bene_rate],(err,result)=>{
        console.log(result)
    });
})
app.listen(3002, ()=>{
    // console.log(`Server is running on ${PORT}`)
    console.log('Server is running on 3002')
})
