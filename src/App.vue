<template>
  <div style="width: 100vw; height: 100vh">
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
    const picture = await html2canvas(document.body);
    console.log(picture);
    const res = await fetch("http://localhost:3000");
    const data = await res.json();
    console.log(data);
  },
};
</script>
