<template>
  <div>
    <div class="center p-5">
      <h1>DiscordFeeds</h1>
      <h6>Get your favourite updates posted quickly from a range of supported sites.</h6>
      <h6>Dashboard coming soon.</h6><br>

      <b-button class="blurple">
        Invite Me
      </b-button>
      <b-button class="outline-blurple disabled">
        Dashboard
      </b-button>
    </div>

    <div class="section">
      <b-card text-variant="white" class="m-5 p-6">
        <div class="row no-gutters">
          <div class="col-md-5">
            <img src="@/assets/example.png" class="card-img-top">
          </div>
          <div class="col-md-6">
            <div class="card-body">
              <h5>Reliable and Trustworthy</h5>
              <p>DiscordFeeds will always be online apart from any unexpected circumstances, which means you have 99.9% chance of getting you article. Those are good odds.</p><br><br>

              <h5>Always Online</h5>
              <p>DiscordFeeds has no reason to go offline. If the bot is ever offline, you can do whatever the bot can do via the website and vice versa.</p><br><br>

              <h5>Range of Supported Sites</h5>
              <p>DiscordFeeds supports YouTube channels, Reddit subreddits, Twitch Channels, Twitter Accounts and any website that supports RSS feeds. DiscordFeeds grabs the latest updates and delivers them straight to your server, easy.</p><br>

              <h5>Discord Status Updates</h5>
              <p>DiscordFeeds is now capable of sending Discord incidents to your server. Just so you know if Discords having any issues without having to leave your Discord server.</p>
            </div>
          </div>
        </div>
      </b-card>
    </div>
  </div>
</template>

<style>
.center {
  width: 100%;
  text-align: center;
}

.blurple {
  background: #7289DA;
}
.blurple:hover {
  background: rgb(137, 163, 255);
}

.outline-blurple {
  border-color: #7289DA;
  color: #7289DA;
  background: transparent;
}
.outline-blurple:hover {
  border-color: #7289DA;
  color: #7289DA;
  background: #3f454d;
}

.section {
  height: 550px;
  background: #23272b;
  width: 100%;
}

.card {
  background: transparent;
  border: transparent;
}
.card-body {
  height: 100%;
  text-align: center;
  line-height: 1.2;
  margin-bottom: 0.5rem;
  align-content: center;
}

</style>
