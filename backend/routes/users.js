var express = require('express');
var router = express.Router();
const CryptoJS = require('crypto-js');

const mysql = require('mysql2');

const saltnyckel = 'saltnyckel';

/* GET users listing. */
router.get('/', function(req, res, next) { 

  
  let sql = `SELECT id, userName, password FROM users`;
  let password = `SELECT password FROM users`;
  
  req.app.locals.con.query(sql, function(err, data) {
    if (err) {
      console.log(err);
    }
    console.log('data', data); 
    //res.send(data); //Skriv ut
    res.json(data);
    
    console.log(password); 

      /* const kryptPass = data.password; 
      const origPass = CryptoJS.AES.decrypt(kryptPass, saltnyckel).toString(CryptoJS.enc.Utf8);
      console.log('dekrypterat', origPass); */

    })
});

/* POST login user. */
router.post('/login', function(req, res, next) {
  
  let id = req.body.id;
  console.log('userId', id);
  
  let sql = `SELECT password FROM users WHERE id = ?`;
  let values = [id];

  //const password = CryptoJS.AES.decrypt(password, saltnyckel).toString(CryptoJS.enc.Utf8);

  
  req.app.locals.con.query(sql, values, function(err, data) {
    if (err) {
      console.log(err);
    }
    console.log('data', data); 
  
    //const val = Object.values(data);
    //res.json({password});
    

    })
});



/* POST users */
router.post('/', (req, res) => {
  console.log('post users'); 

  let userName = req.body.userName;
  let password = req.body.password;

  //const password = 'Mittpw'; 
  console.log(password); 

  const kryptPass = CryptoJS.AES.encrypt(password, saltnyckel).toString();
  console.log('kryptPass', kryptPass);


  req.app.locals.con.connect((err) => {
      if (err) console.log('err', err);

      let query = "INSERT into users (userName, password) VALUES (?, ?)";
      let values = [userName, kryptPass];

      req.app.locals.con.query(query, values, (err, data) => {
          if (err) console.log('err', err);

          console.log('users', data);
          res.json({message: "user sparad"}); 
      })
  })
})

module.exports = router;
