<template>
  <div class="feed-card col-sm-10 col-md-4 col-lg-4 m-2">
    <div class="row">
      <div class="col-sm-1 col-md-2 col-lg-2">
        <img :src="(feed.display && feed.display.icon && feed.display.icon !== '') ? feed.display.icon : ('/' + feed.type + '.png')" class="feed-icon">
      </div>

      <div class="col-sm-9 col-md-7 col-lg-7">
        <p>{{ (feed.display && feed.display.title && feed.display.title !== '') ? feed.display.title : feed.url }}</p>
      </div>

      <div class="col-sm-2 col-md-3 col-lg-3">
        <p class="active-status" :class="{ active: feed.enabled, inactive: !feed.enabled }">
          {{ feed.enabled ? 'Active' : 'Paused' }}
        </p>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-5 col-md-5 col-lg-5">
        <!-- blank for now-->
      </div>

      <div class="col-sm-7 col-md-7 col-lg-7">
        <a>
          <Button type="small light" data-bs-toggle="modal" data-bs-target="#modify-feed-modal" @click="modify()">
            <font-awesome-icon icon="edit" /> Modify
          </Button>
        </a>

        <a>
          <Button type="small light" @click="toggle()">
            <font-awesome-icon v-if="!isToggling && feed.enabled" icon="toggle-on" />
            <font-awesome-icon v-else-if="!isToggling && !feed.enabled" icon="toggle-off" />
            <img v-else src="@/assets/loading.gif" width="20px" height="20px" alt="loading">
          </Button>
        </a>

        <a :href="getURL(feed)">
          <Button type="small light">
            <font-awesome-icon icon="paperclip" />
          </Button>
        </a>

        <a>
          <Button type="small danger-outline" data-bs-toggle="modal" data-bs-target="#delete-feed-modal" @click="deleteFeed()">
            <font-awesome-icon icon="trash" />
          </Button>
        </a>
      </div>
    </div>
  </div>

  <!--
  BAILEY: old code just for refence

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
  </b-col> -->
</template>

<script>
import Button from '@/components/Button.vue'

export default {
  components: { Button },

  props: ['feed'],

  data () {
    return {
      isToggling: false
    }
  },

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

    deleteFeed () {
      this.$emit('del')
    },

    modify () {
      this.$emit('modify')
    },

    async toggle () {
      this.isToggling = true
      console.log(this.feed)
      try {
        await this.$axios.patch(`/feeds/${this.$route.params.guild_id}`, {
          url: this.feed.url,
          type: this.feed.type,
          webhookID: this.feed.webhookID,
          enabled: !this.feed.enabled,
          options: this.feed.options,
          display: this.feed.display
        })
        this.$emit('update')
      } catch (e) {}

      this.isToggling = false
    }

  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/_variables.scss";

.feed-icon {
  max-height: 40px;
  max-width: 40px;
  border-radius: 50%;
  box-shadow: rgb(20, 22, 27) 1px 1px 1px
}

.feed-url {
  color: #ffffffbb;
  overflow: hidden;
}

.feed-card {
  background: $background-dark;
  border-radius: 4px;
  padding: 10px;
}

.active-status.active {
  color: #9bff5c
}
.active-status.inactive {
  color: #ff5c5c
}
</style>
