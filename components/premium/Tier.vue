<template>
  <div class="card">
    <div class="content">
      <div class="heading">
        <h2 class="title">
          Tier {{ type }}
          <h4 v-if="type == '0'">
            Default
          </h4>
          <h4 v-if="type == '1'">
            Recommended
          </h4>
        </h2>
        <div class="status">
          <p class="value premium">
            {{ price }}
          </p>
        </div>
      </div>

      <div class="stats">
        <div v-if="noAds" class="stat">
          <div class="key">
            Capacity
          </div>
          <p class="value">
            {{ capacity }}
          </p>
        </div>
        <div class="stat">
          <div class="key">
            No Ads
          </div>
          <p class="value">
            {{ noAds }}
          </p>
        </div>
        <div class="stat">
          <div class="key">
            Customisation
          </div>
          <p class="value">
            {{ customisation }}
          </p>
        </div>
        <div class="button">
          <Button @click="createCheckout()">
            Purchase
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '../Button.vue'
export default {
  components: { Button },
  // eslint-disable-next-line vue/require-prop-types
  props: ['type'],
  computed: {
    price () {
      switch (this.type) {
        case '0':
          return 'Free'
        case '0+':
          return '£2/month'
        case '1':
          return '£5/month'
        case '2':
          return '£10/month'
        case '3':
          return '£15/month'
        case '4':
          return '£30/month'
        default:
          return 'Unknown'
      }
    },
    capacity () {
      switch (this.type) {
        case '0':
          return '30'
        case '0+':
          return '30'
        case '1':
          return '60'
        case '2':
          return '150'
        case '3':
          return '300'
        case '4':
          return '1000+'
        default:
          return 'Unknown'
      }
    },
    noAds () {
      switch (this.type) {
        case '0':
          return 'No'
        case '0+':
          return 'Yes'
        case '1':
          return 'Yes'
        case '2':
          return 'Yes'
        case '3':
          return 'Yes'
        case '4':
          return 'Yes'
        default:
          return 'Unknown'
      }
    },
    customisation () {
      switch (this.type) {
        case '0':
          return 'No'
        case '0+':
          return 'No'
        case '1':
          return 'No'
        case '2':
          return 'Yes'
        case '3':
          return 'Yes'
        case '4':
          return 'Yes'
        default:
          return 'Unknown'
      }
    },
    shouldShowNew () {
      return this.$props.isNew !== undefined && this.$props.isNew === ''
    }
  },
  methods: {
    async createCheckout () {
      let tier = 0
      switch (this.type) {
        case '0':
          tier = 0
          break
        case '0+':
          tier = 1
          break
        case '1':
          tier = 2
          break
        case '2':
          tier = 3
          break
        case '3':
          tier = 4
          break
        case '4':
          tier = 5
          break
      }

      const res = await this.$axios.post('/premium/checkout', {
        userID: '',
        guildID: '',
        tier
      })
      window.location = res.data.url
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/_variables.scss";

.card {
  min-width: 500px;
  .new {
    margin-right: .75rem;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    background-color: $blurple;
    font-family: $font-family-brand;
    font-weight: 500;
    text-transform: capitalize;
  }

  display: flex;
  flex-direction: row;
  background-color: $background-dark;
  border-radius: 1rem;
  min-height: 150px;
  margin: 1rem;

  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 1rem 1rem 1rem 0rem;
    align-content: space-around;
    justify-content: space-between;
    align-items: center;
  }

  .heading {
    width: 100%;
    margin: 0 1rem;
    align-self: flex-start;
    align-content: space-around;
    justify-content: space-between;
    display: flex;
    flex-direction: row;
  }

  h2 {
    margin: 0;
    align-self: left;
    font-family: $font-family-brand;
    font-size: 1.25rem;
    font-weight: 500;
    align-content: space-between;
  }

  h4 {
    margin: 0;
    font-size: 1rem;
    font-weight: 500;
    color: #6e6e7a;
  }

  .stats {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: row;

    .button {
      margin-left: auto;
    }
  }

  .stat {
    display: block;
    // width: 90px;
    margin: 0 1rem;
  }

  .key {
    font-family: $font-family-brand;
    font-size: 0.9rem;
    font-weight: 500;
    margin: 0;
    margin-right: 0.5rem;
    color: #6e6e7a;
  }

  .value {
    font-family: $font-family-brand;
    font-size: 1rem;
    font-weight: 500;
    margin: 0;
  }

  .status {
    margin-right: .75rem;

    .green {
      color: #01FF70;
    }

    .amber {
      color: #FF851B;
    }

    .red {
      color: #FF4136;
    }
  }

  .premium {
    color: $premium;
  }

}
</style>
