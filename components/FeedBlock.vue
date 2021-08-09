<template>
  <b-col sm="10" lg="4" md="6" class="mb-2">
    <div class="block">
      <b-row class="p-2">
        <b-col sm="2" md="2" lg="2">
          <img :src="'' + data.display && data.display.icon ? data.display.icon : '/' + data.type + '.png'" class="feed-icon">
        </b-col>

        <b-col sm="10" md="10" lg="10">
          <h6>{{ data.display && data.display.name ? data.display.name : data.url }}</h6>
          <a class="feed-url" target="_blank" :href="getURL(data)">View website</a>
        </b-col>
      </b-row>

      <b-row class="p-2">
        <b-col sm="12" md="12" lg="12">
          <b-button class="cbtn cbtn-red" @click="remove()">
            <fa icon="trash" style="color: #fff" /> Remove
          </b-button>
          <b-button class="cbtn cbtn-dark" @click="modify()">
            <fa icon="edit" style="color: #fff" /> Modify
          </b-button>
        </b-col>
      </b-row>
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
.block {
  background-color: rgb(23, 24, 27);
  border-radius: 5px;
  border: 0.1px solid black;
}

.feed-icon {
  max-height: 50px;
  max-width: 50px;
  border-radius: 50%;
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
