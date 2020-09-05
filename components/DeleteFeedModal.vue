<template>
  <b-modal id="delete-feed-modal" centered title="DeleteFeed">
    <template v-slot:modal-title>
      Are you sure you want to delete this feed?
    </template>
    <b-button class="mt-3" block @click="remove(feed)">
      Yes
    </b-button>
    <b-button class="mt-3" block @click="$bvModal.hide('delete-feed-modal')">
      No
    </b-button>
  </b-modal>
</template>

<script>
export default {

  props: ['feed']

}
</script>
