<template>
  <div>
    <template v-for="(breadcrumb, index) in breadcrumbs">
      <router-link v-if="breadcrumb.name"
        :to="{ name: breadcrumb.name, params: breadcrumb.params }"
      >
        {{ breadcrumb.text }}
      </router-link>
      <span v-else>
        {{ breadcrumb.text }}
      </span>
      <span v-if="index < (breadcrumbs.length - 1)">
        >
      </span>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Breadcrumbs',
  computed: {
    ...mapGetters({
      currentUser: 'currentUser',
      increment: 'increment',
      breadcrumbs: 'breadcrumbs',
    }),
  }
}
</script>

<style lang="scss" scoped>
.bg-retailhub {
  background: #605B56 !important;
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

