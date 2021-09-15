const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("<h2>Привет Express!</h2>");
});

app.listen(3000);
