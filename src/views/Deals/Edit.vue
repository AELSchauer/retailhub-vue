<template>
  <div class="container">
    <section v-if="error">
      <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
    </section>
    <section v-else>
      <div v-if="loading">Loading...</div>
      <div v-else>
        <h2>details</h2>
        <form @submit.prevent="updateDeal" autocomplete="off">
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
                class="form-control col-md-9"
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
                class="form-control col-md-9"
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
            <div class="row">
              <label for="inputSalesType" class="form-label col-md-2">
                Sales Type
              </label>
              <select 
                v-model="model.sales_type"
                id="inputSalesType"
                class="form-control col-md-9"
                required
              >
                <option disabled value="">Please select one</option>
                <option>Sales and Promos</option>
                <option>New Arrivals</option>
                <option>In-Store Event</option>
                <option>Style Notes</option>
              </select>
            </div>
            <div class="row">
              <label for="inputDescription" class="form-label col-md-2">
                Description
              </label>
              <textarea
                v-model="model.description"
                id="inputDescription"
                class="form-control col-md-9"
                required
              ></textarea>
            </div>
            <div class="row">
              <label for="inputFinePrintDescription" class="form-label col-md-2">
                Fine Print
              </label>
              <textarea
                v-model="model.fine_print_description"
                id="inputFinePrintDescription"
                class="form-control col-md-9"
              ></textarea>
            </div>
            <div class="row">
              <label for="inputWebsiteAddress" class="form-label col-md-2">
                Website Address
              </label>
              <input
                v-model="model.external_url"
                type="url"
                id="inputWebsiteAddress"
                class="form-control col-md-9"
              >
            </div>
            <div class="row">
              <label for="inputIsLocal" class="form-label col-md-2">
                Is Local?
              </label>
              <input
                v-model="model.is_local"
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
                v-model="model.is_featured"
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
                v-model="model.is_live"
                id="inputIsLive"
                type="checkbox"
                class="form-control col-md-1"
              >
            </div>
            <br>
            <div class="row">
              <label for="calculateDatesAllDay" class="form-label col-md-2">
                All Day?
              </label>
              <input
                :checked="calculate_dates_all_day"
                @input="set('calculate_dates_all_day', $event.target.checked)"
                type="checkbox"
                id="calculateDatesAllDay"
                class="form-control col-md-9"
              >
            </div>
            <div class="row">
              <label for="inputStartAt" class="form-label col-md-2">
                Start At Date
              </label>
              <input
                :value="formatDate(model.start_at)"
                @input="set('start_at', $event.target.value)"
                :type="datesData.type"
                :min="startAtMin"
                :max="indefinitely"
                id="inputStartAt"
                class="form-control col-md-9"
                required
              >
            </div>

            <div class="row">
              <label for="inputDisplayAt" class="form-label col-md-2">
                Display At Date
              </label>
              <input
                :value="formatDate(model.display_at)"
                @input="set('display_at', $event.target.value)"
                :type="datesData.type"
                :min="displayAtMin"
                :max="displayAtMax"
                id="inputDisplayAt"
                class="form-control col-md-9"
                required
              >
            </div>
            <div class="row">
              <label for="inputEndAt" class="form-label col-md-2">
                End At Date
              </label>
              <input
                :value="formatDate(model.end_at)"
                @input="set('end_at', $event.target.value)"
                :type="datesData.type"
                :min="endAtMin"
                :max="indefinitely"
                id="inputEndAt"
                class="form-control col-md-9"
                required
              >
            </div>
            <div class="row">
              <label for="inputEndAtText" class="form-label col-md-2">
                End At Text
              </label>
              <select 
                v-model="model.end_at_text"
                type="radio" 
                id="inputEndAtText"
                class="form-control col-md-9"
                required
              >
                <option for="Show Dates">Show Dates</option>
                <option for="Limited Time">"Limited Time"</option>
                <option for="Ongoing">"Ongoing"</option>
              </select>
            </div>
          </div>
          <br>
          <div class="row">
            <div class="col-md-6 btn-row">
              <button
                class="btn btn-lg btn-primary btn-block"
                type="submit"
                :disabled="changes.isEmpty().value()"
              >
                Submit
              </button>
            </div>
            <div class="col-md-6 btn-row">
              <button class="btn btn-lg btn-primary btn-block">
                Cancel
              </button>
            </div>
          </div>
        </form>
        <hr>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'

