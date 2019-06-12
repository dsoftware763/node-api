var express = require('express');
var router = express.Router();
const {OAuth2Client} = require('google-auth-library');
var User = require('../models').User
/* GET home page. */
router.get('/verify/:token', function(req, res, next) {
  console.log('here')
  const client = new OAuth2Client('676178801663-teavt9iirg759gfhald7an2god23pmme.apps.googleusercontent.com');
  async function verify() {
    const ticket = await client.verifyIdToken({
        idToken: req.params.token,
        audience: "676178801663-teavt9iirg759gfhald7an2god23pmme.apps.googleusercontent.com",  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    if(userid) {
      User
      .findOne({where: {googleId: userid}})
      .then(user => {
        if(user) {
          res.json({status: "success", user})
        } else {
          User.create({
            name: payload['name'],
            email: payload['email'],
            googleId: userid,
            password: "12345"
          }).then(newUser => {
            if(newUser){
              res.json({status: "success", user: newUser})
            } else {
              res.json({status: "failed", msg: "Something went wrong!"})
            }
            
          })
        }
      })
     } else {
      res.json({status: "failed", msg: "Something went wrong!"})
     }
  }
  verify().catch(console.error);
})

router.post('/login', async function (req, res, next) {
  const { username, password } = req.body;
 // console.log(password, 'vdf')
  // if the username / password is missing, we use status code 400
  // indicating a bad request was made and send back a message
  if (!username || !password) {
    
    return res.status(400).json({
      status: "failed",
      msg: "Request missing username or password param"
    }
    );
  }

  try {
    let user = await User.authenticate(username, password)
    return res.json({status: "success", user});

  } catch (err) {
    console.log(err)
    return res.status(400).json({status: "failed", msg: 'invalid username or password'});
  }

})

router.post('/reset-password', function(req, res, next) {
  console.log('hwe',req.body)
const password  = req.body.password;
const userId = req.body.userid
console.log('userId',userId)
  User
  .findOne({where: {id: userId}})
  .then(user => {
    console.log('sg',user)
    if(user) {
    user.update({password :password}).then((updated_user) => {
      // title will now be 'foooo' but description is the very same as before
      res.json({status: "update_success", user: updated_user})
     })
    } else {
      res.json({status: "user doesnot exists"})
    }
  })

  res.json({a: "dfd"})
})


module.exports = router;
