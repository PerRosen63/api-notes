var express = require('express');
var router = express.Router();

const mysql = require('mysql2');

/* GET users listing. */
router.get('/', function(req, res, next) {

  let sql = `SELECT id, userName, password FROM users`;
  
    req.app.locals.con.query(sql, function(err, result) {
      if (err) {
        console.log(err);
      }
      console.log('result', result);
      res.send(result); //Skriv ut
    })
});

module.exports = router;
