var express = require('express');
var router = express.Router();

const mysql = require('mysql2');

/* GET document listing. */
router.get('/', function(req, res, next) {
    //res.send('productlines');
    
  
    let sql = `SELECT documentId, title, content, createDate, userId FROM documents`;
  
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

/* PATCH documents */
router.patch('/:documentId', (req, res) => {
  let documentId = req.params.documentId;
  console.log('hej patch'); 

  let title = req.body.title;
  let content = req.body.content;

  //let documentId = req.body.documentId;
  console.log(documentId);

  req.app.locals.con.connect((err) => {
      if (err) console.log('err', err);

      let query = "UPDATE documents SET title = ?, content = ? WHERE documentId = ?";
      let values = [title, content, documentId];

      req.app.locals.con.query(query, values, (err, data) => {
          if (err) console.log('err', err);

          console.log('documents', data);
          res.json({message: "document ändrat"}); 
      })
  })
})

/* DELETE document */
router.delete('/', (req, res) => {
  console.log('hej delete'); 

  let documentId = req.body.documentId;
  console.log(documentId);

  req.app.locals.con.connect((err) => {
      if (err) console.log('err', err);

      let query = "DELETE FROM documents WHERE documentId = ?";
      let values = [documentId];

      req.app.locals.con.query(query, values, (err, data) => {
          if (err) console.log('err', err);

          console.log('documents', data);
          res.json({message: "document raderat"}); 
      })
  })
})

module.exports = router;