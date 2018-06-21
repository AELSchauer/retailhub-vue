<template>
  <div class="container">
    <section v-if="error">
      <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
    </section>
    <section v-else>
      <div v-if="loading">Loading...</div>
      <ul v-else>
        <li v-for="site in sites">
          <router-link :to="{ name: 'SiteShow', params: { site_id: site.id }}">{{ site.name }}</router-link>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Site from '../../models/site'

export default {
  name: 'SiteIndex',
  data() {
    return {
      permissions: ['admin'],
      sites:       null,
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
    this.getSites()
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
    getSites() {
      let time = Math.round(Date.now() / 1000);
      let token = this.currentUser.authenticationToken(time)
      this.$http.request({
        method: 'get',
        url: '/sites',
        headers: {
          'Accept': 'application/vnd.api+json',
        },
        params: {
          auth_id:        this.currentUser.id,
          auth_timestamp: time,
          auth_token:     token
        }
      })
      .then((request) => {
        if (request.status === 200) {
          this.requestSucceeded(request)
        }
        else {
          this.requestFailed(request)
        }
      })
      .catch((error) => this.requestFailed(error))
      .finally(() => this.loading = false)
    },
    requestSucceeded(req) {
      this.sites = req.data.data.map(site => new Site(site));
    },
    requestFailed(req) {
      console.error('request failed', req);
      this.error = true;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
