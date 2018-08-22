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
            :to="{ name: 'DealEdit', params: { deal_id: get('id') }}"
            class='btn edit-button col-md-1'
          >
            Edit
          </router-link>
        </span>
        <div v-for="attribute in deal.attributeManifest" class="attribute row">
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
          {{ get('retailer.name') }}
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
                  <button
                    @click="deleteAssociation(store.record)"
                    :disabled="isDeleteAssociationDisabled(store.record)"
                    class="add-remove"
                  >
                    <font-awesome-icon icon="minus-square" />
                  </button>
                </template>
                <template v-else>
                  <button
                    @click="createAssociation(store.record)"
                    class="add-remove"
                  >
                    <font-awesome-icon icon="plus-square" />
                  </button>
                </template>
              </td>
            </tr>
          </table>
        </div>
        <hr>
        <div class="images-section">
          <h2>images</h2>
          <table>
            <th>
              <td>image</td>
              <td>alt text</td>
            </th>
            <tr v-for="image in get('images')">
              <td>
                <img :src="image.url" class="deal-image">
              </td>
              <td>
                {{ image.alt_text }}
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
import Deal from '@/models/deal'

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
      deal:    null,
      loading: true,
      error:   false,
      deal_id: id,
    }
  },
  computed: {
    ...mapGetters({ currentUser: 'currentUser' }),
    stores: function() {
      let dealStores = this.get('stores');
      let retailerStores = this.get('retailer.stores');

      return _
        .chain(dealStores)
        .concat(retailerStores)
        .sortBy('name')
        .sortedUniqBy('name')
        .map(store => {
          return {
            record: store,
            isAssociated: _
              .chain(dealStores)
              .map('id')
              .includes(store.get('id'))
              .value()
          }
        })
        .value()
    },
    attributeManifest: function() {
      return this.deal.attributeManifest
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
    this.getDeal()
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
    getDeal() {
      Deal.with('images,retailer,retailer.stores,stores').find(this.deal_id)
      .then((record) => {
        record.snapshot()
        this.deal = record
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
      let attribute = this.deal.get(attrName)
      if (attribute && attribute.constructor.name === 'Moment') {
        return attribute.format('YYYY-MM-DD HH:mm:ss')
      }
      else {
        return attribute
      }
    },
    set(attr, newValue) {
      this.deal.set(attr, newValue)
    },
    isDeleteAssociationDisabled(record) {
      return this.deal.get(record.type).length <= 1
    },
    deleteAssociation(record) {
      this.loading = true;
      let newRecords = _
        .chain(this.deal)
        .get(record.type, [])
        .filter(_record => {
          return _record.get('id') != record.get('id')
        })
        .value()

      this.set(record.type, newRecords)
      this.deal.save()
      .catch((error) => {
        console.error('request failed', error);
        this.error = true;
      })
      .finally(() => {
        this.loading = false
      })
    },
    createAssociation(record) {
      this.loading = true
      let newRecords = _
        .chain(this.deal)
        .get(record.type, [])
        .concat([record])
        .value()

      this.set(record.type, newRecords)
      this.deal.save()
      .catch((error) => {
        console.error('request failed', error);
        this.error = true;
      })
      .finally(() => {
        this.loading = false
      })
    },
  }
}
</script>

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
.deal-image {
  height: 100px;
}
</style>
