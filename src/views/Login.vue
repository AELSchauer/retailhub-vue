<template>
  <div class="background">
    <div class=login-wrapper border border-light>
      <form class=form-signin @submit.prevent=login>
        <label for=inputEmail class="sr-only ">Email address</label>
        <input v-model=email type=email id=inputEmail class=form-control placeholder=Email address required autofocus>
        <label for=inputPassword class=sr-only>Password</label>
        <input v-model=password type=password id=inputPassword class=form-control placeholder=Password required>
        <div class="alert alert-danger form-error" v-if=error>{{ error }}</div>
        <button class="btn btn-lg btn-primary btn-block" type=submit>Sign in</button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      error: false
    }
  },
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
      if (this.currentUser) {
        this.$router.replace(this.$route.query.redirect || '/dashboard')
      }
    },
    login() {
      this.$http.request({
        method: 'post',
        url: '/accounts/login',
        data: {
          data: {
            type: 'account',
            attributes: {
              email: this.email,
              password: this.password
            }
          }
        },
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json'
        },
        params: {
          include: 'roles'
        }
      })
      .then(request => this.loginSuccessful(request))
      .catch((response) => this.loginFailed(response))
    },
    loginSuccessful (req) {
      if (req.status != 201) {
        this.loginFailed()
        return
      }

      localStorage.json = JSON.stringify({
        id:         req.data.data.id,
        attributes: req.data.data.attributes,
        included:   req.data.included,
      })
      this.$store.dispatch('login')
      this.error = false

      this.$router.replace(this.$route.query.redirect || '/dashboard')
    },
    loginFailed (res) {
      this.error = 'Login failed!'
      this.$store.dispatch('logout')
      delete localStorage.json
    }
  }
}
</script>

<style lang=css>
.background {
  width: 100%;
  height: 100%;
  background: #605B56;
  display: flex;
}
.login-wrapper {
  background: #fff;
  width: 70%;
  margin: 12% auto;
  display: inline-block;
}

.form-signin {
  max-width: 330px;
  padding: 10% 15px;
  margin: 0 auto;
}
.form-signin .form-signin-heading,
.form-signin .checkbox {
  margin-bottom: 10px;
  text-align: center;
}
.form-signin .checkbox {
  font-weight: normal;
}
.form-signin .form-control {
  position: relative;
  height: auto;
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type=email] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type=password] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.form-error {
  text-align: center;
}
</style>
