<template>
  <div class="header">
    <div class="content">
      <h1>Feeds directly to your server,<br /> without the hassle.</h1>
      <p>
        Updates from your favourite websites sent directly to your server.
        <br />
        <br />
        SocialFeeds removes the hassle of having to keep up to date across many social media platforms.
      </p>

      <div class="buttons">
        <Button>
          Add the bot
        </Button>
        <Button type="simple-light">
          Read more
        </Button>
      </div>
    </div>
    <img src="~assets/examples/example.png" />
  </div>
</template>

<script>
import Button from '@/components/Button.vue'

export default {
  components: { Button }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/_variables.scss";

.header {
  height: 80vh;
  max-height: 600px;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: center;
  padding: 2rem;

  .content {
    h1 {
      font-family: $font-family-brand;
      font-weight: 600;
    }

    p {
      font-weight: 400;
    }
  }

  img {
    max-width: 25vw;
    height: auto;
  }
}

@media screen and (max-width: 1200px) {
  .header {
    text-align: center;

    img {
      display: none;
    }

    .content {
      padding: 2rem;
      margin: 0 auto;
    }
  }

  .services .sources {
    grid-template-columns: auto;
  }
}
</style>
