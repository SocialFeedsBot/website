<template>
  <b-modal
    id="remove-feed-modal"
    centered
    title="Removing feed"
    header-class="modal-head"
    body-class="modal-cont"
    footer-class="modal-foot"
    modal-class="modal"
    hide-header-close="true"
  >
    <p>Are you sure you would like to remove this feed?</p>

    <template #modal-footer>
      <b-button class="cbtn cbtn-red" @click="remove()">
        Remove feed
      </b-button>

      <b-button class="cbtn cbtn-dark" @click="close()">
        Cancel
      </b-button>
    </template>
  </b-modal>
</template>

<script>
export default {
  methods: {

    remove () {
      this.$emit('removeFeed')
      this.close()
    },

    close () {
      this.$bvModal.hide('remove-feed-modal')
    }

  }
}
</script>
