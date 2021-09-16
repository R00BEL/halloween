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
  methods: {
    screenshot() {
      return html2canvas(this.$refs.shootingSpace);
    },
    convertingCanvasToImage(canvas) {
      const image = new Image();

      image.onload = function () {
        image.src = canvas.toDataURL("image/png");
        image.crossOrigin = "anonymous";
      };

      return image;
    },
    async sendingImageToServer() {
      const res = await fetch("http://localhost:3000");
      const data = await res.json();
      console.log(data);
    },
  },
  async mounted() {
    const canvas = await this.screenshot();
    const image = await this.convertingCanvasToImage(canvas);
    await this.sendingImageToServer(image);
  },
};
</script>
