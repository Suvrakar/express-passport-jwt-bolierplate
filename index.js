const _ = require('lodash');
const express = require('express') ;
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const passport = require('passport');
const passportJWT = require("passport-jwt");

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const PORT = process.env.PORT || 5000;
const users = [
    {
        id: 1,
        name: 'suvra',
        email: 'kar.suvra@gmail.com',
        password: '12346'
    },
];


const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'secret';

const strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    console.log('payload received', jwt_payload);
    var user = users[_.findIndex(users, {id: jwt_payload.id})];
    if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
});
passport.use(strategy);

const app = express();

app.use(passport.initialize());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.get('/', (req, res) => {

    res.json({"message":"Express is up"});
});

// Login route - here we will generate the token - copy the token generated in the input
app.post("/login", function(req, res) {
    if(req.body.email && req.body.password){
      var email = req.body.email;
      var password = req.body.password;
    }
    // usually this would be a database call:
    var user = users[_.findIndex(users, {email: email})];
    if( ! user ){
      res.status(401).json({message:"no such user/email id found"});
    }
  
    if(user.password === password) {
      // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
      var payload = {id: user.id};
      var token = jwt.sign(payload, jwtOptions.secretOrKey);
      res.json({message: "ok", token: token});
    } else {
      res.status(401).json({message:"passwords did not match"});
    }
  });

  // now there can be as many route you want that must have the token to run, otherwise will show unauhorized access. Will show success 
  // when token auth is successfilly passed.
  app.get("/secret", passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json("Success! You can not see this without a token");
  });
  

// server 
app.listen(PORT, () => console.log(`Listening to port ${PORT}`));
