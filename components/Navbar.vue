<template>
  <b-navbar type="dark" variant="dark" sticky="true">
    <b-navbar-brand href="#">
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
  </b-navbar>
</template>

<style>
  .navbar {
    padding: 0px;
  }

  .navbar-brand {
    padding: 0px;
  }

  .logo {
    height: 56px;
    width: 56px;
  }
</style>
