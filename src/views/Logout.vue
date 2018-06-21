<template></template>

<script>
export default {
  name: 'Logout',
  created() {
    delete localStorage.token
    delete localStorage.json
    this.$store.dispatch('logout')
    this.$router.push('/')
  }
}
</script>
