const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const cors = require("cors");
const users = require("./UserDB");

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const PORT = process.env.PORT || 5000;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "secret",
};

const strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
  console.log("payload received", jwt_payload);
  const user = users.find((u) => u.id === jwt_payload.id);
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

passport.use(strategy);

const app = express();

app.use(cors());
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "Express is up" });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);

  if (!user) {
    res.status(401).json({ message: "No such user/email ID found" });
    return;
  }

  if (user.password === password) {
    const payload = { id: user.id };
    const token = jwt.sign(payload, jwtOptions.secretOrKey);
    res.json({ message: "OK", token: token });
  } else {
    res.status(401).json({ message: "Passwords did not match" });
  }
});

app.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json("Protected Route");
  }
);

app.listen(PORT, () => console.log(`Listening to port ${PORT}`));
