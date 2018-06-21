<template>
  <section v-if="error">
    <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
  </section>
  <div v-else-if="loading">
    Loading...
  </div>
  <div v-else class="row">
    <div class="component-tree container col-md-8">
      <ul>
        <li v-for="component in body">
          <bento-base-component-body
            :component="component"
            @viewComponentDetails="viewComponentDetails"
          ></bento-base-component-body>

        </li>
      </ul>
    </div>
    <div class="component-details container col-md-4">
      <button v-on:click="closeComponentDetails">x</button>
        <bento-base-component-attributes
          v-bind:component="detailComponent"
        ></bento-base-component-attributes>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Page from '../../../models/page'
import Changeset from '../../../models/_changeset'
import BentoBaseComponentAttributes from '@/components/site-editor/bento-components/attributes'
import BentoBaseComponentBody from '@/components/site-editor/bento-components/body'

export default {
  name: 'SitePageEdit',
  data() {
    return {
      permissions: ['admin'],
      error:       false,
      loading:     true,

      body: null,
      page: null,

      detailComponent: {}
    }
  },
  computed: {
    ...mapGetters({ currentUser: 'currentUser' })
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
    this.getPage()
  },
  methods: {
    viewComponentDetails: function(component) {
      this.detailComponent = component;
    },
    closeComponentDetails: function() {
      this.detailComponent = {};
    },
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
    getPage() {
      let time = Math.round(Date.now() / 1000);
      let token = this.currentUser.authenticationToken(time)
      this.$http.request({
        method: 'get',
        url: `/pages/${this.$route.params.page_id}`,
        headers: {
          'Accept': 'application/vnd.api+json',
        },
        params: {
          auth_id:        this.currentUser.id,
          auth_timestamp: time,
          auth_token:     token,
          include:        'site'
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
      this.page = new Page({
        id:         req.data.data.id,
        attributes: req.data.data.attributes,
        included:   req.data.included,
      })
      this.body = this.page.body
    },
    requestFailed(req) {
      console.error('request failed', req);
      this.error = true;
    }
  },
  components: {
    BentoBaseComponentAttributes,
    BentoBaseComponentBody
  }
}
</script>

<!-- https://coolors.co/e0e2db-d2d4c8-b8bdb5-889696-5f7470 -->
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
.component-tree {
  background: #D2D4C8
}
.component-details {
  background: #889696
}
</style>
