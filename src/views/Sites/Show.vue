<template>
  <div class="container">
    <section v-if="error">
      <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
    </section>
    <section v-else>
      <div v-if="loading">Loading...</div>
      <div v-else>
        <div v-if="editName" class="row">
          <span class="col-md-10">Input goes here</span>
          <div class="col-md-1">
            <button class="btn" disabled="">save</button>
          </div>
          <div class="col-md-1">
            <button class="btn" @click="toggleEditName()">cancel</button>
          </div>
        </div>
        <div v-else class="row">
          <h2 class="section-title col-md-11">{{ get('name') }}</h2>
          <div class="col-md-1">
            <button class="btn" @click="toggleEditName()">edit</button>
          </div>
        </div>
        <hr>
        <div class="pages-section">
          <h2>pages</h2>
          <table>
            <th>
              <td>path</td>
              <td></td>
            </th>
            <tr v-for="page in model.pages">
              <td class="page-name">
                {{ page.path }}
              </td>
              <td class="page-actions">
                <router-link 
                  :to="{
                    name: 'SitePageEdit',
                    params: {
                      page_id: page.id,
                      page_name: page.path,
                      site_name: model.name,
                    }
                  }"
                  class='btn edit-button col-md-1'
                >
                  Edit
                </router-link>
                <em>buttons go here</em>
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

import Site from '@/models/site'
import Page from '@/models/page'

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
      model:    null,
      editName: false,
      loading:  true,
      error:    false,
      site_id:  id,
    }
  },
  computed: {
    ...mapGetters({ currentUser: 'currentUser' }),
    attributeManifest: function() {
      let manifest = this.model.attributeManifest
      if (this.model.published_at.isValid()) {
        manifest.push({
          label: 'Published Date',
          name:  'published_at'
        })
      }
      return manifest
    },
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
    get(attrName) {
      let attribute = this.model.get(attrName)
      console.log('attribute', attrName, attribute)
      if (attribute.constructor.name === 'Moment') {
        return attribute.format('YYYY-MM-DD HH:mm:ss')
      }
      else {
        return attribute
      }
    },
    toggleEditName() {
      this.editName = !this.editName
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
.btn {
  background-color: #42b983;
  color: #fff;
  width: 100%;
}
.page-name {
  padding: 0 10px 0 0;
}
</style>
