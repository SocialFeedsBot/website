<template>
  <transition name="slide" mode="out-in">
    <span v-if="displayNumber % 2 === 0" key="x" v>
      {{ displayNumber.toLocaleString() }}
    </span>
    <span v-else key="y">
      {{ displayNumber.toLocaleString() }}
    </span>
  </transition>
</template>

<script>
export default {

  props: {
    number: { default: 0 }
  },

  data () {
    return {
      displayNumber: 0,
      interval: false
    }
  },

  ready () {
    this.displayNumber = this.number ? this.number : 0
  },

  watch: {
    number () {
      clearInterval(this.interval)

      this.interval = window.setInterval(() => {
        if (this.displayNumber !== this.number) {
          let change = (this.number - this.displayNumber) / 10
          change = change >= 0 ? Math.ceil(change) : Math.floor(change)
          this.displayNumber = this.displayNumber + change
        } else {
          this.displayNumber = this.number
        }
      }, 15)
    }
  }

}
</script>

<style scoped>
.slide-enter {
  top: 10px;
}

.slide-enter-active, .slide-leave-active {
  transition: all .01s;
}

.slide-enter-to {
  top: 0px;
  opacity: 1;
}

.slide-leave {
  top: 0px;
  opacity: 1;
}

.slide-leave-to {
  top: -30px;
  opacity: 0;
  transform: blur(2px);
}
</style>
