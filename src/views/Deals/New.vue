<template>
  <div class="container">
    <section v-if="error">
      <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
    </section>
    <section v-else>
      <div v-if="loading">Loading...</div>
      <div v-else>
        <h2>details</h2>
        <form @submit.prevent="saveAction()" autocomplete="off">
          <div class=alert alert-danger v-if=validationErrors>{{ validationErrors }}</div>
          <div class="container">
            <form-input
              attribute="title"
              :labelProps="{
                content: 'Title',
                class: 'col-md-2',
              }"
              :rootProps="{
                class: 'row'
              }"
              :inputProps="{ 
                type: 'text',
                required: true,
                autofocus: true,
                class: 'form-control col-md-9',
              }"
            ></form-input>
            <form-input
              attribute="seo_slug"
              :labelProps="{
                content: 'SEO Title',
                class: 'col-md-2',
              }"
              :rootProps="{
                class: 'row'
              }"
              :inputProps="{ 
                type: 'text',
                required: true,
                disabled: attribute_calculate_seo_slug,
                class: 'form-control col-md-9',
              }"
              :toggle="{
                attribute: 'attribute_calculate_seo_slug',
                class: 'col-md-1',
              }"
            ></form-input>
            <form-select
              attribute="sales_type"
              :labelProps="{
                content: 'Sale Type',
                class: 'col-md-2',
              }"
              :rootProps="{
                class: 'row'
              }"
              :inputProps="{ 
                required: true,
                class: 'form-control col-md-9',
              }"
              :selectOptions="[
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
              :labelProps="{
                content: 'Description',
                class: 'col-md-2',
              }"
              :rootProps="{
                class: 'row'
              }"
              :inputProps="{ 
                required: true, 
                class: 'form-control col-md-9'
              }"
            ></form-textarea>
            <form-textarea
              attribute="fine_print_description"
              :labelProps="{
                content: 'Fine Print',
                class: 'col-md-2',
              }"
              :rootProps="{
                class: 'row'
              }"
              :inputProps="{ 
                required: true, 
                class: 'form-control col-md-9'
              }"
            ></form-textarea>
            <form-input
              attribute="external_url"
              :labelProps="{
                content: 'Website Address',
                class: 'col-md-2',
              }"
              :rootProps="{
                class: 'row'
              }"
              :inputProps="{ 
                'type': 'url', 
                'class': 'form-control col-md-9'
              }"
            ></form-input>
            <form-checkbox
              attribute="is_local"
              :labelProps="{
                content: 'Is Local?',
                class: 'col-md-2',
              }"
              :rootProps="{
                class: 'row'
              }"
              :inputProps="{ 
                class: 'form-control col-md-1'
              }"
            ></form-checkbox>
            <form-checkbox
              attribute="is_featured"
              :labelProps="{
                content: 'Is Featured?',
                class: 'col-md-2',
              }"
              :rootProps="{
                class: 'row'
              }"
              :inputProps="{ 
                class: 'form-control col-md-1'
              }"
            ></form-checkbox>
            <form-checkbox
              attribute="is_live"
              :labelProps="{
                content: 'Is Live?',
                class: 'col-md-2',
              }"
              :rootProps="{
                class: 'row'
              }"
              :inputProps="{ 
                class: 'form-control col-md-1'
              }"
            ></form-checkbox>
            <br>
            <form-checkbox
              attribute="attribute_calculate_dates_all_day"
              :labelProps="{
                content: 'All Day?',
                class: 'col-md-2',
              }"
              :rootProps="{
                class: 'row'
              }"
              :inputProps="{ 
                class: 'form-control col-md-1'
              }"
            ></form-checkbox>
            <form-date-time
              attribute="start_at"
              :labelProps="{
                content: 'Start Date',
                class: 'col-md-2',
              }"
              :rootProps="{
                class: 'row'
              }"
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
              :labelProps="{
                content: 'End Date',
                class: 'col-md-2',
              }"
              :rootProps="{
                class: 'row'
              }"
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
              :labelProps="{
                content: 'Display Date',
                class: 'col-md-2',
              }"
              :rootProps="{
                class: 'row'
              }"
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
              :labelProps="{
                content: 'End Date Text',
                class: 'col-md-2',
              }"
              :rootProps="{
                class: 'row'
              }"
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
            <form-select
              attribute="retailer_id"
              :labelProps="{
                content: 'Retailer',
                class: 'col-md-2',
              }"
              :rootProps="{
                class: 'row'
              }"
              :inputProps="{ 
                required: true,
                class: 'form-control col-md-9',
              }"
              :selectOptions="retailerSelectList"
            ></form-select>
            <form-select
              attribute="store_ids"
              :labelProps="{
                content: 'Stores',
                class: 'col-md-2',
              }"
              :rootProps="{
                class: 'row'
              }"
              :inputProps="{ 
                required: true,
                multiple: true,
                class: 'form-control col-md-9',
              }"
              :selectOptions="storeSelectList"
            ></form-select>
          </div>
          <br>
          <div class="row">
            <div class="col-md-6 btn-row">
              <button
                class="btn btn-lg btn-primary btn-block"
                type="submit"
              >
                Submit
              </button>
            </div>
            <div class="col-md-6 btn-row">
              <router-link 
                :to="{ name: 'DealIndex' }"
                class='btn btn-lg btn-primary btn-block'
              >
                Cancel
              </router-link>
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

