var express = require('express');
var router = express.Router();

const mysql = require('mysql2');

/* GET document listing. */
router.get('/', function(req, res, next) {
    //res.send('productlines');
    
  
    let sql = `SELECT title, content, createDate FROM documents`;
  
    req.app.locals.con.query(sql, function(err, result) {
      if (err) {
        console.log(err);
      }
      console.log('result', result);
      res.send(result); //Skriv ut
    })
  });

/* POST documents */
router.post('/', (req, res) => {
    console.log('hej'); 

    let title = req.body.title;
    let content = req.body.content;

    let userId = req.body.userId;

    req.app.locals.con.connect((err) => {
        if (err) console.log('err', err);

        let query = "INSERT into documents (title, content, userId) VALUES (?, ?, ?)";
        let values = [title, content, userId];

        req.app.locals.con.query(query, values, (err, data) => {
            if (err) console.log('err', err);

            console.log('documents', data);
            res.json({message: "document sparad"}); 
        })
    })
})

module.exports = router;