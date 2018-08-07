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
            <div class="btn button-custom" disabled="">save</div>
          </div>
          <div class="col-md-1">
            <div class="btn button-custom" @click="toggleEditName()">cancel</div>
          </div>
        </div>
        <div v-else class="row">
          <h2 class="section-title col-md-11">{{ get('name') }}</h2>
          <div class="col-md-1">
            <div class="btn button-custom" @click="toggleEditName()">edit</div>
          </div>
        </div>
        <hr>
        <div class="partials-section">
          <h2>partials</h2>
          <ul>
            <li v-for="partial in model.partials">
              <router-link 
                :to="{
                  name: 'SitePartialEdit',
                  params: {
                    site_id: model.id,
                  },
                  query: {
                    names: partial.name
                  }
                }"
              >
                {{ partial.name }}
              </router-link>
            </li>
          </ul>
        </div>
        <hr>
        <div class="pages-section">
          <h2>pages</h2>
          <table>
            <th>
              <td>path</td>
              <td></td>
            </th>
            <template v-for="page in model.pages">
              <site-page-details
                :model="page"
                :site="model"
              ></site-page-details>
            </template>
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

import SitePageDetails from '@/components/sites/page-details'

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

      newPartial: null,
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
    },
  },
  components: {
    SitePageDetails,
  }
}
</script>

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
  color: #fff;
}
.button-custom {
  width: 100%;
  background-color: #42b983;
}
</style>