import Deal from '@/models/deal'
import Retailer from '@/models/retailer'

import FormCheckbox from '@/components/form-elements/checkbox'
import FormDateTime from '@/components/form-elements/date-time'
import FormInput    from '@/components/form-elements/input'
import FormSelect   from '@/components/form-elements/select'
import FormTextarea from '@/components/form-elements/textarea'

export default {
  name: 'DealNew',
  data() {
    return {
      permissions: ['admin'],
      breadcrumbs: [
        {
          name:   'DealIndex',
          text:   'Deals',
        },
        {
          text:   'New',
        }
      ],

      deal:      null,
      retailers: [],
      loading:   true,
      saved:     false,
      error:     false,

      dateAttributeNames: Deal.dateAttributeNames,
      validationErrors:   null,
      
      attribute_calculate_seo_slug:      true,
      attribute_calculate_dates_all_day: true,
    }
  },
  computed: {
    ...mapGetters({ currentUser: 'currentUser' }),
    startAtMin: function() {
      let today = moment.utc()
      let start_at = this.deal.get('start_at')
      if (start_at && start_at.isValid() && start_at < today) {
        return start_at
      }
      else {
        return today
      }
    },
    displayAtMin: function() {
      let start_at = this.deal.get('start_at')
      return (start_at && start_at.isValid()) ? (start_at) : (this.startAtMin)
    },
    endAtMin: function() {
      let date = (this.deal.get('display_at') || this.deal.get('start_at'));
      return (date) ? (moment.utc(date).add(1, 'd')) : (moment.utc().add(1, 'd'))
    },
    displayAtMax: function() {
      if (this.deal.get('end_at')) {
        return moment.utc(this.deal.get('end_at')).subtract(1, 'd')
      }
      else {
        return this.indefinitely
      }
    },
    indefinitely: function() {
      return moment.utc().add(10, 'years')
    },
    dateType: function() {
      return (this.attribute_calculate_dates_all_day) ? ('date') : ('datetime-local');
    },
    isChangesEmpty: function() {
      return _.isEmpty(this.deal.changes)
    },
    doubleQuotes: function() {
      return String.fromCharCode(34);
    },
    stores: function() {
      return this.get('retailer.stores') || []
    },
    retailerSelectList: function() {
      return this.retailers.map(retailer => {
        return {
          text: retailer.name,
          value: retailer.id
        }
      })
    },
    storeSelectList: function() {
      return this.stores.map(store => {
        return {
          text: store.name,
          value: store.id
        }
      })
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
    this.getDeal()
    .then(() => {
      this.getRetailers()
    })
    .finally(() => {
      this.loading = false;
    })
  },
  // beforeRouteLeave(to, from, next) {
  //   if (this.isChangesEmpty || this.saved) {
  //     next()
  //   }
  //   else {
  //     let confirm = window.confirm('Do you really want to leave? All unsaved changes will be lost.')
  //     if (confirm) {
  //       //////////////////////// delete deal from store
  //       next()
  //     }
  //     else {
  //       next(false)
  //     }
  //   }
  // },
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
    getDeal() {
      return Deal
        .new()
        .then(model => {
          this.deal = model
        })
    },
    getRetailers() {
      return Retailer
        .with('stores').all()
        .then(collection => {
          this.retailers = collection
        })
    },
    get(attr) {
      if (attr.indexOf('attribute_') === 0) {
        return this[attr]
      }
      else if (attr === 'store_ids') {
       return this.deal.get('stores').map(store => store.id)
      }
      else {
        return this.deal.get(attr)
      }
    },
    set(attr, newValue) {
      if (attr === 'title') {
        this.deal.set('title', newValue)
        if (this.attribute_calculate_seo_slug) {
          this.set('seo_slug', newValue);
        }
      }
      else if (attr === 'retailer_id') {
        this.deal.set('retailer_id', newValue)
        this.deal.set('retailer', this.retailers.find(retailer => retailer.id === newValue))
      }
      else if (attr === 'store_ids') {
        let stores = this.stores.filter(store => {
          return _.includes(newValue, store.id)
        })
        this.deal.set('stores', stores)
      }
      else if (attr === 'attribute_calculate_seo_slug') {
        this.attribute_calculate_seo_slug = newValue
        if (this.attribute_calculate_seo_slug) {
          this.set('seo_slug', this.deal.get('title'));
        }
      }
      else if (attr === 'attribute_calculate_dates_all_day') {
        this.attribute_calculate_dates_all_day = newValue
        if (this.attribute_calculate_dates_all_day) {
          let self = this
          this.dateAttributeNames.forEach(attr => {
            let date = self.deal.get(attr)
            date.set({ hour: 0, minute: 0, second: 0 })
            self.deal.set(attr, date)
          })
        }
      }
      else {
        this.deal.set(attr, newValue)
      }
    },
    saveAction() {
      this.loading = true
      this.deal.save()
      .then(() => {
        this.saved = true
        this.$router.push('/deals/' + this.deal.id)
      })
      .catch(error => {
        console.error('error', error)
        this.error = true
      })
      .finally(() => {
        this.loading == false
      })
    },
  },
  components: {
    FormCheckbox,
    FormDateTime,
    FormInput,
    FormSelect,
    FormTextarea,
    FormTextarea,
  }
}
</script>


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
