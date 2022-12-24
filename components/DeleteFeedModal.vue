<template>
  <div
    id="delete-feed-modal"
    class="modal"
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body">
          <p>Are you sure you would like to remove this feed?</p>
        </div>
        <div class="modal-footer">
          <a data-bs-dismiss="modal" aria-label="Close">
            <Button class=" danger" @click="remove()">
              Remove Feed
            </Button>
          </a>
          <a data-bs-dismiss="modal" aria-label="Close">
            <Button class=" light">
              Cancel
            </Button>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button.vue'

export default {
  props: ['feed'],
  components: { Button },

  methods: {

    remove () {
      this.$emit('del')
    }

  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/_variables.scss";

  .modal-content {
    background-color: $background-dark;
  }

  .modal-header, .modal-footer {
    border-bottom: 0;
    border-top: 0;
  }

  .modal {
    transform: scale(0.9);
    opacity: 0;
    -webkit-transition: all .15s ease-out;
    -o-transition: all .15s ease-out;
    transition: all .15s ease-out;
  }
  .modal.show {
    opacity: 1;
    transform: scale(1);
  }
</style>
