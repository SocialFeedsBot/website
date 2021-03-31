<template>
  <b-navbar toggleable="lg" type="dark" variant="dark" sticky>
    <b-img src="@/assets/logo-outline.png" class="navbar-logo" alt="feeds" />
    <b-navbar-brand style="font-weight: 600; font-style: bold;" :to="{ path: '/' }">
      SocialFeeds
    </b-navbar-brand>

    <b-navbar-toggle target="nav-text-collapse" />

    <b-collapse id="nav-text-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item :to="{ name: 'invite' }" exact>
          Invite
        </b-nav-item>
        <b-nav-item :to="{ name: 'support' }" exact>
          Support
        </b-nav-item>
        <b-nav-item :to="{ name: 'status' }" exact>
          Status
        </b-nav-item>
        <b-nav-item :to="{ name: 'faq' }" exact>
          FAQ
        </b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <img v-if="user && !user.id" src="@/assets/loading.gif" width="40px" height="40px" alt="loading">

        <li v-else-if="user" class="nav-item">
          <a href="#" target="_self" class="nav-link p-md-2">
            <b-dropdown right size="sm">
              <template slot="button-content">
                <img class="rounded-circle" width="30" :src="avatarURL">
                <div class="d-inline-block ml-2">{{ user.username }}</div>
              </template>
              <!-- dropdown list -->
              <b-dropdown-item v-if="admin" :to="{ name: 'admin' }">Admin Panel</b-dropdown-item>
              <b-dropdown-item :to="{ name: 'dashboard' }">Servers</b-dropdown-item>
              <b-dropdown-item :to="{ name: 'logout' }">Logout</b-dropdown-item>
            </b-dropdown>
          </a>
        </li>

        <b-nav-item v-else :to="{ name: 'oauth' }">
          Login
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {

  data () {
    return { admin: false }
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
    try {
      const { data } = await this.$axios.get('/gateway/auth')
      if (data.auth) {
        this.admin = true
      }
    } catch (e) {

    }
  }

}
</script>

<style lang="scss">
  .navbar {
    padding: 0px;
    background-color: rgb(23, 24, 27) !important;
  }

  .navbar-brand {
    padding: 0px;
  }

  .navbar-logo {
    height: 56px;
    width: 56px;
    margin-right: 8px;
  }

  .dropdown-toggle {
    background: transparent;
    border: 0px;
  }
  .dropdown-toggle:hover {
    background-color: rgb(39, 41, 46);
  }
  .dropdown-toggle:active {
    background: transparent;
    border: 0;
  }

  .dropdown-menu {
    width: 100%;
    background-color: #16191b;
    border: 0px;
    box-shadow: #111314 0px 2px 2px;
    border-radius: 4px;
    padding: 0;
    margin: 0;
    margin-top: 10px;
  }
  .dropdown-toggle:focus .dropdown-menu {
    transform: translateY(0%);
    transition-delay: 0s, 0s, 0.3s;
  }
  .dropdown-item {
    background-color: transparent;
    color: #fff;
    outline: none;
    padding: 6px 12px;
    font-weight: 300;
  }
  .dropdown-item:hover {
    color: #fff;
    background-color: rgba(15, 15, 15, 0.1);
  }
</style>
