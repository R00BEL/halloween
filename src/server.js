const express = require("express");
const cors = require("cors");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();

app.use(cors());

const getUser = async (accessToken) => {
  const response = await fetch("https://api.linkedin.com/v2/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.json();
};

app.post("/", async (req, res) => {
  const accessToken = "1111111111";
  const user = await getUser(accessToken);
  console.log(user.id);
});

app.listen(3000);
