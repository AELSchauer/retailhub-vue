<template>
  <div class="container">
    <section v-if="error">
      <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
    </section>
    <section v-else>
      <div v-if="loading">Loading...</div>
      <div v-else>
        <span class="row">
          <h2 class="section-title col-md-11">details</h2>
          <router-link 
            :to="{ name: 'DealEdit', params: { deal_id: model.id }}"
            class='btn edit-button col-md-1'
          >
            Edit
          </router-link>
        </span>
        <div v-for="attribute in model.attributeManifest" class="attribute row">
          <div class="attribute-label col-md-2">
            {{ attribute.label }}
          </div>
          <div class="attribute-value col-md-10">
            {{ get(attribute.name) }}
          </div>
        </div>
        <hr>
        <div class="retailer-section">
          <h2>retailer</h2>
          {{ model.retailer.name }}
        </div>
        <hr>
        <div class="stores-section">
          <h2>stores</h2>
          <h4>current associations</h4>
          <table>
            <th>
              <td>name</td>
              <td></td>
            </th>
            <tr v-for="store in stores">
              <td>
                {{ store.record.name }}
              </td>
              <td>
                <template v-if="store.isAssociated">
                  <!-- <font-awesome-icon icon="minus-square"  @click="deleteAssociation(store)" /> -->
                  <button @click="deleteAssociations(store.record)" class="add-remove">-</button>
                </template>
                <template v-else>
                  <!-- <font-awesome-icon icon="plus-square" @click="createAssociation(store)" /> -->
                  <button @click="createAssociations(store.record)" class="add-remove">+</button>
                </template>
              </td>
            </tr>
          </table>
        </div>
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
    let id = this.$route.params.deal_id

    return {
      permissions: ['admin'],
      breadcrumbs: [
        {
          name: 'DealIndex',
          text: 'Deals',
        },
        {
          text: id,
        }
      ],
      model:    null,
      loading:  true,
      error:    false,
      model_id: id,
    }
  },
  computed: {
    ...mapGetters({ currentUser: 'currentUser' }),
    stores: function() {
      let stores = _.chain(this.model.stores);

      return stores
        .concat(this.model.retailer.stores)
        .sortBy('name')
        .sortedUniqBy('name')
        .map(store => {
          return {
            record: store,
            isAssociated: stores.map('id').includes(store.id).value()
          }
        })
        .value()
    },
    attributeManifest: function() {
      return this.model.attributeManifest
    },
  },
  created() {
    this.checkCurrentLogin()
    this.checkCurrentPermissions()
    this.$store.dispatch('breadcrumbs', this.breadcrumbs)
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
      Deal.with('retailer,stores,retailer.stores').find(this.model_id)
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
    get(attrName) {
      let attribute = this.model.get(attrName)
      if (attribute && attribute.constructor.name === 'Moment') {
        return attribute.format('YYYY-MM-DD HH:mm:ss')
      }
      else {
        return attribute
      }
    },
    deleteAssociations(record) {
      this.loading = true
      json_api.deleteAssociations({
        resource: 'deals',
        id: this.deal_id,
        associatedRecords: [
          { type: record.type, id: record.id }
        ]
      })
      .then(() => {
        return json_api.peekRecord({
          resource: 'deals',
          id:       this.deal_id,
          options:  {
            params: { include: 'retailer,stores,retailer.stores' }
          }
        })
      })
      .then((record) => {
        this.model = record
      })
      .catch((error) => {
        console.error('request failed', error);
        this.error = true;
      })
      .finally(() => this.loading = false)
    },
    createAssociations(record) {
      this.loading = true
      json_api.createAssociations({
        resource: 'deals',
        id: this.deal_id,
        associatedRecords: [
          { type: record.type, id: record.id }
        ]
      })
      .then(() => {
        return json_api.peekRecord({
          resource: 'deals',
          id:       this.deal_id,
          options:  {
            params: { include: 'retailer,stores,retailer.stores' }
          }
        })
      })
      .then((record) => {
        this.model = record
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
.container {
  margin-top: 10px;
}
.section-title {
  display: inline-block;
  margin: 0;
}
.btn {
  background-color: #42b983;
  color: #fff;
}
.attribute-label {
  padding: 0 10px 0 0;
}
.add-remove {
  width: 30px;
  text-align: center;
}
</style>
