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


// db.query("SELECT 1", [],(err,result)=>{
//     if(err) {
//         console.log(err)
//     }
//     else {
//         console.log(result)
//     }
// });

app.use(bodyParser.urlencoded({extended: true}))
app.use(cors());
app.use(express.json())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post("/api/login", (req,res)=>{
    const id = req.body.id;
    const password = req.body.password;
    console.log(id)
    console.log(password)
    var fail = 0
    db.query("SELECT * FROM (SELECT COUNT(1) AS A FROM user WHERE id = ?) AS T CROSS JOIN (SELECT COUNT(1) AS B FROM user WHERE id = ? AND password = ?) AS L;", [id, id, password],(err,result) =>{
        if(err)
            console.log(err)
        console.log(result)
        if (result[0]["A"] == 1 && result[0]["B"] == 1 ) {
        }
        else if (result[0]["A"] == 1 && result[0]["B"] == 0 ){
            fail = 1
            res.send({'status': 'fail'})
        }
        else {
            db.query("INSERT INTO user VALUES(?, ?)", [id, password],(err,result)=>{
                if(err) {
                    console.log(err)
                }
            });
        }
        if(fail === 0) {
            console.log("aaaaaa")
            db.query('SELECT contract_address FROM contract WHERE id = ?;' , [id],(err,result)=>{
                if(err){
                    console.log(err)
                    console.log("get contract error")
                    res.send({'status': 'fail'})
                }
                console.log(result)
                if(result.length != 0 ) {
                    res.send({'status': 'ok', 'address': result[0]["contract_address"]})
                }
                else {
                    res.send({'status': 'ok', 'address': ""})
                }
            });
        }
    });
});


app.post("/api/setContract", (req,res)=>{
    const id = req.body.id;
    const contract_address = req.body.contract_address;
    db.query('DELETE FROM contract WHERE id = ?;' , [id],(err,result)=>{
        if(err){
            console.log(err)
            console.log("delete error")
            res.send({'status': 'fail' })
        }
    });
    db.query('INSERT INTO contract VALUES(?, ?);' , [id, contract_address],(err,result)=>{
        if(err){
            console.log(err)
            console.log("new contract error")
            res.send({'status': 'fail' })
        }
        console.log(result)
        res.send({'status': 'ok'})
    });
})

app.get("/api/getContract", (req,res)=>{
    const id = req.body.id;
    db.query('SELECT contract_address FROM contract WHERE id = ?;' , [id],(err,result)=>{
        if(err){
            console.log(err)
            console.log("get contract error")
            res.send({'status': 'fail'})
        }
        console.log(result)
        res.send({'status': 'ok', 'address':  result[0]["contract_address"]})
    });
})

app.listen(3002, ()=>{
    // console.log(`Server is running on ${PORT}`)
    console.log('Server is running on 3002')
})
