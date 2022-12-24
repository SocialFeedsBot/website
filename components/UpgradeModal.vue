<template>
  <div
    id="upgrade-modal"
    class="modal"
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body">
          <p>
            Select a server to upgrade
          </p>

          <div
            v-for="(guild, index) in guilds"
            :key="index"
            style="cursor:pointer"
            @click="select(guild)"
            class="guild"
          >
            <div>
              <div class="d-flex">
                <img v-if="guild.icon" class="guild-icon rounded-circle ml-auto" :src="getGuildIcon(guild)" height="35" width="35">
                <div v-else class="guild-icon blankGuild">
                  <div class="blankGuildName">
                    {{ acronym(guild.name) }}
                  </div>
                </div>
                <p class="align-middle mt-3">{{ guild.name }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <a data-bs-dismiss="modal" aria-label="Close">
            <Button class=" light">
              Cancel
            </Button>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button.vue'

export default {
  components: { Button },
  props: ['feed'],

  computed: {
    guilds () {
      return this.$store.getters['user/manageableGuilds']
    }
  },

  async mounted () {
    await this.$store.dispatch('user/GET_USER_GUILDS')
  },

  methods: {
    getGuildIcon (guild) {
      if (guild && guild.icon) { return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` } else { return '/static/blank-server.png' }
    },

    acronym (name) {
      return name.split(/\s/).reduce((accumulator, word) => {
        return accumulator + word.charAt(0)
      }, '')
    },

    select (guild) {
      this.$emit('select', guild.id)
    }
  }

}
</script>

<style lang="scss" scoped>
@import "@/assets/css/_variables.scss";

  .modal-content {
    background-color: $background-dark;
  }

  .modal-header, .modal-footer {
    border-bottom: 0;
    border-top: 0;
  }

  .modal {
    transform: scale(0.9);
    opacity: 0;
    -webkit-transition: all .15s ease-out;
    -o-transition: all .15s ease-out;
    transition: all .15s ease-out;
  }
  .modal.show {
    opacity: 1;
    transform: scale(1);
  }

  .guild:hover {
    background-color: $background-light;
    transition: background-color 0.5s ease;
  }
  .guild-icon {
    background-color: #2e3338;
    margin: .5rem;
  }
  .guild-icon:hover {
    box-shadow: 0 0 5px 2px #1b1d1f;
    border: 0px;
  }

  .blankGuild {
    background-color: #2e3338;
    width: 35px;
    height: 35px;
    border-radius: 25% !important;
  }
  .blankGuildName {
    font-size: 20px;
    text-align: center;
    color: #707070
  }

</style>
