<template>
  <div class="home">
    <div class="lander">
      <div class="content">
        <h1>We're sorry you didn't upgrade..</h1>
        <p>
          If there was an issue with our services, you can always speak to us through our support server.
          <br><br>
          Not all bad! You can still use our free services as long as you do not mind our limited a feed amount and advertisements.
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import "@/assets/css/_variables.scss";

  .home {
    & > *:nth-child(2n) {
      background-color: $background-light;
    }
  }

  .lander {
    height: 80vh;
    display: flex;
    flex-direction: row;
    align-items: center;

    .content {
      padding: 10rem;

      h1 {
        font-family: $font-family-brand;
        font-weight: 600;
      }

      p {
        font-weight: 400;
      }
    }

    img {
      width: 25rem;
      height: auto;
    }
  }

</style>
