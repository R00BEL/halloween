const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");
const wrapperFetch = require("./utils/wrapperFetch");

const app = express();

app.use(cors());
require("dotenv").config();
app.use(bodyParser.json());
app.use(fileupload());

const getUser = async (accessToken) => {
  const url = "https://api.linkedin.com/v2/me";

  const config = {
    headers: {
      "X-Restli-Protocol-Version": "2.0.0",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    return wrapperFetch(url, config);
  } catch (err) {
    console.error(err);
    throw { code: err.code, message: err.message };
  }
};

const registerImage = async (accessToken, userId) => {
  const url = "https://api.linkedin.com/v2/assets?action=registerUpload";

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

  const config = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  };

  try {
    return wrapperFetch(url, config);
  } catch (err) {
    console.error(err);
    throw { code: err.code, message: err.message };
  }
};

const imageUpload = async (registeredPicture, accessToken, file) => {
  const url =
    registeredPicture.value.uploadMechanism[
      "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
    ].uploadUrl;

  const config = {
    method: "put",
    headers: {
      "Content-Type": "application/octet-stream",
      "X-Restli-Protocol-Version": "2.0.0",
      Authorization: `Bearer ${accessToken}`,
    },
    body: file.data,
  };

  try {
    await wrapperFetch(url, config, false);
  } catch (err) {
    console.error(err);
    throw { code: err.code, message: err.message };
  }
};

const postCreation = async (registeredPicture, accessToken, userId) => {
  const url = "https://api.linkedin.com/v2/shares";

  const body = {
    owner: `urn:li:person:${userId}`,
    text: {
      text: "Try to beat my record! https://www.example.com/content.html",
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

  const config = {
    method: "post",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  };

  try {
    await wrapperFetch(url, config, false);
  } catch (err) {
    console.error(err);
    throw { code: err.code, message: err.message };
  }
};

app.post("/user/post", async (req, res) => {
  const [, accessToken] = req.headers.authorization.split(" ");
  const file = req.files?.file;

  if (!accessToken) {
    return res
      .status(400)
      .json({ message: "Missing access_token in query params" });
  }

  if (!file) {
    return res.status(400).json({
      message:
        "A file must be attached to the request. The file must be in the field 'file'",
    });
  }

  try {
    const user = await getUser(accessToken);
    if (!user) {
      return res.status(403).json();
    }

    const registeredPicture = await registerImage(accessToken, user.id);
    await imageUpload(registeredPicture, accessToken, file);
    await postCreation(registeredPicture, accessToken, user.id);
    res.send();
  } catch (err) {
    return res.status(500).json(err);
  }
});

app.get("/user", async (req, res) => {
  const [, accessToken] = req.headers.authorization.split(" ");

  try {
    const user = await getUser(accessToken);
    res.send(user);
  } catch (err) {
    err.code === 401 ? res.status(401).json() : res.status(500).json();
  }
});

app.post("/user/access-token", async (req, res) => {
  const url = `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${req.body.code}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&redirect_uri=${process.env.REDIRECT_URL}`;
  const config = {
    method: "post",
    headers: {
      "Content-Type": "x-www-form-urlencoded",
    },
  };

  try {
    const body = await wrapperFetch(url, config);
    res.send(body);
  } catch (err) {
    err.code === 401 ? res.status(401).json() : res.status(500).json();
  }
});

app.listen(3000);
