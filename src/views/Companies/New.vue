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
              attribute="name"
              :labelProps="{
                content: 'Name',
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
              attribute="nick_name"
              :labelProps="{
                content: 'Nickame',
                class: 'col-md-2',
              }"
              :rootProps="{
                class: 'row'
              }"
              :inputProps="{ 
                type: 'text',
                required: true,
                disabled: attribute_calculate_nickname,
                class: 'form-control col-md-9',
              }"
              :toggle="{
                attribute: 'attribute_calculate_nickname',
                class: 'col-md-1',
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
            <form-input
              attribute="address"
              :labelProps="{
                content: 'Address',
                class: 'col-md-2',
              }"
              :rootProps="{
                class: 'row'
              }"
              :inputProps="{ 
                type: 'text',
                required: true,
                class: 'form-control col-md-9',
              }"
            ></form-input>
            <form-input
              attribute="city"
              :labelProps="{
                content: 'City',
                class: 'col-md-2',
              }"
              :rootProps="{
                class: 'row'
              }"
              :inputProps="{ 
                type: 'text',
                required: true,
                class: 'form-control col-md-9',
              }"
            ></form-input>
            <form-input
              attribute="state"
              :labelProps="{
                content: 'State',
                class: 'col-md-2',
              }"
              :rootProps="{
                class: 'row'
              }"
              :inputProps="{ 
                type: 'text',
                required: true,
                class: 'form-control col-md-9',
              }"
            ></form-input>
            <form-input
              attribute="zip"
              :labelProps="{
                content: 'Zip Code',
                class: 'col-md-2',
              }"
              :rootProps="{
                class: 'row'
              }"
              :inputProps="{ 
                type: 'text',
                required: true,
                class: 'form-control col-md-9',
              }"
            ></form-input>
            <form-input
              attribute="phone"
              :labelProps="{
                content: 'Phone Number',
                class: 'col-md-2',
              }"
              :rootProps="{
                class: 'row'
              }"
              :inputProps="{ 
                type: 'text',
                required: true,
                class: 'form-control col-md-9',
              }"
            ></form-input>
            <form-input
              attribute="fax"
              :labelProps="{
                content: 'Fax Number',
                class: 'col-md-2',
              }"
              :rootProps="{
                class: 'row'
              }"
              :inputProps="{ 
                type: 'text',
                required: true,
                class: 'form-control col-md-9',
              }"
            ></form-input>
            <form-input
              attribute="url"
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
                :to="{ name: 'CompanyIndex' }"
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

import Company from '@/models/company'

import FormCheckbox from '@/components/form-elements/checkbox'
import FormDateTime from '@/components/form-elements/date-time'
import FormInput    from '@/components/form-elements/input'
import FormSelect   from '@/components/form-elements/select'
import FormTextarea from '@/components/form-elements/textarea'

export default {
  name: 'CompanyNew',
  data() {
    return {
      permissions: ['admin'],
      breadcrumbs: [
        {
          name:   'CompanyIndex',
          text:   'Companys',
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

      dateAttributeNames: Company.dateAttributeNames,
      validationErrors:   null,
      
      attribute_calculate_nickname: true,
      attribute_calculate_seo_slug: true,
    }
  },
  computed: {
    ...mapGetters({ currentUser: 'currentUser' }),
    isChangesEmpty: function() {
      return _.isEmpty(this.company.changes)
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
    this.getCompany()
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
    getCompany() {
      return Company
        .new()
        .then((record) => {
          this.company = record
        })
    },
    get(attr) {
      if (attr.indexOf('attribute_') === 0) {
        return this[attr]
      }
      else {
        return this.company.get(attr)
      }
    },
    set(attr, newValue) {
      if (attr === 'title') {
        this.company.set('title', newValue)
        if (this.attribute_calculate_seo_slug) {
          this.set('seo_slug', newValue);
        }
        if (this.attribute_calculate_nickname) {
          this.set('nick_name', newValue)
        }
      }
      else if (attr === 'attribute_calculate_seo_slug') {
        this.attribute_calculate_seo_slug = newValue
        if (this.attribute_calculate_seo_slug) {
          this.set('seo_slug', this.company.get('title'));
        }
      }
      else if (attr === 'attribute_calculate_nickname') {
        this.attribute_calculate_nickname = newValue
        if (this.attribute_calculate_nickname) {
          this.set('nick_name', this.company.get('title'));
        }
      }
      else {
        this.company.set(attr, newValue)
      }
    },
    saveAction() {
      this.loading = true
      this.company.save()
      .then(() => {
        this.saved = true
        this.$router.push('/companies/' + this.company.id)
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
