<template>
  <section v-if="error">
    <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
  </section>
  <div v-else-if="loading">
    Loading...
  </div>
  <div v-else class="row">
    <modal name="add-child-menu">
      <template v-for="(components, category) in allowedChildren">
        <h4>{{category}}</h4>
        <ul class="allowed-children-list">
          <li v-for="component in components"
            @click="addComponent(component.name, category)"
          >
            <font-awesome-icon :icon="component.icon" />
            {{component.name}}
          </li>
        </ul>
      </template>
    </modal>
    <div class="component-tree col-md-6">
      <div class="float-right">
        <div
          class="action-button btn btn-sm"
          :class="{ 'paste-mode-disabled': !pasteModeEnabled }"
        >
          <font-awesome-icon :icon="['fas', 'times']" @click="cancelGraft"/>
        </div>
        <div class="action-button empty btn btn-sm">.</div>
        <div class="action-button add-child btn btn-sm" @click="showAddComponentMenu()">
          <font-awesome-icon :icon="['fas', 'plus-square']"/>
        </div>
      </div>
      <bento-component-tree
        :model="model"
        :bus="bus"
      ></bento-component-tree>
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
import pluralize from 'pluralize'
import json_api from '@/services/json-api'

import Page from '@/models/page'
import BentoComponent from '@/models/bento/component'

import BentoBaseComponentAttributes from '@/components/site-editor/bento-components/attributes'

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
      componentToGraft: null,
      graftMode: false,
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
    pasteModeEnabled: function() {
      return !!this.graftMode;
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
    this.bus.$on('graftComponent', (component, action) => {
      this.componentToGraft = component;
      this.graftMode = action;
    })
    this.bus.$on('pasteComponent', (newIndex, newParentPath) => {
      this.commitGraft(newIndex, newParentPath)
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
    showAddComponentMenu(componentPath="") {
      this.pathForComponentAddingChild = componentPath;
      let component = _.get(this.model, componentPath) || this.model;

      function allowedChildren(component, site) {
        let manifest = component.bentoManifest;
        let children = {
          components: component.bentoManifest.allowedComponentChildren(),
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

      this.allowedChildren = allowedChildren(component, this.model.site)
      this.$modal.show('add-child-menu');
    },
    addComponent(name, type) {
      let page = { children: _.cloneDeep(this.model.children) }
      let branchPath = this.pathForComponentAddingChild.concat(['children'])
      let branch = _.get(page, branchPath)

      branch.push(new BentoComponent({ name: name, type: pluralize.singular(type) }))

      this.model.children = page.children
      this.$modal.hide('add-child-menu');
    },
    removeComponent(path) {
      let page = { children: _.cloneDeep(this.model.children) }
      let node = _.get(page, path)

      let confirm = window.confirm(`This item${(node.children.length) ? (' and all its children ') : (' ')}will be PERMANENTLY deleted. Continue?`)
      if (confirm) {
        let branch = _.get(page, path.slice(0, path.length-1))
        let index = _.last(path)

        branch.splice(index)

        this.model.children = page.children
      }
    },
    commitGraft(newIndex, newParentPath=[]) {
      let page = { children: _.cloneDeep(this.model.children) }

      let oldPath = this.componentToGraft.path
      let oldIndex = _.last(oldPath)

      let oldBranchPath = oldPath.slice(0, oldPath.length-1)
      let newBranchPath = newParentPath.concat(['children'])

      let oldBranch =  _.get(page, oldBranchPath) || page;
      let newBranch =  _.get(page, newBranchPath) || page;
      let node

      if (this.graftMode === 'cut') {
        node = oldBranch.splice(oldIndex, 1)
      }
      else if (this.graftMode === 'copy') {
        node = [ oldBranch[oldIndex] ]
      }

      let before = newBranch.slice(0, newIndex)
      let after = newBranch.slice(newIndex)
      newBranch = before.concat(node).concat(after)

      _.set(page, newBranchPath, newBranch)

      this.model.children = page.children
      this.graftMode = false;
    },
    cancelGraft() {
      this.graftMode = false;
      this.bus.$emit('pasteComponent', null)
    },
    consoleLogBody() {
      this.model.getJsonBody()
    }
  },
  components: {
    BentoBaseComponentAttributes,
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
