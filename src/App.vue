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
    convertingCanvasToFile(canvas) {
      let arr = canvas.toDataURL().split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], "file", { type: mime });
    },
    async sendingImageToServer(file) {
      await fetch("http://localhost:3000", {
        method: "POST",
        body: file,
      });
    },
  },
  async mounted() {
    const canvas = await this.screenshot();
    const file = await this.convertingCanvasToFile(canvas);
    await this.sendingImageToServer(file);
  },
};
</script>
