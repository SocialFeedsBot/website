<template>
  <div>
    <div class="center vh-100 mt-8">
      <h1 v-if="error.statusCode === 404">
        Uh oh, page not found.
      </h1>
      <h1 v-else>
        An error occurred.
      </h1>
      <p v-if="error.statusCode === 404">
        This page has either been moved or does not exist.
      </p>
      <p v-else>
        Try again later.
      </p>

      <b-button class="cbtn cbtn-dark large" :to="{ name: 'index' }">
        Go home
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'error',
  props: ['error'] // you can set a custom layout for the error page
}
</script>
