<template>
  <div class="container">
    <section v-if="error">
      <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
    </section>
    <section v-else>
      <div v-if="loading">Loading...</div>
      <div v-else>
        <span class="row">
          <h2 class="section-title col-md-11">details</h2>
          <router-link 
            :to="{ name: 'DealEdit', params: { deal_id: model.id }}"
            class='btn edit-button col-md-1'
          >
            Edit
          </router-link>
        </span>
        <div v-for="attribute in attributeManifest" class="attribute row">
          <div class="attribute-label col-md-2">
            {{ attribute.label }}
          </div>
          <div class="attribute-value col-md-10">
            {{ get(attribute.name) }}
          </div>
        </div>
        <hr>
        <div class="pages-section">
          <h2>pages</h2>
          <h4>current associations</h4>
          <table>
            <th>
              <td>path</td>
              <td></td>
            </th>
            <tr v-for="page in model.pages">
              <td>
                {{ page.path }}
              </td>
              <td>
                <em>button goes here</em>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import json_api from '@/services/json-api'

import Site from '../../models/site'
// import Deal from '@/models/deal'
// import Mall from '@/models/mall'

export default {
  name: 'SiteShow',
  data() {
    let id = this.$route.params.site_id

    return {
      permissions: ['admin'],
      breadcrumbs: [
        {
          name: 'SiteIndex',
          text: 'Sites',
        },
        {
          text: id,
        }
      ],
      model:   null,
      loading: true,
      error:   false,
      site_id: id,
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
      json_api.findRecord({
        resource: 'sites',
        id:       this.site_id,
        options:  {
          params: { include: 'pages' }
        }
      })
      .then((record) => {
        this.model = record
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
