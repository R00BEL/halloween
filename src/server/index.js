const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const fs = require("fs");
const path = require("path");

var axios = require("axios");

const app = express();

app.use(cors());
require("dotenv").config();
app.use(bodyParser.json());
app.use(fileupload());

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

const imageUpload = async (registeredPicture, accessToken, file) => {
  var config = {
    method: "put",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data: file.data,
  };

  console.log(registeredPicture);

  try {
    const response = await fetch(
      registeredPicture.value.uploadMechanism[
        "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
      ].uploadUrl,
      config
    );
    console.log(response);
  } catch (err) {
    console.log(err);
  }
};

const postCreation = async (registeredPicture, accessToken) => {
  const body = {
    owner: "urn:li:person:i5b4G5t0ea",
    text: {
      text: "http://localhost:8080",
    },
    subject: "Test Share Subject",
    distribution: {
      linkedInDistributionTarget: {},
    },
    content: {
      contentEntities: [
        {
          entity: `${registeredPicture.value.asset}`,
        },
      ],
      title: "Test Share with Content title",
      shareMediaCategory: "IMAGE",
    },
  };
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  axios({
    url: "https://api.linkedin.com/v2/shares",
    method: "post",
    data: body,
    headers: headers,
  })
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};

app.post("/", async (req, res) => {
  const accessToken = req.query.access_token;
  console.log(req.files.file);
  const user = await getUser(accessToken);
  console.log(user);
  const registeredPicture = await registerAnUploadForImages(
    accessToken,
    user.id
  );
  await imageUpload(registeredPicture, accessToken, req.files.file);
  // await postCreation(registeredPicture, accessToken);
  res.send();
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
