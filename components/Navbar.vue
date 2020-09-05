<template>
  <b-navbar type="dark" variant="dark" sticky>
    <b-navbar-brand href="/">
      <b-img src="@/assets/logo.png" class="logo" alt="feeds" />
      DiscordFeeds
    </b-navbar-brand>

    <b-navbar-nav>
      <b-nav-item :to="{ name: 'index' }" exact>
        Home
      </b-nav-item>
      <b-nav-item :to="{ name: 'invite' }" exact>
        Invite
      </b-nav-item>
      <b-nav-item :to="{ name: 'support' }" exact>
        Support
      </b-nav-item>
      <b-nav-item :to="{ name: 'status' }" exact>
        Status
      </b-nav-item>
    </b-navbar-nav>
    <b-navbar-nav class="ml-auto">
      <img v-if="user && !user.id" src="@/assets/loading.svg" width="40px" height="40px" alt="loading">

      <li v-else-if="user" class="nav-item">
        <a href="#" target="_self" class="nav-link p-md-2">
          <b-dropdown right size="sm">
            <template slot="button-content">
              <img class="rounded-circle" width="30" :src="avatarURL">
              <div class="d-inline-block ml-2">{{ user.username }}</div>
            </template>
            <!-- dropdown list -->
            <b-dropdown-item :to="{ name: 'dashboard' }">Servers</b-dropdown-item>
            <b-dropdown-item :to="{ name: 'logout' }">Logout</b-dropdown-item>
          </b-dropdown>
        </a>
      </li>

      <b-nav-item v-else :to="{ name: 'oauth' }">
        Login
      </b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
export default {

  computed: {
    user () {
      return this.$store.getters['user/user']
    },

    avatarURL () {
      return this.user.avatar ? `https://cdn.discordapp.com/avatars/${this.user.id}/${this.user.avatar}.png`
        : `https://cdn.discordapp.com/embed/avatars/${this.user.discriminator % 5}.png`
    }
  },

  async mounted () {
    await this.$store.dispatch('user/GET_USER')
  }

}
</script>

<style>
  .navbar {
    padding: 0px;
    background-color: #292b2f !important;
  }

  .navbar-brand {
    padding: 0px;
  }

  .logo {
    height: 56px;
    width: 56px;
  }

  .btn {
    background: transparent;
    border: 0px;
  }

  .dropdown-menu {
    width: 100%;
    background-color: #23272b;
    border: 0.5px solid #111214;
    border-radius: 1px;
    padding: 0;
    margin: 0;
  }
  .dropdown-item {
    background-color: transparent;
    color: #fff;
    outline: none;
    padding: 6px 12px
  }
  .dropdown-item:hover {
    color: #fff;
    background-color: rgba(0,0,0,.1);
  }
</style>
