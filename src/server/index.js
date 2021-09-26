const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();

app.use(cors());
require("dotenv").config();
app.use(bodyParser.json());
app.use(fileupload());

const getUser = async (accessToken) => {
  try {
    const response = await fetch("https://api.linkedin.com/v2/me", {
      headers: {
        "X-Restli-Protocol-Version": "2.0.0",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (err) {
    console.log(err);
  }
};

const registerImage = async (accessToken, userId) => {
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
    const response = await fetch(
      "https://api.linkedin.com/v2/assets?action=registerUpload",
      config
    );
    return response.json();
  } catch (err) {
    console.log(err);
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
    await fetch(url, config);
  } catch (err) {
    console.log(err);
  }
};

const postCreation = async (registeredPicture, accessToken, userId) => {
  const body = {
    owner: `urn:li:person:${userId}`,
    text: {
      text: "Try to beat my record! http://localhost:8080",
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
    const response = await fetch("https://api.linkedin.com/v2/shares", config);
    await response.json();
  } catch (err) {
    console.log(err);
  }
};

app.get("/registration/link", async (req, res) => {
  res.send(
    `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URL}&scope=r_liteprofile%20w_member_social`
  );
});

app.post("/user/post", async (req, res) => {
  const accessToken = req.query?.access_token;
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

  const user = await getUser(accessToken);
  if (!user) {
    return res.status(403).json();
  }

  const registeredPicture = await registerImage(accessToken, user.id);
  await imageUpload(registeredPicture, accessToken, file);
  await postCreation(registeredPicture, accessToken, user.id);
  res.send();
});

app.get("/user", async (req, res) => {
  const [, accessToken] = req.headers.authorization.split(" ");

  if (!accessToken) {
    return res
      .status(400)
      .json({ message: "Missing access_token in query params" });
  }

  const user = await getUser(accessToken);

  if (!user) {
    return res.status(403).json();
  }

  res.send(user);
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
    return res.status(403).json();
  }

  const body = await response.json();
  res.send(body);
});

app.listen(3000);
