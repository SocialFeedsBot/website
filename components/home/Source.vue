<template>
  <div class="source">
    <img :src="imagePath">
    <h2>
      {{ name }}
    </h2>

    <span v-if="shouldShowNew" class="new">
      new
    </span>
  </div>
</template>

<script lang="ts">
export default {
  props: ['name', 'isNew'],

  computed: {
    imagePath () {
      if (!this.$props.name) {
        return
      }

      return require(`../../assets/services/${this.$props.name.toLowerCase()}.svg`)
    },

    shouldShowNew () {
      return this.$props.isNew !== undefined && this.$props.isNew === ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/_variables.scss";

.source {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1rem;
  background-color: $background;
  border-radius: 0.25rem;

  h2 {
    font-family: $font-family-brand;
    font-size: 1.25rem;
    font-weight: 500;
    margin: 0;
    margin-left: 1rem;
  }

  img {
    width: 2rem;
    height: 2rem;
  }

  .new {
    margin-left: auto;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    background-color: $blurple;
    font-family: $font-family-brand;
    font-weight: 500;
    text-transform: uppercase;
  }
}
</style>
