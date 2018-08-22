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
            :to="{ name: 'CompanyEdit', params: { company_id: get('id') }}"
            class='btn edit-button col-md-1'
          >
            Edit
          </router-link>
        </span>
        <div v-for="attribute in company.attributeManifest" class="attribute row">
          <div class="attribute-label col-md-2">
            {{ attribute.label }}
          </div>
          <div class="attribute-value col-md-10">
            {{ get(attribute.name) }}
          </div>
        </div>
        <hr>
        <div class="malls-section">
          <h2>malls</h2>
          <table>
            <tr>
              <th>name</th>
              <th></th>
            </tr>
            <tr v-for="mall in malls">
              <td>
                {{ mall.get('name') }}
              </td>
            </tr>
          </table>
        </div>
        <hr>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Company from '@/models/company'

export default {
  name: 'CompanyShow',
  data() {
    let id = this.$route.params.company_id

    return {
      permissions: ['admin'],
      breadcrumbs: [
        {
          name: 'CompanyIndex',
          text: 'Companies',
        },
        {
          text: id,
        }
      ],
      company:    null,
      loading: true,
      error:   false,
      company_id: id,
    }
  },
  computed: {
    ...mapGetters({ currentUser: 'currentUser' }),
    malls: function() {
      return this.get('malls');
    },
    attributeManifest: function() {
      return this.company.attributeManifest
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
    this.getCompany()
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
    getCompany() {
      Company.with('malls').find(this.company_id)
      .then((record) => {
        record.snapshot()
        this.company = record
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
      let attribute = this.company.get(attrName)
      if (attribute && attribute.constructor.name === 'Moment') {
        return attribute.format('YYYY-MM-DD HH:mm:ss')
      }
      else {
        return attribute
      }
    },
    set(attr, newValue) {
      this.company.set(attr, newValue)
    },
    isDeleteAssociationDisabled(record) {
      return this.company.get(record.type).length <= 1
    },
    deleteAssociation(record) {
      this.loading = true;
      let newRecords = _
        .chain(this.company)
        .get(record.type, [])
        .filter(_record => {
          return _record.get('id') != record.get('id')
        })
        .value()

      this.set(record.type, newRecords)
      this.company.save()
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
        .chain(this.company)
        .get(record.type, [])
        .concat([record])
        .value()

      this.set(record.type, newRecords)
      this.company.save()
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
