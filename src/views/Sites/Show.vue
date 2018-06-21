<template>
  <div class="container">
    <section v-if="error">
      <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
    </section>
    <section v-else>
      <div v-if="loading">Loading...</div>
      <div v-else>
        <div>
          Name: {{ site.name }}
          Canonical Domain: {{ site.canonDomain }}
          Live: {{ site.isLive }}
          Published At: {{ site.publishedAt }}
        </div>
        <ul>
          <li v-for="page in pages">
            <router-link :to="{ name: 'SitePageEdit', params: { site_id: site.id, page_id: page.id }}">{{ page.path }}</router-link>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Site from '../../models/site'

export default {
  name: 'SiteShow',
  data() {
    return {
      permissions: ['admin'],
      site:        null,
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
    this.getSite()
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
    getSite() {
      let time = Math.round(Date.now() / 1000);
      let token = this.currentUser.authenticationToken(time)
      this.$http.request({
        method: 'get',
        url: `/sites/${this.$route.params.site_id}`,
        headers: {
          'Accept': 'application/vnd.api+json',
        },
        params: {
          auth_id:        this.currentUser.id,
          auth_timestamp: time,
          auth_token:     token,
          include:        'pages'
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
      this.site = new Site({
        id:         req.data.data.id,
        attributes: req.data.data.attributes,
        included:   req.data.included,
      })
      this.pages = this.site.pages
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
  list-style-type: disc;
  padding: 0;
}
li {
  display: list-item;
  margin: 0 10px;
  text-align: left;
}
a {
  color: #42b983;
}
</style>
