<template>
  <button :class="classes" :to="to">
    <slot />
  </button>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['type', 'to'],

  computed: {
    classes () {
      return `button ${this.$props.type || ''}`
    }
  }
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

  &.simple-dark {
    background-color: $background;
  }

  &.simple-light {
    background-color: $background-light;
  }

  &:hover {
    cursor: pointer;
  }
}
</style>
