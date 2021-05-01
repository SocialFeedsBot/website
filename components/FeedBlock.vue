<template>
  <b-col md="6">
    <div class="block">
      <div class="flex">
        <div class="flex">
          <div class="icon-wrapper">
            <img :src="'/' + data.type + '.png'" class="feed-icon">
          </div>
          <div class="flex" style="flex-direction: column;">
            <h3 class="feed-name">
              {{ data.url }} <strong v-if="data.type === 'twitter'">{{ data.options.replies ? '(with replies)' : '' }}</strong>
            </h3>
            <div class="flex">
              <div class="feed-details">
                <div class="feed-url">
                  {{ getURL(data) }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex" style="flex: 0 0 auto; justify-content: flex-end;">
          <b-button class="feed-button-delete" @click="remove()">
            <div class="feed-delete">
              <fa icon="trash" style="color: #fff" />
            </div>
          </b-button>
        </div>
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
    }
  }

}
</script>
<style>
.block {
  padding: 20px 16px;
  margin-bottom: 16px;
  border-color: #000000;
  background-color: rgba(32,34,37,0.3);
  position: relative;
  border-width: 1px;
  border-style: solid;
  border-radius: 5px;
  box-sizing: border-box;
  width: 100%;
}

.flex {
  line-height: 1;
  user-select: none;
  text-rendering: optimizeLegibility;
  margin: 0;
  padding: 0;
  border: 0;
  font-weight: inherit;
  font-style: inherit;
  font-family: inherit;
  font-size: 100%;
  vertical-align: baseline;
  outline: 0;
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: nowrap;
  flex-direction: row;
  box-sizing: border-box;
  flex: 1 1 auto;
}

.feed-name {
  user-select: none;
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 16px;
  line-height: 20px;
  box-sizing: border-box;
  word-break: break-word;
  font-weight: 500;
  vertical-align: baseline;
  flex-direction: row;
}
.feed-icon {
  width: 50px !important;
  height: 50px !important;
  border-radius: 50%
}
.icon-wrapper {
  border-radius: 50%;
  width: 75px;
  height: 50px;
}
.feed-button-delete {
  border: transparent;
  background: #f54242;
}
.feed-button-delete:hover {
  border: transparent;
  color: #c91b1b;
}
.feed-button-delete:hover {
  background: #f23030
}
.feed-url {
  font-size: 12px;
  color: #ffffffbb;
  flex-wrap: wrap;
  display: flex;
}
.feed-details {
  line-height: 1;
  user-select: none;
  text-rendering: optimizeLegibility;
  margin: 0;
  padding: 0;
  border: 0;
  font-weight: inherit;
  font-style: inherit;
  font-family: inherit;
  font-size: 100%;
  vertical-align: baseline;
  outline: 0;
  box-sizing: border-box;
  display: flex;
  flex-grow: 0;
  justify-content: flex-start;
  margin-top: 8px;
  -webkit-user-select: all;
  -moz-user-select: all;
  -ms-user-select: all;
  user-select: all;
}

</style>
