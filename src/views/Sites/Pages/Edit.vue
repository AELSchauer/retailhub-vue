<template>
  <section v-if="error">
    <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
  </section>
  <div v-else-if="loading">
    Loading...
  </div>
  <div v-else class="row">
    <div class="component-tree container col-md-8">
      <draggable
        v-model="body"
        class="children-list"
        element="ol"
        :options="{group:'body'}"
        @start="drag=true"
        @end="drag=false"
      >
        <template v-for="bentoComponent in body">
          <bento-base-component-body
            :key="bentoComponent.id"
            :model="bentoComponent"
            :bus="bus"
          ></bento-base-component-body>
        </template>
      </draggable>
    </div>
    <div class="component-details-aside container col-md-4">
      <div class="row">
        <span class="col-md-11 component-name">
          {{ detailComponent.model.name }}
        </span>
        <span class="col-md-1">
          <button @click="closeComponentDetails" class="close-component-details">x</button>
        </span>
      </div>
      <template v-if="detailComponent.model.name">
        <hr>
        attributes:
        <bento-base-component-attributes
          :model="detailComponent.model"
        ></bento-base-component-attributes>
        <hr>
        meta:
        {{ detailComponent.model.meta }}
      </template>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import draggable from 'vuedraggable'
import changeset from '../../../models/_changeset'

import Page from '../../../models/page'
import BentoComponent from '../../../models/bento/component'
import BentoBaseComponentAttributes from '@/components/site-editor/bento-components/attributes'
import BentoBaseComponentBody from '@/components/site-editor/bento-components/body'


export default {
  name: 'SitePageEdit',
  data() {
    return {
      permissions: ['admin'],
      error:       false,
      loading:     true,

      body: null,
      page: null,
      bus:  new Vue(),

      detailComponent: { model: new BentoComponent() }
    }
  },
  computed: {
    ...mapGetters({ currentUser: 'currentUser' })
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
    this.getPage()
    this.bus.$on('selectedComponent', (component) => {
      this.viewComponentDetails(component)
    })
  },
  methods: {
    viewComponentDetails: function(component) {
      this.detailComponent = component;
    },
    closeComponentDetails: function() {
      this.detailComponent = { model: new BentoComponent() };
    },
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
    getPage() {
      let time = Math.round(Date.now() / 1000);
      let token = this.currentUser.authenticationToken(time)
      this.$http.request({
        method: 'get',
        url: `/pages/${this.$route.params.page_id}`,
        headers: {
          'Accept': 'application/vnd.api+json',
        },
        params: {
          auth_id:        this.currentUser.id,
          auth_timestamp: time,
          auth_token:     token,
          include:        'site'
        }
      })
      .then((request) => {
        if (request.status === 200) {
          this.requestSucceeded(request)
        }
        else {
          this.requestFailed(request)
        }
      })
      .catch((error) => this.requestFailed(error))
      .finally(() => this.loading = false)
    },
    requestSucceeded(req) {
      this.page = new Page({
        id:         req.data.data.id,
        attributes: req.data.data.attributes,
        included:   req.data.included,
      })
      this.body = this.page.body
    },
    requestFailed(req) {
      console.error('request failed', req);
      this.error = true;
    }
  },
  components: {
    BentoBaseComponentAttributes,
    BentoBaseComponentBody,
    draggable
  }
}
</script>


<style scoped>
@import './src/styles/variables.scss'
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: disc;
}
li {
  display: list-item;
}
a {
  color: #42b983;
}
.component-tree {
  background: #d2d4c8;
}
.component-details-aside {
  background: #889696;
}
.component-name {
  font-weight: 600;
}
.close-component-details {
  float: right;
}
.children-list {
  min-height: 10px;
}
</style>
