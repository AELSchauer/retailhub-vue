<template>
  <div class="container">
    <section v-if="error">
      <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
    </section>
    <section v-else>
      <div v-if="loading">Loading...</div>
      <ul v-else>
        <li v-for="site in model">
          <router-link :to="{ name: 'SiteShow', params: { site_id: site.id }}">{{ site.name }}</router-link>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Site from '@/models/site'

export default {
  name: 'SiteIndex',
  data() {
    return {
      permissions: ['admin'],
      breadcrumbs: [],
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
    this.$store.dispatch('breadcrumbs', this.breadcrumbs)
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
      Site.all()
      .then((records) => {
        this.model = records;
      })
      .catch((error) => {
        console.error('request failed', error);
        this.error = true;
      })
      .finally(() => {
        this.loading = false
      })
    },
  }
}
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}
a {
  color: #42b983;
}
</style>
