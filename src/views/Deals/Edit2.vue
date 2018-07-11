<template>
  <div class="container">
    <section v-if="error">
      <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
    </section>
    <section v-else>
      <div v-if="loading">Loading...</div>
      <div v-else>
        fucker
        <br>
        {{ model }}
        <form @submit.prevent="createDeal" autocomplete="off">
          <div class=alert alert-danger v-if=validationErrors>{{ validationErrors }}</div>
          <div class="container">
            <div class="row">
              <label for="inputTitle" class="form-label col-md-2">
                Title
              </label>
              <input
                :value="title"
                @input="input('title', $event.target.value)"
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
                :value="seo_slug"
                @input="input('seo_slug', $event.target.value)"
                id="inputSeoSlug"
                class="form-control col-md-8"
                :disabled="calculate_seo_slug"
                required
              >
              <input
                :checked="calculate_seo_slug"
                @input="input('calculate_seo_slug', $event.target.checked)"
                type="checkbox"
                id="calculateSeoSlug"
                class="form-control col-md-1"
              >
            </div>
            <div class="row">
              <label for="inputSalesType" class="form-label col-md-2">
                Sales Type
              </label>
              <select 
                v-model="sales_type"
                id="inputSalesType"
                class="form-control col-md-8"
                required
              >
                <option disabled value="">Please select one</option>
                <option value="11">Sales and Promos</option>
                <option value="12">New Arrivals</option>
                <option value="13">In-Store Events</option>
                <option value="15">Style Notes</option>
              </select>
            </div>
            <div class="row">
              <label for="inputDescription" class="form-label col-md-2">
                Description
              </label>
              <textarea
                v-model="description"
                id="inputDescription"
                class="form-control col-md-8"
                required
              ></textarea>
            </div>
            <div class="row">
              <label for="inputFinePrintDescription" class="form-label col-md-2">
                Fine Print
              </label>
              <textarea
                v-model="fine_print_description"
                id="inputFinePrintDescription"
                class="form-control col-md-8"
              ></textarea>
            </div>
            <div class="row">
              <label for="inputWebsiteAddress" class="form-label col-md-2">
                Website Address
              </label>
              <input
                v-model="external_url"
                type="url"
                id="inputWebsiteAddress"
                class="form-control col-md-8"
              >
            </div>
            <div class="row">
              <label for="inputIsLocal" class="form-label col-md-2">
                Is Local?
              </label>
              <input
                v-model="is_local"
                type="checkbox"
                id="inputIsLocal"
                class="form-control col-md-1"
              >
            </div>
            <div class="row">
              <label for="inputIsFeatured" class="form-label col-md-2">
                Is Featured?
              </label>
              <input
                v-model="is_featured"
                id="inputIsFeatured"
                type="checkbox"
                class="form-control col-md-1"
              >
            </div>
            <div class="row">
              <label for="inputIsLive" class="form-label col-md-2">
                Is Live?
              </label>
              <input
                v-model="is_live"
                id="inputIsLive"
                type="checkbox"
                class="form-control col-md-1"
              >
            </div>
            <div class="row">
              <label for="inputStartAt" class="form-label col-md-2">
                Start At Date
              </label>
              <input
                v-model="start_at"
                type="date"
                :min="startAtMin"
                :max="indefinitely"
                id="inputStartAt"
                class="form-control col-md-8"
                required
              >
            </div>
            <div class="row">
              <label for="inputDisplayAt" class="form-label col-md-2">
                Display At Date
              </label>
              <input
                v-model="display_at"
                type="date"
                :min="displayAtMin"
                :max="displayAtMax"
                id="inputDisplayAt"
                class="form-control col-md-8"
                required
              >
            </div>
            <div class="row">
              <label for="inputEndAt" class="form-label col-md-2">
                End At Date
              </label>
              <input
                v-model="end_at"
                type="date"
                :min="endAtMin"
                :max="indefinitely"
                id="inputEndAt"
                class="form-control col-md-8"
                required
              >
            </div>
            <div class="row">
              <label for="inputEndAtText" class="form-label col-md-2">
                End At Text
              </label>
              <select 
                v-model="end_at_text"
                type="radio" 
                id="inputEndAtText"
                class="form-control col-md-8"
                required
              >
                <option disabled value="">Please select one</option>
                <option for="0">Show Dates</option>
                <option for="1">"Limited Time"</option>
                <option for="2">"Ongoing"</option>
              </select>
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
import moment from 'moment'
// import VueGoogleAutocomplete from 'vue-google-autocomplete'
import json_api from '@/services/json-api'
import Deal from '@/models/deal'

export default {
  name: 'DealNew',
  data() {
    return {
      permissions: ['admin'],
      model:    null,
      loading:  true,
      error:    false,

      validationErrors: null,

      // title: '',
      // seo_slug: '',
      // calculate_seo_slug: true,
      // sales_type: '',
      // description: '',
      // fine_print_description: '',
      // external_url: '',
      // is_local: false,
      // is_featured: false,
      // is_live: false,
      // start_at: '',
      // display_at: '',
      // end_at: '',
      // end_at_text: '',
    }
  },
  computed: {
    ...mapGetters({ currentUser: 'currentUser' }),
    startAtMin: function() {
      return moment().format('YYYY-MM-DD')
    },
    displayAtMin: function() {
      if (this.start_at.length) {
        return this.start_at
      }
      else {
        return this.startAtMin
      }
    },
    displayAtMax: function() {
      if (this.end_at.length) {
        return this.end_at
      }
      else {
        return this.indefinitely
      }
    },
    endAtMin: function() {
      if (this.display_at.length) {
        return moment(this.display_at, 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD')
      }
      else if (this.start_at.length) {
        return moment(this.start_at, 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD')
      }
      else {
        return moment().add(1, 'days').format('YYYY-MM-DD')
      }
    },
    indefinitely: function() {
      return moment().add(20, 'years').endOf('year').format('YYYY-MM-DD')
    },

    // title: function() {
    //   return this.title || this.model.title
    // }
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
    this.loading = false;
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
    },
    input(attr, value) {
      if (attr === 'title') {
        this.title = value
        if (this.calculate_seo_slug) {
          this.input('seo_slug', value)
        }
      }
      else if (attr === 'seo_slug') {
        this.seo_slug = value.slugify()
      }
      else if (attr === 'calculate_seo_slug') {
        this.calculate_seo_slug = value
        if (this.calculate_seo_slug) {
          this.input('seo_slug', this.title)
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
.form-label {
  align-self: center;
  margin: 0;
  padding: 0 10px 0 0;
  text-align: right;
}
.form-input {
  align-self: center;
  margin: 0;
}
.row {
  padding: 5px 0;
}
</style>
