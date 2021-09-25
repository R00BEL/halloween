<template>
  <button @click="clickOnButton">Post to Linkedin</button>
</template>

<script>
import { Localstorage } from "@/constants/localstorage";
import router, { routesName } from "@/router";

export default {
  name: "buttonLinkedin",
  methods: {
    async clickOnButton() {
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
  },
  async mounted() {
    const code = this.$route.query.code;
    if (!code) {
      return;
    }

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
    await router.push({ name: routesName.SCREENSHOT_OF_RESULTS });
  },
};
</script>
