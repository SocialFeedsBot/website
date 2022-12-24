<template id="switch-button">
  <div class="switch-button-control">
    <div class="switch-button" :class="{ enabled: isEnabled }" style="color: #7289DA" @click="toggle">
      <div class="button" />
    </div>
    <div class="switch-button-label">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: ['isEnabled'],
  methods: {
    toggle () {
      this.$emit('toggle', !this.isEnabled)
    }
  }
}
</script>

<style lang="scss">
.switch-button-control {
  display: flex;
  flex-direction: row;
  align-items: center;

  .switch-button {
    $switch-button-height: 1.4em;
    $switch-button-color: #6F79EE;
    $switch-button-border-thickness: 2px;
    $switch-transition: all 0.2s ease-in-out;
    $switch-is-rounded: true;

    $button-side-length: calc(
      #{$switch-button-height} - (2 * #{$switch-button-border-thickness})
    );

    height: $switch-button-height;
    width: 2.5em;
    border: $switch-button-border-thickness solid $switch-button-color;
    box-shadow: inset 0px 0px $switch-button-border-thickness 0px rgba(0, 0, 0, 0.4);
    border-radius: if($switch-is-rounded, $switch-button-height, 0);

    transition: $switch-transition;

    cursor: pointer;

    .button {
      height: $button-side-length;
      width: $button-side-length;
      border: $switch-button-border-thickness solid $switch-button-color;
      border-radius: if($switch-is-rounded, $button-side-length, 0);
      background: $switch-button-color;

      transition: $switch-transition;
    }

    &.enabled {
      background-color: $switch-button-color;
      box-shadow: none;

      .button {
        background: white;
        transform: translateX(
            calc(#{$button-side-length} + (0.1 * #{$switch-button-border-thickness}))
        );
      }
    }
  }
}

.switch-button-label {
  margin-left: 10px;
}

</style>
