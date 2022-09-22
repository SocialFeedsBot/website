<template>
  <div class="home">
    <div class="lander">
      <div class="content">
        <h1>Thank you for upgrading!</h1>
        <p>
          It may take a couple of minutes to update on our services that your server is now premium.
          For more help and guidance, please join our support server.
          <br><br>
          Thank you for purchasing :)
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
