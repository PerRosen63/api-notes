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
    })
});

/* POST login user. */
router.post('/login/', function(req, res, next) {
  
  let postedUser = req.body.userName;
  console.log('posted user', postedUser);
  let postedPass = req.body.password;
  console.log('posted pass', postedPass);
  
  let sql = `SELECT * FROM users`;
   
  req.app.locals.con.query(sql, function(err, data) {
    if (err) {
      console.log(err);
    }

    for (user in data) {

        //dekryptering
        const kryptPass = data[user].password;
        let passOrig = CryptoJS.AES.decrypt(kryptPass, saltnyckel).toString(CryptoJS.enc.Utf8);
        
      if (postedUser === data[user].userName && postedPass === passOrig) {
        console.log('hittade', data[user].userName + passOrig);
        res.json(data[user].id);
        return;
      }
    }
    console.log('fel');
    res.status(401).json({message: 'Fel email eller password!'});
          
    })
});


/* POST users */
router.post('/', (req, res) => {
  console.log('post users'); 

  let userName = req.body.userName;
  let password = req.body.password;
 
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
