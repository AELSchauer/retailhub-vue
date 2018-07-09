<template>
  <div class="container">
    <section v-if="error">
      <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
    </section>
    <section v-else>
      <div v-if="loading">Loading...</div>
      <div v-else>
        <h2>details</h2>
        <table>
          <tr v-for="attribute in attributeManifest" class="attribute">
            <td class="attribute-label">{{ attribute.label }}</td>
            <td class="attribute-value">{{ model[attribute.name] }}</td>
          </tr>
        </table>
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
    return {
      permissions: ['admin'],
      model:       null,
      loading:     true,
      error:       false,
      deal_id:     this.$route.params.deal_id,
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
      })
      .catch((error) => {
        console.error('request failed', error);
        this.error = true;
      })
      .finally(() => {
        this.loading = false
      })
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