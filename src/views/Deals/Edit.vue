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
            <form-input-text-box
              attribute="title"
              label="Title"
              :options="{ type: 'text', required: true, autofocus: true }"
              wrapperClass="row"
            ></form-input-text-box>
            <div class="row">
              <label for="inputSeoSlug" class="form-label col-md-2">
                SEO Slug
              </label>
              <input
                :value="get('seo_slug')"
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
                :value="get('sales_type')"
                @input="set('sales_type', $event.target.value)"
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
                :value="get('description')"
                @input="set('description', $event.target.value)"
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
                :value="get('fine_print_description')"
                @input="set('fine_print_description', $event.target.value)"
                id="inputFinePrintDescription"
                class="form-control col-md-9"
              ></textarea>
            </div>
            <div class="row">
              <label for="inputWebsiteAddress" class="form-label col-md-2">
                Website Address
              </label>
              <input
                :value="get('external_url')"
                @input="set('external_url', $event.target.value)"
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
                Start Date
              </label>
              <input
                :value="formatDate(model.get('start_at'))"
                @input="model.set('start_at', $event.target.value)"
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
                Display Date
              </label>
              <input
                :value="formatDate(model.get('display_at'))"
                @input="model.set('display_at', $event.target.value)"
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
                End Date
              </label>
              <input
                :value="formatDate(model.get('end_at'))"
                @input="model.set('end_at', $event.target.value)"
                :type="datesData.type"
                :min="endAtMin"
                :max="indefinitely"
                id="inputEndAt"
                class="form-control col-md-9"
                required
              >
            </div>
            <!-- 
            The API doesn't currently support end_date_visibility or end_at_text
            in post or patch requests.
             -->
            <!-- <div class="row">
              <label for="EndAtText" class="form-label col-md-2">
                End Date Text
              </label>
              <select 
                :value="get('end_at_text')"
                @input="set('end_at_text', $event.target.value)"
                id="EndAtText"
                class="form-control col-md-9"
                required
              >
                <option>Show Dates</option>
                <option value="Limited Time">"Limited Time"</option>
                <option value="Ongoing">"Ongoing"</option>
              </select>
            </div> -->
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
              <!-- <button class="btn btn-lg btn-primary btn-block">
                Cancel
              </button> -->
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

import FormInputTextBox from '@/components/form-inputs/text-box'

export default {
  name: 'DealEdit',
  data() {
    return {
      permissions: ['admin'],
      model:       null,
      loading:     true,
      error:       false,
      deal_id:     this.$route.params.deal_id,

      dateAttributeNames: Deal.dateAttributeNames(),
      validationErrors:   null,
      
      calculate_seo_slug:      true,
      calculate_dates_all_day: true
    }
  },
  computed: {
    ...mapGetters({ currentUser: 'currentUser' }),
    startAtMin: function() {
      if (this.model.get('start_at')) {
        return this.formatDate(this.model.get('start_at'))
      }
      else {
        return this.formatDate(moment.utc())
      }
    },
    displayAtMin: function() {
      if (this.model.get('start_at')) {
        return this.formatDate(this.model.get('start_at'))
      }
      else {
        return this.startAtMin
      }
    },
    displayAtMax: function() {
      if (this.model.get('end_at')) {
        return this.formatDate(this.model.get('end_at'))
      }
      else {
        return this.indefinitely
      }
    },
    endAtMin: function() {
      let date = (this.model.get('display_at') || this.model.get('start_at'));
      if (date) {
        return this.formatDate(moment.utc(date).add(1, 'days'))
      }
      else {
        return this.formatDate(moment.utc().add(1, 'days'))
      }
    },
    indefinitely: function() {
      return this.formatDate(moment.utc().add(10, 'years'))
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
    get(attr) {
      console.log('DealEdit get')
      if (false) {
        // placeholder
      }
      else {
        return this.model.get(attr)
      }
    },
    set(attr, newValue) {
      console.log('DealEdit set', newValue)
      if (attr === 'title') {
        this.model.set('title', newValue)
        if (this.calculate_seo_slug) {
          this.set('seo_slug', newValue);
        }
      }
      else if (attr === 'calculate_seo_slug') {
        this.calculate_seo_slug = newValue
        if (this.calculate_seo_slug) {
          this.set('seo_slug', this.model.get('title'));
        }
      }
      else if (attr === 'calculate_dates_all_day') {
        this.calculate_dates_all_day = newValue
        if (this.calculate_dates_all_day) {
          let self = this
          this.dateAttributeNames.forEach(attr => {
            let date = self.model.get(attr)
            date.set({ hour: 0, minute: 0, second: 0 })
            self.model.set(attr, date)
          })
        }
      }
      else {
        this.model.set(attr, newValue)
      }
    },
    formatDate(date) {
      return date.format(this.datesData.format)
    },
    updateDeal() {
      this.loading = true;
      json_api.updateRecord({
        resource: 'deals',
        id:       this.deal_id,
        body: {
          data: {
            id: this.model.get('id'),
            type: this.model.get('type'),
            attributes: this.model.serializedChanges,
          }
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
  },
  components: {
    FormInputTextBox,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang=scss>
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
