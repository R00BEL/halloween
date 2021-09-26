<template>
  <div ref="shootingSpace" style="width: 100%; height: 100%">
    <screenshotOfResults v-if="isUserAuthorized" />
    <img v-else :src="template" style="width: 100%; height: 100%" />
  </div>
</template>

<script>
import screenshotOfResults from "./ScreenshotOfResults";
import template from "../templates/banana.png";
import { Linkedin, Localstorage } from "../constants";
import { createAccessToken, getUser } from "../services/userService";

export default {
  name: "authorizedLinkedin",
  data() {
    return {
      template: template,
      isUserAuthorized: localStorage.getItem(Localstorage.ACCESS_TOKEN),
    };
  },
  components: {
    screenshotOfResults: screenshotOfResults,
  },
  methods: {
    async authorizationRedirect() {
      const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${Linkedin.CLIENT_ID}&redirect_uri=${Linkedin.REDIRECT_URL}&scope=r_liteprofile%20w_member_social`;
      window.location.href = url;
    },
    async checkToken(accessToken) {
      return !!(await getUser(accessToken));
    },
    async getToken(code) {
      const body = await createAccessToken(code);

      if (!body) {
        return;
      }

      localStorage.setItem(Localstorage.ACCESS_TOKEN, body.access_token);
      return body;
    },
  },
  async mounted() {
    const accessToken = localStorage.getItem(Localstorage.ACCESS_TOKEN);
    const isTokenValid = await this.checkToken(accessToken);
    const code = this.$route.query.code;

    if (isTokenValid) {
      this.isUserAuthorized = true;
      return;
    }

    if (!code) {
      return await this.authorizationRedirect();
    }

    await this.getToken(code);
    this.isUserAuthorized = true;
  },
};
</script>
