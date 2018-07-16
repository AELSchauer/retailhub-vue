<template>
<!--   <nav class="navbar navbar-expand-md navbar-dark bg-retailhub row">
    <a class="navbar-brand col-md-1" href="/">RetailHub</a>
    <router-link class="nav-item nav-link col-md-8" :to="{ name: 'Dashboard' }">Dashboard</router-link>

    <span class=" col-md-3 current-user">
      <p class="navbar-text">{{ currentUser.email }}</p>
      <router-link to="/logout" class="btn btn-logout btn-sm">Logout</router-link>
    </span>
  </nav> -->
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <router-link to="/" class="navbar-brand">RetailHub</router-link>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav">
      <li class="nav-item">
        <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
      </li>
    </ul>
    <ul class="navbar-nav ml-auto">
      <li class="nav-item">
        <router-link to="/logout" class="btn btn-logout btn-sm">Logout</router-link>
      </li>
    </ul>
  </div>
</nav>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Navbar',
  computed: {
    ...mapGetters({ currentUser: 'currentUser' })
  }
}
</script>

<style lang="scss" scoped>
.bg-retailhub {
  background: #605B56 !important;
}

.current-user {
  text-align: right;
}

.btn-logout {
  background-color: #837A75;
  border-color: #837A75;
  color: #fff;
}

.btn-logout:hover {
  background-color: darken(#837A75, 20%);
  border-color: darken(#837A75, 20%);
  color: #fff;
}
</style>
