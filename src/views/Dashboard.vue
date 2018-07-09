<template>
  <div class="container">
    <h1>{{ msg }}</h1>
    <ul>
      <li v-for="link in linkList">
        <router-link :to="{ name: link.route }">{{ link.text }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      msg: 'Welcome to RetailHub!',
      unsortedLinkList: [
        {
          route: 'MallIndex',
          text: 'Malls'
        },
        {
          route: 'CompanyIndex',
          text: 'Companies'
        },
        {
          route: 'SiteIndex',
          text: 'Sites'
        },
        {
          route: 'DealIndex',
          text: 'Deals'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({ currentUser: 'currentUser' }),
    linkList: function() {
      return _.sortBy(this.unsortedLinkList, link => link.text)
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
body {
  background: #fff;
}
h1, h2 {
  font-weight: normal;
}
a {
  color: #42b983;
}
</style>
