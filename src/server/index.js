const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();

app.use(cors());
require("dotenv").config();
app.use(bodyParser.json());

const getUser = async (accessToken) => {
  const response = await fetch("https://api.linkedin.com/v2/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.json();
};

const registerAnUploadForImages = async (accessToken, userId) => {
  const body = {
    registerUploadRequest: {
      owner: `urn:li:person:${userId}`,
      recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
      serviceRelationships: [
        {
          identifier: "urn:li:userGeneratedContent",
          relationshipType: "OWNER",
        },
      ],
      supportedUploadMechanism: ["SYNCHRONOUS_UPLOAD"],
    },
  };
  const response = await fetch(
    "https://api.linkedin.com/v2/assets?action=registerUpload",
    {
      method: "post",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.json();
};

app.post("/", async (req, res) => {
  const accessToken = "11111111";
  const user = await getUser(accessToken);
  const registeredPicture = await registerAnUploadForImages(
    accessToken,
    user.id
  );
  console.log(registeredPicture);
});

app.get("/registration/link", async (req, res) => {
  res.send(
    `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URL}&scope=r_liteprofile%20w_member_social`
  );
});

app.post("/user/access-token", async (req, res) => {
  const url = `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${req.body.code}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&redirect_uri=${process.env.REDIRECT_URL}`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "x-www-form-urlencoded",
    },
  });

  if (!response.ok) {
    return res.status(403);
  }

  const body = await response.json();
  res.send(body);
});

app.listen(3000);
