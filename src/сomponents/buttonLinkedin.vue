<template>
  <button @click="clickOnButton">Post to Linkedin</button>
</template>

<script>
export default {
  name: "buttonLinkedin",
  methods: {
    async clickOnButton() {
      const res = await fetch("http://localhost:3000/registration/link");
      window.location.href = await res.text();
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
    localStorage.setItem("access-token", body.access_token);
    window.location.href = "/screenshot-of-results";
  },
};
</script>
