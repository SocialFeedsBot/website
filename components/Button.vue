<template>
  <button :class="classes" :to="to" @click="handleClick">
    <slot />
  </button>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['type', 'to', 'link', 'page', 'arialabel'],

  computed: {
    classes () {
      return `button ${this.$props.type || ''}`
    }
  },

  methods: {
    handleClick () {
      this.$emit('click')
      if (this.$props.link) {
        window.location = this.$props.link
      } else if (this.$props.page) {
        this.$router.push({ name: this.$props.page })
      }
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
  border-radius: 5px;

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

  &.small {
    padding: 0.25rem 0.4rem;
    font-weight: 250;
    font-size: 0.85rem;
  }

  &.light {
    background-color: $background-lighter;
  }

  &.success {
    background-color: $background-success;
  }

  &.warn {
    background-color: $premium;
  }

  &.danger {
    background-color: $background-danger;
  }

  &.danger-outline {
    border: 1px solid $background-danger;
    background: $background-light;
  }

  &:hover {
    cursor: pointer;
  }
}
</style>
