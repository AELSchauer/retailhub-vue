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
            <!-- <form-input
              attribute="title"
              label="Title"
              labelClass="col-md-2"
              rootClass="row"
              :options="{ 
                type: 'text', 
                required: true, 
                autofocus: true,
                class: 'form-control col-md-9'
              }"
            ></form-input> -->
            <div class="row">
              <label for="inputSeoSlug" class="form-label col-md-2">
                SEO Slug
              </label>
              <input
                :value="get('seo_slug')"
                @input="set('seo_slug', $event.target.value)"
                id="inputSeoSlug"
                class="form-control col-md-9"
                :disabled="component_calculate_seo_slug"
                required
              >
              <input
                :checked="component_calculate_seo_slug"
                @input="set('component_calculate_seo_slug', $event.target.checked)"
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
            <!-- <form-input
              attribute="external_url"
              label="Website Address"
              labelClass="col-md-2"
              rootClass="row"
              :options="{ 
                'type': 'url', 
                'class': 'form-control col-md-9'
              }"
            ></form-input>
            <form-checkbox
              attribute="is_local"
              label="Is Local?"
              labelClass="col-md-2"
              rootClass="row"
              :options="{ 
                class: 'form-control col-md-1'
              }"
            ></form-checkbox>
            <form-checkbox
              attribute="is_featured"
              label="Is Featured?"
              labelClass="col-md-2"
              rootClass="row"
              :options="{ 
                class: 'form-control col-md-1'
              }"
            ></form-checkbox>
            <form-checkbox
              attribute="is_live"
              label="Is Live?"
              labelClass="col-md-2"
              rootClass="row"
              :options="{ 
                class: 'form-control col-md-1'
              }"
            ></form-checkbox> -->
            <!-- <br>
            <form-checkbox
              attribute="component_calculate_dates_all_day"
              label="All Day?"
              labelClass="col-md-2"
              rootClass="row"
              :options="{ 
                class: 'form-control col-md-1'
              }"
            ></form-checkbox>
            <form-date-time
              attribute="start_at"
              label="Start Date"
              labelClass="col-md-2"
              rootClass="row"
              :options="{ 
                type: dateType,
                class: 'form-control col-md-9',
                min: startAtMin,
                max: indefinitely,
                required: true,
              }"
            ></form-date-time>
            <form-date-time
              attribute="end_at"
              label="End Date"
              labelClass="col-md-2"
              rootClass="row"
              :options="{ 
                type: dateType,
                class: 'form-control col-md-9',
                min: endAtMin,
                max: indefinitely,
                required: true,
              }"
            ></form-date-time>
            <form-date-time
              attribute="display_at"
              label="Display Date"
              labelClass="col-md-2"
              rootClass="row"
              :options="{ 
                type: dateType,
                class: 'form-control col-md-9',
                min: displayAtMin,
                max: displayAtMax,
                required: true,
              }"
            ></form-date-time> -->
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

import FormCheckbox from '@/components/form-elements/checkbox'
import FormDateTime from '@/components/form-elements/date-time'
import FormInput from '@/components/form-elements/input'

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
      
      component_calculate_seo_slug:      true,
      component_calculate_dates_all_day: true
    }
  },
  computed: {
    ...mapGetters({ currentUser: 'currentUser' }),
    startAtMin: function() {
      let today = moment.utc()
      let start_at = this.model.get('start_at')
      if (start_at && start_at.isValid() && start_at < today) {
        return start_at
      }
      else {
        return today
      }
    },
    displayAtMin: function() {
      let start_at = this.model.get('start_at')
      return (start_at && start_at.isValid()) ? (start_at) : (this.startAtMin)
    },
    endAtMin: function() {
      let date = (this.model.get('display_at') || this.model.get('start_at'));
      return (date) ? (moment.utc(date).add(1, 'd')) : (moment.utc().add(1, 'd'))
    },
    displayAtMax: function() {
      if (this.model.get('end_at')) {
        return moment.utc(this.model.get('end_at')).subtract(1, 'd')
      }
      else {
        return this.indefinitely
      }
    },
    indefinitely: function() {
      return moment.utc().add(10, 'years')
    },
    dateType: function() {
      return (this.component_calculate_dates_all_day) ? ('date') : ('datetime-local');
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
        this.component_calculate_dates_all_day = _
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
      if (attr.indexOf('component_') === 0) {
        return this[attr]
      }
      else {
        return this.model.get(attr)
      }
    },
    set(attr, newValue) {
      if (attr === 'title') {
        this.model.set('title', newValue)
        if (this.component_calculate_seo_slug) {
          this.set('seo_slug', newValue);
        }
      }
      else if (attr === 'component_calculate_seo_slug') {
        this.component_calculate_seo_slug = newValue
        if (this.component_calculate_seo_slug) {
          this.set('seo_slug', this.model.get('title'));
        }
      }
      else if (attr === 'component_calculate_dates_all_day') {
        this.component_calculate_dates_all_day = newValue
        if (this.component_calculate_dates_all_day) {
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
        this.component_calculate_dates_all_day = _
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
    FormCheckbox,
    FormDateTime,
    FormInput,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang=scss>
@import "~@/styles/placeholders";

.form-label {
  @extend %form-label;
}
.row {
  padding: 5px 0;
}
.btn-row {
  padding: 0px 5px;
}
</style>
