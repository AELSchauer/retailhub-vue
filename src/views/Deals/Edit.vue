<template>
  <div class="container">
    <section v-if="error">
      <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
    </section>
    <section v-else>
      <div v-if="loading">Loading...</div>
      <div v-else>
        <h2>details</h2>
        <form @submit.prevent="updateAction()" autocomplete="off">
          <div class=alert alert-danger v-if=validationErrors>{{ validationErrors }}</div>
          <div class="container">
            <form-input
              attribute="title"
              label="Title"
              labelClass="col-md-2"
              rootClass="row"
              :inputProps="{ 
                type: 'text',
                required: true,
                autofocus: true,
                class: 'form-control col-md-9',
              }"
            ></form-input>
            <form-input
              attribute="seo_slug"
              label="SEO Title"
              labelClass="col-md-2"
              rootClass="row"
              :inputProps="{ 
                type: 'text',
                required: true,
                disabled: component_calculate_seo_slug,
                class: 'form-control col-md-9',
              }"
              :toggle="{
                attribute: 'component_calculate_seo_slug',
                class: 'col-md-1',
              }"
            ></form-input>
            <form-select
              attribute="sales_type"
              label="Sale Type"
              labelClass="col-md-2"
              rootClass="row"
              :inputProps="{ 
                required: true,
                class: 'form-control col-md-9',
              }"
              :selectOptions="[
                {
                  text: 'Please select one',
                  value:'',
                  disabled: true,
                },
                {
                  text: 'Sales and Promos',
                },
                {
                  text: 'New Arrivals',
                },
                {
                  text: 'In-Store Event',
                },
                {
                  text: 'Style Notes',
                },
              ]"
            ></form-select>
            <form-textarea
              attribute="description"
              label="Description"
              labelClass="col-md-2"
              rootClass="row"
              :inputProps="{ 
                required: true, 
                class: 'form-control col-md-9'
              }"
            ></form-textarea>
            <form-textarea
              attribute="fine_print_description"
              label="Fine Print"
              labelClass="col-md-2"
              rootClass="row"
              :inputProps="{ 
                required: true, 
                class: 'form-control col-md-9'
              }"
            ></form-textarea>
            <form-input
              attribute="external_url"
              label="Website Address"
              labelClass="col-md-2"
              rootClass="row"
              :inputProps="{ 
                'type': 'url', 
                'class': 'form-control col-md-9'
              }"
            ></form-input>
            <form-checkbox
              attribute="is_local"
              label="Is Local?"
              labelClass="col-md-2"
              rootClass="row"
              :inputProps="{ 
                class: 'form-control col-md-1'
              }"
            ></form-checkbox>
            <form-checkbox
              attribute="is_featured"
              label="Is Featured?"
              labelClass="col-md-2"
              rootClass="row"
              :inputProps="{ 
                class: 'form-control col-md-1'
              }"
            ></form-checkbox>
            <form-checkbox
              attribute="is_live"
              label="Is Live?"
              labelClass="col-md-2"
              rootClass="row"
              :inputProps="{ 
                class: 'form-control col-md-1'
              }"
            ></form-checkbox>
            <br>
            <form-checkbox
              attribute="component_calculate_dates_all_day"
              label="All Day?"
              labelClass="col-md-2"
              rootClass="row"
              :inputProps="{ 
                class: 'form-control col-md-1'
              }"
            ></form-checkbox>
            <form-date-time
              attribute="start_at"
              label="Start Date"
              labelClass="col-md-2"
              rootClass="row"
              :inputProps="{ 
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
              :inputProps="{ 
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
              :inputProps="{ 
                type: dateType,
                class: 'form-control col-md-9',
                min: displayAtMin,
                max: displayAtMax,
                required: true,
              }"
            ></form-date-time>
            <!-- 
            The API doesn't currently support end_date_visibility or end_at_text
            in post or patch requests.
             -->
            <!-- <form-select
              attribute="end_at_text"
              label="End Date Text"
              labelClass="col-md-2"
              rootClass="row"
              :inputProps="{ 
                required: true,
                class: 'form-control col-md-9',
              }"
              :selectOptions="[
                {
                  text: 'Please select one',
                  value:'',
                  disabled: true,
                },
                {
                  text: 'Show Dates',
                },
                {
                  text: `${doubleQuotes}Limited Time${doubleQuotes}`,
                  value: 'Limited Time',
                },
                {
                  text: `${doubleQuotes}Ongoing${doubleQuotes}`,
                  value: 'Ongoing',
                },
              ]"
            ></form-select> -->
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
              <button
                @click="cancelAction()"
                class="btn btn-lg btn-primary btn-block"
              >
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

import FormCheckbox from '@/components/form-elements/checkbox'
import FormDateTime from '@/components/form-elements/date-time'
import FormInput from '@/components/form-elements/input'
import FormSelect from '@/components/form-elements/select'
import FormTextarea from '@/components/form-elements/textarea'

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
    doubleQuotes: function() {
      return String.fromCharCode(34);
    }
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
    updateAction() {
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
      .then(() => {
        this.$router.push('/deals/' + this.deal_id)
      })
      .catch((error) => {
        console.error('request failed', error);
        this.error = true;
      })
      .finally(() => {
        this.loading = false
      })
    },
    cancelAction() {
      this.model.rollback()
      this.$router.push('/deals/' + this.deal_id)
    },
  },
  components: {
    FormCheckbox,
    FormDateTime,
    FormInput,
    FormSelect,
    FormTextarea,
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
