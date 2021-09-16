<template>
  <div style="width: 100vw; height: 100vh" ref="shootingSpace">
    <img :src="template" style="width: 100%; height: 100%" />
  </div>
</template>

<script>
import template from "./templates/banana.png";
import html2canvas from "html2canvas";

export default {
  name: "App",
  data() {
    return {
      template: template,
    };
  },
  async mounted() {
    const canvas = await html2canvas(this.$refs.shootingSpace);
    console.log(canvas);
    const res = await fetch("http://localhost:3000");
    const data = await res.json();
    console.log(data);
  },
};
</script>
