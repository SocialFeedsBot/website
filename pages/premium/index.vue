<template>
  <div class="home">
    <div class="lander">
      <div class="content">
        <h1>Upgrade your server!</h1>
        <p>
          Choose from a variety of tiers to boost up your server.
          <br><br>
          We have tiers that are best suited for you. Choose the best one and setup your subscription!
        </p>
      </div>
    </div>

    <div class="tiers">
      <h1>Select a tier that suits you<span class="fullstop">.</span></h1>
      <p>
        We aim to charge little but enough to keep us posting to your servers. Select one that best matches your servers needs.
      </p>

      <div class="tierlist">
        <Tier name="Tier 1">
          <ul>
            <li>60 max feed capacity.</li>
            <li>No advertisements.</li>
          </ul>

          <Button v-if="user">
            Upgrade now!
          </Button>
          <Button v-else>
            Login to upgrade
          </Button>
        </Tier>

        <Tier name="Tier 2">
          <ul>
            <li>150 max feed capacity.</li>
            <li>Change the avatar and username of webhooks.</li>
            <li>No advertisements.</li>
          </ul>

          <Button v-if="user">
            Upgrade now!
          </Button>
          <Button v-else>
            Login to upgrade
          </Button>
        </Tier>

        <Tier name="Tier 3">
          <ul>
            <li>300 max feed capacity.</li>
            <li>Change the avatar and username of webhooks.</li>
            <li>No advertisements.</li>
          </ul>

          <Button v-if="user">
            Upgrade now!
          </Button>
          <Button v-else>
            Login to upgrade
          </Button>
        </Tier>

        <Tier name="Tier 4">
          <ul>
            <li>No max feed capacity.</li>
            <li>Change the avatar and username of webhooks.</li>
            <li>No advertisements.</li>
          </ul>

          <Button v-if="user">
            Upgrade now!
          </Button>
          <Button v-else>
            Login to upgrade
          </Button>
        </Tier>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button.vue'
import Tier from '@/components/premium/Tier.vue'

export default {
  components: { Button, Tier },

  data: () => ({
    interval: false
  }),

  computed: {
    user () {
      return this.$store.getters['user/user']
    }
  }

}
</script>

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
}

.tiers {
  .tierlist {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 1rem;
    align-items: center;
  }

  padding: 4rem;

  h1 {
    font-family: $font-family-brand;
    font-weight: 600;

    .fullstop {
      color: $blurple;
    }
  }
}

@media screen and (max-width: 1200px) {
  .lander {
    text-align: center;

    .content {
      padding: 2rem;
      margin: 0 auto;
    }
  }

  .tiers .tierlist {
    grid-template-columns: auto;
  }
}
</style>
