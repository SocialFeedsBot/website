<template>
  <b-col sm="10" lg="4" md="6" class="mb-2">
    <div class="block">
      <b-row class="p-1">
        <b-col sm="2" md="2" lg="2">
          <img :src="(data.display && data.display.icon) ? data.display.icon : ('/' + data.type + '.png')" class="feed-icon">
        </b-col>

        <b-col sm="10" md="10" lg="10">
          <h6 class="text-truncate mt-2">
            {{ (data.display && data.display.name) ? data.display.name : data.url }}
          </h6>
        </b-col>
      </b-row>

      <div class="p-1">
        <b-button class="cbtn cbtn-small cbtn-dark ml-2 mr-2" target="_blank" :href="getURL(data)">
          <fa :icon="['fas', 'link']" style="color: #fff" /> Website
        </b-button>
        <b-button class="cbtn cbtn-small cbtn-dark mr-2" @click="modify()">
          <fa icon="edit" style="color: #fff" /> Modify
        </b-button>
        <b-button class="cbtn cbtn-small cbtn-red" @click="remove()">
          <fa icon="trash" style="color: #fff" /> Remove
        </b-button>
      </div>
    </div>
  </b-col>
</template>

<script>
export default {
  props: ['data'],

  methods: {
    getURL ({ type, url }) {
      if (type === 'youtube') {
        return `https://youtube.com/channel/${url}`
      } else if (type === 'twitter') {
        return `https://twitter.com/${url}`
      } else if (type === 'twitch') {
        return `https://twitch.tv/${url}`
      } else if (type === 'statuspage') {
        return new URL(url).origin
      } else if (type === 'reddit') {
        return `https://reddit.com/r/${url}`
      } else if (type === 'rss') {
        return url
      }
    },

    remove () {
      this.$emit('setPrompt')
    },

    modify () {
      this.$emit('setModify')
    }
  }

}
</script>
<style scoped>

.feed-icon {
  max-height: 40px;
  max-width: 40px;
  border-radius: 50%;
  box-shadow: rgb(20, 22, 27) 1px 1px 1px
}

.feed-url {
  font-size: 12px;
  color: #ffffffbb;
  flex-wrap: wrap;
  display: flex;
  overflow: hidden;
  width: 100%;
}
</style>>
