<template>
  <div ref="shootingSpace" style="width: 100%; height: 100%">
    <screenshotOfResults v-if="isUserAuthorized" />
    <img v-else :src="template" style="width: 100%; height: 100%" />
  </div>
</template>

<script>
import { Localstorage } from "@/constants/localstorage";
import screenshotOfResults from "./ScreenshotOfResults";
import template from "../templates/banana.png";

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
      const res = await fetch("http://localhost:3000/registration/link");
      window.location.href = await res.text();
    },
    async checkToken(accessToken) {
      const res = await fetch("http://localhost:3000/user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return res.ok;
    },
    async getToken(code) {
      const res = await fetch("http://localhost:3000/user/access-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      if (!res.ok) {
        return;
      }

      const body = await res.json();
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
