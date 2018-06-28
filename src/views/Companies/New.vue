<template>
  <div class="container">
    <section v-if="error">
      <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
    </section>
    <section v-else>
      <div v-if="loading">Loading...</div>
      <div v-else>
        <br>
        <form @submit.prevent="createCompany" autocomplete="off">
          <div class=alert alert-danger v-if=validationErrors>{{ validationErrors }}</div>
          <div class="container">
            <div class="row">
              <label for="inputName" class="form-label col-md-2">Name</label>
              <input :value="name" @input="inputName($event)" id="inputName" class="form-control col-md-9" required autofocus>
            </div>
            <div class="row">
              <label for="inputNickname" class="form-label col-md-2">Nickname</label>
              <input v-model="nickname" id="inputNickname" class="form-control col-md-9" :disabled="calculateNickname">
              <input v-model="calculateNickname" id="calculateNickname" type="checkbox" class="form-control col-md-1">
            </div>
            <div class="row">
              <label for="inputSeoSlug" class="form-label col-md-2">SEO Slug</label>
              <input v-model="seoSlug" id="inputSeoSlug" class="form-control col-md-9" :disabled="calculateSeoSlug">
              <input v-model="calculateSeoSlug" id="calculateSeoSlug" type="checkbox" class="form-control col-md-1">
            </div>
            <div class="row">
              <label for="inputAddress" class="form-label col-md-2">Address</label>
              <input v-model="address"id="inputAddress" class="form-control col-md-9">
            </div>
            <div class="row">
              <label for="inputCity" class="form-label col-md-2">City</label>
              <input v-model="city"id="inputCity" class="form-control col-md-9">
            </div>
            <div class="row">
              <label for="inputState" class="form-label col-md-2">State</label>
              <input v-model="state"id="inputState" class="form-control col-md-9">
            </div>
            <div class="row">
              <label for="inputZipCode" class="form-label col-md-2">Zip Code</label>
              <input v-model="zip"id="inputZipCode" class="form-control col-md-9">
            </div>
          </div>
          <br>
          <button class="btn btn-lg btn-primary btn-block" type="submit">Submit</button>
        </form>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VueGoogleAutocomplete from 'vue-google-autocomplete'
import json_api from '@/services/json-api'
import Company from '@/models/company'

export default {
  name: 'CompanyNew',
  data() {
    return {
      permissions: ['admin'],
      model:    null,
      loading:  true,
      error:    false,

      validationErrors: null,

      name: '',
      nickname: '',
      calculateNickname: true,
      seoSlug: '',
      calculateSeoSlug: true,
      address: '',
      city: '',
      state: '',
      zip: '',
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
      this.loading = false;
      return new Company()
    },
    inputName(event) {
      this.name = name + event.target.value
      if (this.calculateNickname) {
        this.nickname = this.name
      }
      if (this.calculateSeoSlug) {
        this.seoSlug = this.name.toLowerCase()
      }
    },
    inputSeoSlug(event) {
      this.seoSlug = (seoSlug + event.target.value).toLowerCase()
    },
    createCompany() {
      console.log('wooohoo', this)
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
.form-label {
  text-align: right;
}
</style>
