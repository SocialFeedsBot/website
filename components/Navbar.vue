<template>
  <!--- TODO: mobile responsiveness -->
  <nav>
    <div class="content">
      <router-link :to="{ path: '/' }" style="text-decoration: none; color: inherit;">
        <div class="logo">
          <img src="@/assets/logo-outline.png">
          <span class="brand">SocialFeeds</span>
        </div>
      </router-link>

      <div class="nav-links">
        <NavLink :to="{ path: '/invite' }">
          Invite
        </NavLink>
        <NavLink :to="{ path: '/support' }">
          Support
        </NavLink>
        <NavLink :to="{ path: '/status' }">
          Status
        </NavLink>
        <NavLink :to="{ path: '/faq' }">
          FAQ
        </NavLink>
        <NavLink :to="{ path: '/premium' }" class="premium">
          Premium
        </NavLink>
      </div>
    </div>
    <div class="user">
      <Button v-if="!loaded">
        <img src="@/assets/loading.gif" width="30px" height="30px" alt="loading">
      </Button>

      <!-- <li v-else-if="user" class="nav-item user-dropdown">
        - TODO: Implement a dropdown -
      </li> -->
      <NavLink v-else-if="user" :to="{ path: '/dashboard' }">
        <Button>{{ user.username }}#{{ user.discriminator }}</Button>
      </NavLink>

      <NavLink v-else :to="{ path: '/oauth' }">
        <Button>Login</Button>
      </NavLink>
    </div>
  </nav>
</template>

<script>
import Button from './Button.vue'
import NavLink from './navbar/Link.vue'

export default {
  components: { Button, NavLink },

  data () {
    return { loaded: false, admin: false }
  },

  computed: {
    user () {
      return this.$store.getters['user/user']
    },

    avatarURL () {
      return this.user.avatar
        ? `https://cdn.discordapp.com/avatars/${this.user.id}/${this.user.avatar}.png`
        : `https://cdn.discordapp.com/embed/avatars/${this.user.discriminator % 5}.png`
    }
  },

  async mounted () {
    await this.$store.dispatch('user/GET_USER')
    this.loaded = true
  }

}
</script>

<style lang="scss">
@import "@/assets/css/_variables.scss";

a {
  text-decoration: none;
  color: #fff;
}

nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  background-color: $background-light;

  .content {
    display: flex;
    flex-direction: row;
    align-items: center;

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

    .nav-links {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-left: 2rem;

      &>*:not(:last-child) {
        margin-right: 1.5rem;
      }

      .premium {
        color: $premium;
      }
    }
  }

  .user {
    margin-right: 0.5rem;
  }
}
</style>
