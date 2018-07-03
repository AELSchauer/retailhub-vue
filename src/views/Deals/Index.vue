<template>
  <div class="container">
    <section v-if="error">
      <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
    </section>
    <section v-else>
      <div v-if="loading">Loading...</div>
      <ul v-else>
        <li v-for="deal in model">
          {{ deal.name }}
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Deal from '@/models/deal'
import json_api from '@/services/json-api'

export default {
  name: 'DealIndex',
  data() {
    return {
      permissions: ['admin'],
      model:       null,
      loading:     true,
      error:       false
    }
  },
  computed: {
    ...mapGetters({ currentUser: 'currentUser' }),
  },
  created() {
    this.checkCurrentLogin()
    this.checkCurrentPermissions()
  },
  updated() {
    this.checkCurrentLogin()
    this.checkCurrentPermissions()
  },
  mounted() {
    this.getModel()
  },
  methods: {
    checkCurrentLogin() {
      if (!this.currentUser && this.$route.path !== '/') {
        this.$router.push('/?redirect=' + this.$route.path)
      }
    },
    checkCurrentPermissions() {
      if (this.permissions.includes('admin') && this.currentUser.isAdmin) {
        return true
      }
      else {
        this.$router.push('/dashboard?redirect=' + this.$route.path)
      }
    },
    getModel() {
      json_api.findAll({ resource: 'deals' })
      .then((request) => {
        this.model = Deal.all() || [];
      })
      .catch((error) => {
        console.error('request failed', error);
        this.error = true;
      })
      .finally(() => this.loading = false)
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
a {
  color: #42b983;
}
</style>
