<template>
  <footer>
    <div class="header">
      <div class="logo">
          <img src="@/assets/logo-outline.png" />
          <span class="brand">SocialFeeds</span>
      </div>
      <div class="buttons">
        <Button type="simple-light"> Join the support server </Button>
        <Button> Add the bot </Button>
      </div>
    </div>

    <div class="content">
        <div class="links">
          <div>
            <router-link :to="{ path: '/dashboard' }" v-if="user">
              Dashboard
            </router-link>
            <router-link :to="{ path: '/login' }" v-else>
              Login
            </router-link>
            <router-link :to="{ path: '/privacy' }">
              Privacy Policy
            </router-link>
            <router-link :to="{ path: '/tos' }">
              Terms of Service
            </router-link>
          </div>
          <div>
            <router-link :to="{ path: '/premium', query: { 'ref': 'footer' } }" class="premium">
              Premium
            </router-link>
            <router-link :to="{ path: '/tos' }">
              Support
            </router-link>
            <router-link :to="{ path: '/status'}">
              Status
            </router-link>
          </div>
        </div>
        <div class="maintenance" v-if="message">
          <div class="header">
            <span :class="`status ${message.status}`" />
            <h2>{{ message.head }}</h2>
          </div>

          <p>
            {{ message.body }}
          </p>
        </div>
    </div>
  </footer>
</template>

<script>
import Button from '@/components/Button.vue'

export default {
  components: { Button },

  computed: {
    user () {
      return this.$store.getters['user/user']
    },
    message () {
      return this.$store.getters['stats/outageMessage']
    }
  },

  async mounted () {
    await this.$store.dispatch('stats/GET_STATUS_MESSAGE')
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/variables";

footer {
  padding: 1rem;
  border-top: 0.25rem solid $background-light; // if the background isn't light on top
}

.header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  .logo {
    display: flex;
    flex-direction: row;
    align-items: center;

    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    font-size: 1.5rem;

    img {
        width: 4rem;
        height: 4rem;
    }
  }
}

.content {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  margin: 1rem 0rem;

  .links {
    display: flex;
    flex-direction: row;

    & > * {
      margin-right: 2rem;
    }

    div {
      display: flex;
      flex-direction: column;
      padding: 1rem;

      & > *:not(:last-child) {
        margin-bottom: 1rem;
      }
    }
  }

  .premium {
    color: $premium;
  }
}

.maintenance {
  flex: 1;
  max-width: 60%;

  background-color: $background-light;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-left: 2rem;

  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-family: $font-family-brand;
    justify-content: flex-start;
    margin-bottom: 1rem;

    h2 {
      margin: 0;
      margin-left: 0.75rem;
      font-size: 1.25rem;
    }

    .status {
      width: 1rem;
      height: 1rem;
      border-radius: 1rem;
      background-color: #fff;

      &.ok {
        background-color: #5cff5c;
      }

      &.warn {
        background-color: #ffb85c;
      }

      &.major {
        background-color: #ff645c;
      }
    }
  }

  p {
    margin: 0;
  }
}
</style>
