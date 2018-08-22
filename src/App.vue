<template>
  <div id="app">
    <template v-if="currentUser">
      <Navbar></Navbar>
      <Breadcrumbs></Breadcrumbs>
    </template>
    <div class="container-fluid">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import $store from '@/store'; // import this to avoid some weird inheritance bug.
import { mapGetters } from 'vuex'
import Navbar from '@/components/Navbar'
import Breadcrumbs from '@/components/Breadcrumbs'

export default {
  name: 'app',
  computed: {
    ...mapGetters({ currentUser: 'currentUser' })
  },
  created() {
    this.checkCurrentLogin()
  },
  updated() {
    this.checkCurrentLogin()
  },
  methods: {
    checkCurrentLogin() {
      if (!this.currentUser && this.$route.path !== '/') {
        this.$router.push('/?redirect=' + this.$route.path)
      }
    }
  },
  components: {
    Navbar,
    Breadcrumbs
  }
}
</script>

<style>
  
</style>
