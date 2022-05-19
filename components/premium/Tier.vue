<template>
  <div class="tier">
    <h2>
      {{ name }}
    </h2>

    <slot />
  </div>
</template>

<script>
export default {
  props: ['name']
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/_variables.scss";

.tier {
  padding: 1rem;
  background-color: $background;
  border-radius: 0.25rem;
  height: 210px;
  position: relative;

  h2 {
    font-family: $font-family-brand;
    font-size: 1.25rem;
    font-weight: 500;
    margin: 0;
    margin-left: 1rem;
  }

  button {
    position: absolute;
    bottom: 1rem;
    left: 1rem;
  }

}
</style>
