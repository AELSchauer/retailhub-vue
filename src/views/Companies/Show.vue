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
        <h3>malls</h3>
        <ul>
          <li v-for="mall in model.malls">
            {{ mall.name }}
          </li>
        </ul>
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
      company_id:  this.$route.params.company_id
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
      json_api.findRecord('companies', this.company_id, { params: { include: 'malls' } })
      .then((request) => {
        this.model = Company.query().with('malls').find(53) || {};
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
