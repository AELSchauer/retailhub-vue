<template>
  <div class="container">
    <section v-if="error">
      <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
    </section>
    <section v-else>
      <div v-if="loading">Loading...</div>
      <div v-else>
        <h1>{{ model.name }}</h1>
        <hr>
        <div class="malls-section">
          <h3>malls</h3>
          <h4>current associations</h4>
          <table>
            <th>
              <td>name</td>
              <td>edit associations</td>
            </th>
            <tr v-for="mall in model.malls">
              <td>
                {{ mall.name }}
              </td>
              <td>
                <button @click="deleteAssociation(mall)">Delete Association</button>
              </td>
            </tr>
          </table>
          <br>
          <h4 @click="addResource = 'malls'">add association</h4> 
          <div v-if="addResource === 'malls'">
            <button @click="addResource = null">cancel</button>
            woohoo!
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import json_api from '@/services/json-api'

import Company from '@/models/company'
import Mall from '@/models/mall'

export default {
  name: 'CompanyShow',
  data() {
    return {
      permissions: ['admin'],
      model:       null,
      loading:     true,
      error:       false,
      company_id:  this.$route.params.company_id,
      addResource: null
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
        resource: 'companies',
        id:       this.company_id,
        options:  {
          params: { include: 'malls' }
        }
      })
      .then(() => {
        this.model = Company.query().with('malls').find(this.company_id) || {};
      })
      .catch((error) => {
        console.error('request failed', error);
        this.error = true;
      })
      .finally(() => this.loading = false)
    },
    deleteAssociation(record) {
      this.loading = true
      json_api.deleteAssociations({
        resource: 'companies',
        id: this.company_id,
        associatedRecords: [
          { type: record.type, id: record.id }
        ]
      })
      .then(() => {
        this.model = Company.query().with('malls').find(this.company_id) || {};
      })
      .catch((error) => {
        console.error('request failed', error);
        this.error = true;
      })
      .finally(() => this.loading = false)
    },
    fetchResource(resource) {
      // console.log('resource', resource)
      // this.loading = true
      // this.addResource = resource
      // json_api.findAll({
      //   resource: 'malls',
      //   id: this.company_id,
      //   associatedRecords: [
      //     { type: record.type, id: record.id }
      //   ]
      // })
      // .then(() => {
      //   this.model = Company.query().with('malls').find(this.company_id) || {};
      // })
      // .catch((error) => {
      //   console.error('request failed', error);
      //   this.error = true;
      // })
      // .finally(() => this.loading = false)
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
