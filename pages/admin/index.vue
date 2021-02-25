<template>
  <div class="center">
    <div class="pb-3 pt-4 mt-4 mb-5">
      <b-container id="statusbox" class="bv-example-row pt-4">
        <div class="d-block">
          <h3>Admin Panel</h3><br>
        </div>

        <b-row class="pb-2" v-for="(a) in services" :key="a.type + '-' + a.id">
          <b-col><h5 style="align-items: left;">{{ a.type }}-{{ a.id }}</h5></b-col>
          <b-col>
            <b-button class="blurple" @click="restart({ name: a.type, id: a.id })">
              Restart
            </b-button>
            <b-button class="blurple" @click="restart({ name: a.type, id: 'all' })">
              Restart all of Type
            </b-button>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<style>
.center {
  width: 100%;
  text-align: center;
}

.status {
  border-radius: .25rem;
  margin: 0.25rem;
  padding: 12px;
  font-weight: 500;
  font-size: 20px;
  -webkit-text-stroke: 0.1px black;
  display: flex;
  height: 40px;
  width: 40;
}
#statusbox  {
  background-color: #23272A;
  border-radius: 5px;
}

</style>

<script>
export default {
  data () {
    return {
      services: [],
      auth: false
    }
  },

  beforeDestroy () {
    clearInterval(this.interval)
  },

  async beforeMount () {
    try {
      const { data } = await this.$axios.get('/gateway/auth')
      if (!data.auth) {
        window.location = '/'
      } else {
        this.auth = true
      }
    } catch (e) {
      window.location = '/'
    }
  },

  async mounted () {
    while (!this.auth) {
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    await this.updateStatus()
    this.interval = setInterval(() => this.updateStatus(), 10 * 1000)
  },

  methods: {
    async updateStatus () {
      try {
        const { data } = await this.$axios.get('/status/services')
        this.services = data.services
      } catch (e) {
        this.services = []
      }
    },

    async restart (target) {
      try {
        await this.$axios.post('/gateway/restart', target)
        this.$bvToast.toast('Please wait', {
          title: 'Service restarting',
          autoHideDelay: 6000,
          appendToast: false,
          variant: 'success'
        })
        this.updateStatus()
      } catch (e) {
        this.$bvToast.toast(e.message, {
          title: 'Error restarting service',
          autoHideDelay: 6000,
          appendToast: false,
          variant: 'danger'
        })
      }
    }

  }
}
</script>
