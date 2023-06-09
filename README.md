# Authentication-with-Passport-JS-and-JWT

Here we will be using Express dependency of Node JS. We are creating token using JWT Package and Authorizing it using Passport JS

## Installation
1. First install Express and some packages related with token and auth i.e. jwt, lodash, passport, etc

<br>a. npm init -y
<br>b. npm install --save express body-parser passport passport-jwt jsonwebtoken lodas

## Snippets
1. Including basic packages:
```
var _ = require('lodash');
var express = require('express') ;
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

var passport = require('passport');
var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

```

2. Adding data - later on you can check the data from database(mongo db or sql):
```
// array for data login
var users = [
    {
        id: 1,
        name: 'amir',
        email: 'amirengg15@gmail.com',
        password: '1234'
    },
    {
        id: 2,
        name: 'dharmendra',
        email: 'dharmendra@gmail.com',
        password: '1111'
    }
];

```

3. Next steps are strategy to include authentication:

```
// strategy for using web token authentication
var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'tasmanianDevil';

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    console.log('payload received', jwt_payload);
    // usually this would be a database call:
    var user = users[_.findIndex(users, {id: jwt_payload.id})];     // checking into are user array using loaddash array search
    if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
});
passport.use(strategy);

```

4. Invoking express and using passport middleware. In addition to that including Postman's url-encoded and json middleware to accept data from postman

```
var app = express();
app.use(passport.initialize());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));

// parse application/json
app.use(bodyParser.json());

```

5. Routes handeling - login route will create token. Copy the token and use that token in other routes that needs authorization (here secret route). Along with the url pass <br>
Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTUzNDEyODQyfQ.2L6V3KrwSIs1vRuLOY9yHg5vwGFkvXDxbWE0sXRfB-A <br>
where second part after bearer is your token generated.<br>

```
app.get('/', (req, res) => {
    res.json({"message":"Express is up"});
});

// Login route - here we will generate the token - copy the token generated in the input
app.post("/login", function(req, res) {
    if(req.body.email && req.body.password){
      // var name = req.body.name;
      var email = req.body.email;
      var password = req.body.password;
    }
    // usually this would be a database call:
    var user = users[_.findIndex(users, {email: email})];
    if( ! user ){
      res.status(401).json({message:"no such user/email id found"});
    }
  
    if(user.password === req.body.password) {
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
app.listen(5000, () => console.log('Listening to port 5000'));


```

6. Now try login using both the user i.e. amir and dharmendra. I have kept both the password as plain for testing. You can use bcrypt or other similar standards

7. You can pass data in either of the formats i.e. url-encoded under body by providing key value pair or you can pass json text as shown in the below screenshots as json data. I am passing email and password.

8. I have attached my postman's collection files for request checking



## Screenshots

![Screenshot of Passport jwt auth](https://user-images.githubusercontent.com/15896579/54878109-0c29ea80-4e4e-11e9-9b79-2e7e8d546a1c.PNG?raw=true "Screenshot of Passport jwt auth")

![Screenshot of Passport jwt auth](https://user-images.githubusercontent.com/15896579/54878111-10ee9e80-4e4e-11e9-8767-346650c1653b.PNG?raw=true "Screenshot of Passport jwt auth")

![Screenshot of Passport jwt auth](https://user-images.githubusercontent.com/15896579/54878112-13e98f00-4e4e-11e9-9e3d-6165d1484acc.PNG?raw=true "Screenshot of Passport jwt auth")

![Screenshot of Passport jwt auth](https://user-images.githubusercontent.com/15896579/54878114-1946d980-4e4e-11e9-9370-7ace46d2bdbb.PNG?raw=true "Screenshot of Passport jwt auth")

![Screenshot of Passport jwt auth](https://user-images.githubusercontent.com/15896579/54878115-1cda6080-4e4e-11e9-8c60-59efc648dbd4.PNG?raw=true "Screenshot of Passport jwt auth")

![Screenshot of Passport jwt auth](https://user-images.githubusercontent.com/15896579/54878118-21067e00-4e4e-11e9-8844-93c1820c2b31.PNG?raw=true "Screenshot of Passport jwt auth")
