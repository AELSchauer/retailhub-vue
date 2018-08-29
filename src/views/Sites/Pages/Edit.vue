<template>
  <section v-if="error">
    <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
  </section>
  <div v-else-if="loading">
    Loading...
  </div>
  <div v-else class="row">
    <bento-data-variables-editor
      :bus="bus"
    ></bento-data-variables-editor>
    <modal name="add-child-menu" height="auto">
      <template v-for="(components, category) in allowedChildren">
        <h4>{{ category }}</h4>
        <ul class="allowed-children-list">
          <li v-for="component in components"
            @click="addComponent(component.name, category)"
          >
            <font-awesome-icon :icon="component.icon" />
            {{ component.displayName }}
          </li>
        </ul>
      </template>
    </modal>
    <div class="component-tree col-md-6">
      <font-awesome-icon :icon="['fa', 'hand-spock']" @click="showDataVariablesMenu()"/>
      <div class="float-right">
        <div class="action-button empty btn btn-sm">.</div>
        <div class="action-button add-child btn btn-sm" @click="showAddComponentMenu()">
          <font-awesome-icon :icon="['fas', 'plus-square']"/>
        </div>
      </div>
      <bento-component-tree
        :model="page"
        :bus="bus"
      ></bento-component-tree>
      <button @click="consoleLogBody">view json</button>
    </div>
    <div class="component-details-aside container col-md-6">
      <div class="row">
        <h2 class="col-md-11 component-name">
          {{ detailComponent.displayName }}
        </h2>
        <span class="col-md-1">
          <button @click="closeComponentDetails" class="close-component-details">x</button>
        </span>
      </div>
      <template v-if="detailComponent.name">
        <hr>
        <h4>attributes:</h4>
        <bento-base-component-attributes
          :model="detailComponent"
        ></bento-base-component-attributes>
        <hr>
        <h4>styling:</h4>
        <!-- {{ get('styling') }} -->
        <em>styling stuff goes here</em>
      </template>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import { mapGetters } from 'vuex'

import Page from '@/models/page'
import BentoComponent from '@/models/bento/component'

import BentoBaseComponentAttributes from '@/components/site-editor/bento-components/attributes'
import BentoDataVariablesEditor from '@/components/site-editor/bento-components/data-variables-editor'

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
      error:     false,
      loading:   true,
      page_id:   page_id,
      page:      null,
      bus:       new Vue(),

      detailComponent: { model: new BentoComponent() }
    }
  },
  computed: {
    ...mapGetters({ currentUser: 'currentUser' }),
    model: function() {
      return this.page
    }
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
    this.bus.$on('showAddComponentMenu', (component) => {
      this.showAddComponentMenu(component.path)
    })
    this.bus.$on('addComponent', (name, type) => {
      this.addComponent(name, type)
    })
    this.bus.$on('removeComponent', (component) => {
      this.removeComponent(component.path)
    })
    this.bus.$on('createDataVariable', (newDataVariable) => {
      this.set('variables', _.merge({}, this.get('variables'), newDataVariable))
    })
    this.bus.$on('updateDataVariable', (oldVariableName, newDataVariable) => {
      let variables = _.merge({}, this.get('variables'))
      _.unset(variables, oldVariableName)
      _.merge(variables, newDataVariable)
      this.set('variables', variables)
    })
    this.bus.$on('deleteDataVariable', (variableName) => {
      let variables = _.merge({}, this.get('variables'))
      _.unset(variables, variableName)
      this.set('variables', variables)
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
      Page.with('site').find(this.page_id)
      .then((record) => {
        this.page = record
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
      if (attrName === 'all_data_variables') {
        function mapVariables(variables, _protected) {
          return _
            .chain(variables)
            .map((v,k) => {
              let data = _.merge({}, v)
              data = _.set(data, 'name', k)
              if (_protected) {
                data = _.set(data, 'protected', _protected)
              }
              return data
            })
            .orderBy(['name'], ['asc'])
            .value()
        }
        let page_variables = mapVariables(this.page.get('variables'))
        let site_variables = mapVariables(this.page.get('site.variables'), true)
        return _.concat([], page_variables, site_variables)
      }
      else {
        return this.page.get(attrName)
      }
    },
    set(attrName, newValue) {
      this.page.set(attrName, newValue)
    },
    showAddComponentMenu(componentPath="") {
      this.pathForComponentAddingChild = componentPath;
      let component = this.page.get(componentPath) || this.page

      function allowedChildren(component, site) {
        let manifest = component.bentoManifest;
        let children = {
          components: manifest.allowedComponentChildren(),
        }


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

      this.allowedChildren = allowedChildren(component, this.page.get('site'))
      this.$modal.show('add-child-menu');
    },
    showDataVariablesMenu() {
      this.bus.$emit('showDataVariablesMenu')
    },
    addComponent(name, type) {
      let _page = { children: _.cloneDeep(this.page.get('children')) }
      let branchPath = this.pathForComponentAddingChild.concat(['children'])
      let branch = _.get(_page, branchPath)

      branch.push(new BentoComponent({ name: name, type: type.singularize() }))

      this.page.set('children', _page.children) 
      this.$modal.hide('add-child-menu');
    },
    removeComponent(path) {
      let _page = { children: _.cloneDeep(this.page.get('children')) }
      let node = _.get(_page, path)

      let confirm = window.confirm(`This item${(node.children.length) ? (' and all its children ') : (' ')}will be PERMANENTLY deleted. Continue?`)
      if (confirm) {
        let branch = _.get(_page, path.slice(0, path.length-1))
        let index = _.last(path)

        branch.splice(index, 1)

        this.page.set('children', _page.children)
      }
    },
    consoleLogBody() {
      console.log(this.page.getJsonBody())
    }
  },
  components: {
    BentoBaseComponentAttributes,
    BentoDataVariablesEditor,
    // Import this differently because these components are circular.
    BentoComponentTree: () => import('@/components/site-editor/bento-components/component-tree.vue'),
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
  margin: 0;

  .row {
    width: 100%;
  }
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
.action-button {
  width: 29px;
}
.empty, .paste-mode-disabled {
  visibility: hidden;
}
</style>
