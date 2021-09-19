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

app.listen(3000);
