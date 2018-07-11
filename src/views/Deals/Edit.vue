<template>
  <div class="container">
    <section v-if="error">
      <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
    </section>
    <section v-else>
      <div v-if="loading">Loading...</div>
      <div v-else>
        <h2>details</h2>
        <form @submit.prevent="createDeal" autocomplete="off">
          <div class=alert alert-danger v-if=validationErrors>{{ validationErrors }}</div>
          <div class="container">
            <div class="row">
              <label for="inputTitle" class="form-label col-md-2">
                Title
              </label>
              <input
                :value="model.title"
                @input="set('title', $event.target.value)"
                id="inputTitle"
                class="form-control col-md-8"
                required
                autofocus
              >
            </div>
            <div class="row">
              <label for="inputSeoSlug" class="form-label col-md-2">
                SEO Slug
              </label>
              <input
                :value="model.seo_slug"
                @input="set('seo_slug', $event.target.value)"
                id="inputSeoSlug"
                class="form-control col-md-8"
                :disabled="calculate_seo_slug"
                required
              >
              <input
                :checked="calculate_seo_slug"
                @input="set('calculate_seo_slug', $event.target.checked)"
                type="checkbox"
                id="calculateSeoSlug"
                class="form-control col-md-1"
              >
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
import json_api from '@/services/json-api'

import Deal from '@/models/deal'
import Mall from '@/models/mall'

export default {
  name: 'DealShow',
  data() {
    return {
      permissions: ['admin'],
      model:       null,
      loading:     true,
      error:       false,
      deal_id:     this.$route.params.deal_id,

      calculate_seo_slug: true,
      validationErrors:   false
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
        resource: 'deals',
        id:       this.deal_id,
        options:  {
          params: { include: 'retailer,stores,retailer.stores' }
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
    set(attr, value) {
      if (attr === 'title') {
        this.model.title = value
        if (this.calculate_seo_slug) {
          this.set('seo_slug', value)
        }
      }
      else if (attr === 'seo_slug') {
        this.model.seo_slug = value.slugify()
      }
      else if (attr === 'calculate_seo_slug') {
        this.calculate_seo_slug = value
        if (this.calculate_seo_slug) {
          this.set('seo_slug', this.title)
        }
      }
    },
    createDeal() {
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
.attribute-label {
  padding: 0 10px 0 0;
}
.add-remove {
  width: 30px;
  text-align: center;
}
</style>