import json_api from '@/services/json-api'

import Deal from '@/models/deal'
import Mall from '@/models/mall'

export default {
  name: 'DealEdit',
  data() {
    return {
      permissions: ['admin'],
      model:       null,
      loading:     true,
      error:       false,
      deal_id:     this.$route.params.deal_id,

      dateAttributeNames: ['start_at', 'display_at', 'end_at'],
      validationErrors:   null,
      
      calculate_seo_slug:      true,
      calculate_dates_all_day: true
    }
  },
  computed: {
    ...mapGetters({ currentUser: 'currentUser' }),
    startAtMin: function() {
      if (this.model.start_at) {
        return this.formatDate(this.model.start_at)
      }
      else {
        return this.formatDate(moment())
      }
    },
    displayAtMin: function() {
      if (this.model.start_at) {
        return this.formatDate(this.model.start_at)
      }
      else {
        return this.startAtMin
      }
    },
    displayAtMax: function() {
      if (this.model.end_at) {
        return this.formatDate(this.model.end_at)
      }
      else {
        return this.indefinitely
      }
    },
    endAtMin: function() {
      let date = (this.model.display_at || this.model.start_at);
      if (date) {
        return this.formatDate(moment(date).add(1, 'days'))
      }
      else {
        return this.formatDate(moment().add(1, 'days'))
      }
    },
    indefinitely: function() {
      return this.formatDate(moment().add(10, 'years'))
    },
    datesData: function() {
      if (this.calculate_dates_all_day) {
        return { format:'YYYY-MM-DD', type: 'date'}
      }
      else {
        return { format:'YYYY-MM-DDTHH:mm', type: 'datetime-local' }
      }
    },
    changes: function() {
      return _.chain(this.model.changes)
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
        resource: 'deals',
        id:       this.deal_id,
        options:  {
          params: { include: 'retailer,stores,retailer.stores' }
        }
      })
      .then((record) => {
        this.model = record
        this.model.snapshot()
        return this.model
      })
      .then((model) => {
        this.calculate_dates_all_day = _
          .every(this.dateAttributeNames, attrName => {
            return _.every(['hour', 'minute', 'second'], x => {
              return model[attrName].get(x) === 0
            })
          })

      })
      .catch((error) => {
        console.error('request failed', error);
        this.error = true;
      })
      .finally(() => {
        this.loading = false
      })
    },
    set(attr, newValue) {
      if (attr === 'title') {
        this.model.title = newValue
        if (this.calculate_seo_slug) {
          if (this.calculate_seo_slug) this.set('seo_slug', newValue);
        }
      }
      else if (attr === 'seo_slug') {
        this.model.seo_slug = newValue.slugify()
      }
      else if (attr === 'calculate_seo_slug') {
        this.calculate_seo_slug = newValue
        if (this.calculate_seo_slug) this.set('seo_slug', this.title);
      }
      else if (attr === 'calculate_dates_all_day') {
        this.calculate_dates_all_day = newValue
      }
      else if (_.includes(this.dateAttributeNames, attr)) {
        this.model[attr] = moment(newValue, this.datesData.format);
      }
      else {
        this.model[attr] = newValue
      }
    },
    formatDate(date) {
      return date.format(this.datesData.format)
    },
    updateDeal() {
      console.log('wooohoo', this.model.changes)
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
.btn-row {
  padding: 0px 5px;
}
</style>
