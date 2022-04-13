<template>
  <button class="button">
    <slot></slot>
  </button>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
@import "@/assets/css/_variables.scss";

.button {
    padding: 0.75rem 1.5rem;
    border: none;
    background-color: $blurple;
    border-radius: 0.5rem;

    font-family: $font-family-brand;
    font-weight: 600;
    font-size: 1rem;
    color: #fff;
}
</style>
