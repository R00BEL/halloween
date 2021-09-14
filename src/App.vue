<template>
  <div style="width: 100vw; height: 100vh">
    <img :src="template" style="width: 100%; height: 100%" />
  </div>
</template>

<script>
import template from "./templates/banana.png";
export default {
  name: "App",
  data() {
    return {
      template: template,
    };
  },
};
</script>
