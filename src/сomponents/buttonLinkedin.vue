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
};
</script>
