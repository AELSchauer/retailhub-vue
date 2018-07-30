<template>
  <section v-if="error">
    <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
  </section>
  <div v-else-if="loading">
    Loading...
  </div>
  <div v-else class="row">
    <div class="component-tree container col-md-6">
      <div class="row">
        <div class="col-md-12">
          <div class="add-child btn-sm float-right" @click="showAddChildMenu(model)">+</div>
          <modal name="add-child-menu">
            <template v-for="(components, category) in allowedChildren">
              <h4>{{category}}</h4>
              <ul class="allowed-children-list">
                <li v-for="component in components"
                  @click="addChild(component.name, category)"
                >
                  <font-awesome-icon :icon="component.icon" />
                  {{component.name}}
                </li>
              </ul>
            </template>
          </modal>
        </div>
      </div>
      <div class="row">
        <draggable
          v-model="model.body"
          class="children-list col-md-12"
          :options="{group:'body'}"
          @start="drag=true"
          @end="drag=false"
        >
          <template v-for="(bentoComponent, index) in model.children">
            <bento-base-component-body
              :key="bentoComponent.id"
              :model="bentoComponent"
              :bus="bus"
              :index='[index]'
            ></bento-base-component-body>
          </template>
        </draggable>
      </div>
      <div @click="consoleLogBody">See Body JSON</div>
    </div>
    <div class="component-details-aside container col-md-6">
      <div class="row">
        <span class="col-md-11 component-name">
          {{ detailComponent.name }}
        </span>
        <span class="col-md-1">
          <button @click="closeComponentDetails" class="close-component-details">x</button>
        </span>
      </div>
      <template v-if="detailComponent.name">
        <hr>
        attributes:
        <bento-base-component-attributes
          :model="detailComponent"
        ></bento-base-component-attributes>
        <hr>
        styling:
        {{ model.styling }}
      </template>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import draggable from 'vuedraggable'
import pluralize from 'pluralize'
import json_api from '@/services/json-api'

import Page from '@/models/page'
import BentoComponent from '@/models/bento/component'

import BentoBaseComponentAttributes from '@/components/site-editor/bento-components/attributes'
import BentoBaseComponentBody from '@/components/site-editor/bento-components/body'


export default {
  name: 'SitePageEdit',
  data() {
    let page_id = this.$route.params.page_id
    let page_name = this.$route.params.page_name
    let site_name = this.$route.params.site_name
    let breadcrumbs

    if (site_name && page_name) {
      breadcrumbs = [
        {
          name: 'SiteIndex',
          text: 'Sites',
        },
        {
          name: 'SiteShow',
          text: site_name,
        },
        {
          text: 'Pages',
        },
        {
          text: page_name,
        }
      ]
    }
    else {
      breadcrumbs = [
        {
          name: 'PageIndex',
          text: 'Pages',
        },
        {
          text: page_id
        },
      ]
    }

    return {
      permissions: ['admin'],
      breadcrumbs: breadcrumbs,
      allowedChildren: [],
      pathForComponentAddingChild: null,
      error:   false,
      loading: true,
      page_id: page_id,
      page:    null,
      bus:     new Vue(),

      detailComponent: { model: new BentoComponent() }
    }
  },
  computed: {
    ...mapGetters({ currentUser: 'currentUser' }),
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
    this.bus.$on('selectComponent', (component) => {
      this.viewComponentDetails(component.model)
    })
    this.bus.$on('showAddChildMenu', (component) => {
      this.showAddChildMenu(component.path)
    })
    this.bus.$on('addChild', (name, type) => {
      this.addChild(name, type)
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
    getModel() {
      json_api.findRecord({
        resource: 'pages',
        id:       this.page_id,
        options:  {
          params: { include: 'site' }
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
    showAddChildMenu(componentPath) {
      this.pathForComponentAddingChild = componentPath;
      let component = _.get(this.model.children, componentPath)

      function allowedChildren(component, site) {
        let manifest = component.bentoManifest;
        let children = {
          components: component.bentoManifest.allowedComponentChildren(),
        }
        console.log('children', children)

        if (manifest.isAllowedPartialsChildren) {
          let sitePartials = (site.partials || [])

          children.partials = sitePartials.map(partial => {
            return _
              .chain(manifest.$partial)
              .cloneDeep()
              .set('name', partial.name)
              .value()
          })
        }

        return children
      }

      this.allowedChildren = allowedChildren(component, this.model.site)
      this.$modal.show('add-child-menu');
    },
    addChild(name, type) {
      let children = this.model.children
      let component = _.get(children, this.pathForComponentAddingChild)
      component.children.push(new BentoComponent({ name: name, type: pluralize.singular(type) }))

      this.model.children = children
      this.$modal.hide('add-child-menu');
    },
    consoleLogBody() {
      this.model.getJsonBody()
    }
  },
  components: {
    BentoBaseComponentAttributes,
    BentoBaseComponentBody,
    draggable
  }
}
</script>


<style scoped lang="scss">
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: disc;
}
li {
  display: list-item;
  padding-right: 0px;
}
a {
  color: #42b983;
}
.component-tree {
  background: #d2d4c8;
  padding: 10px;
}
.component-details-aside {
  background: #889696;
  padding: 10px;
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
.allowed-children-list {
  padding: 0 0 0 10px;
  list-style: none;
}
.allowed-children-list > li {
  margin: 5px 0px;

  &:hover {
    color: #42b983;
  }
}
</style>
