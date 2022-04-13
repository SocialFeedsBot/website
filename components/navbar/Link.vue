<template>
  <router-link class="nav-link" :to="to">
    <slot></slot>
  </router-link>
</template>

<script>
export default {
  props: ['to']
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/_variables.scss";

.nav-link {
  display: block;
  color: #eee;
  text-decoration: none;

  &:hover {
    color: $font-color-primary;
  }
}
</style>
