<template>
  <section v-if="error">
    <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
  </section>
  <div v-else-if="loading">
    Loading...
  </div>
  <div v-else>
    <modal name="new-partial-form">
      <input v-model="newPartial" type="text" name="newPartial">
      <div class="btn button-custom" @click="createNewPartial">create</div>
      <div class="btn button-custom" @click="cancelNewPartial">cancel</div>
    </modal>
    <modal name="add-child-menu">
      <template v-for="(components, category) in allowedChildren">
        <h4>{{category}}</h4>
        <ul class="allowed-children-list">
          <li v-for="component in components"
            @click="getComponentAction(component.name, category)"
          >
            <font-awesome-icon :icon="component.icon" />
            {{ component.name }}
          </li>
        </ul>
      </template>
    </modal>
    <div class="row">
      <div class="component-tree col-md-6">
        <div class="page-action-buttons">
          <div class="action-button add-partial btn btn-sm float-right" @click="$modal.show('new-partial-form')">
            <font-awesome-icon :icon="['fas', 'plus-square']"/>
          </div>
        </div>
        <template v-for="(partial, index) in partials">
          <div class="component-wrapper">
            <div class="component-data">
              <div class="component-title" @click="switchActivePartial(index)">
                {{ partial.name }}
              </div>
              <div class="component-button-wrapper">
                <div
                  @click="removePartial(partial.name)"
                  class="btn btn-sm action-button remove-button"
                >
                  <font-awesome-icon :icon="['fas', 'minus-square']"/>
                </div>
                <div class="empty">.</div>
              </div>
            </div>
            <div v-if="activePartial === index"
              class="partial-content"
              >
              <ul>
                <bento-partial-node
                  :model="partial.children"
                  :bus="bus"
                  :index="getPartialIndex(partial.name)"
                ></bento-partial-node>
              </ul>
            </div>
          </div>
        </template>
        <div class="save-navigate-buttons">
          <div @click="saveModel('stay')" class="btn btn-sm button-custom">
            save and stay
          </div>
          <div @click="saveModel('return')" class="btn btn-sm button-custom">
            save and quit
          </div>
          <div @click="$router.push('/sites/' + site_id)" class="btn btn-sm button-custom">
            quit
          </div>
        </div>
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
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import pluralize from 'pluralize'
import json_api from '@/services/json-api'

import BentoComponent from '@/models/bento/component'
import BentoPartial from '@/models/bento/partial'

import BentoBaseComponentAttributes from '@/components/site-editor/bento-components/attributes'
import BentoPartialNode from '@/components/site-editor/bento-components/partial-node'

export default {
  name: 'SitePartialEdit',
  data() {
    let site_id = this.$route.params.site_id
    let page_name = this.$route.params.page_name

    let breadcrumbs = [
      {
        name: 'SiteIndex',
        text: 'Sites',
      },
      {
        name: 'SiteShow',
        text: site_id,
      },
      {
        text: 'Edit',
      },

    ]

    return {
      permissions: ['admin'],
      breadcrumbs: breadcrumbs,

      error:   false,
      loading: true,
      site_id: site_id,
      bus:     new Vue(),

      newPartial: null,
      activePartial: 0,
      allowedChildren: [],
      componentAction: 'addComponent',
      pathForComponentAddingChild: null,
      componentToGraft: null,
      graftMode: false,

      detailComponent: { model: new BentoComponent() }
    }
  },
  computed: {
    ...mapGetters({ currentUser: 'currentUser' }),
    partials: function() {
      if (this.$route.query.names) {
        let queryNames = this.$route.query.names.split(',')
        return this.model.partials.filter(partial => {
          return _.includes(queryNames, partial.name)
        })
      }
      else {
        return this.model.partials
      }
    },
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
    this.bus.$on('replaceHeadComponent', (component) => {
      this.componentAction = 'replaceHeadComponent'
      this.closeComponentDetails()
      this.showAddComponentMenu(component.path.slice(0,2))
    })
    this.bus.$on('addComponent', (name, type) => {
      this.componentAction = 'addComponent'
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
      if (newIndex != undefined) {
        this.commitGraft(newIndex, newParentPath)
      }
      else {
        this.componentToGraft = null;
        this.graftMode = false
      }
    })
  },
  methods: {
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
        resource: 'sites',
        id:       this.site_id,
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
    viewComponentDetails(component) {
      this.detailComponent = component;
    },
    closeComponentDetails() {
      this.detailComponent = { model: new BentoComponent() };
    },
    getPartialIndex(partialName) {
      return _
        .chain(this.model.partials)
        .map('name')
        .indexOf(partialName)
        .value()
    },
    switchActivePartial(index) {
      this.activePartial = index;
      this.cancelGraft();
      this.closeComponentDetails();
    },
    createNewPartial() {
      let partials = this.model.partials
      partials.push(new BentoPartial({ name: this.newPartial }))
      this.model.partials = partials
      this.cancelNewPartial()
    },
    cancelNewPartial() {
      this.newPartial = null
      this.$modal.hide('new-partial-form')
    },
    removePartial(partialName) {
      let confirm = window.confirm(`This partial will be PERMANENTLY deleted. Continue?`)
      if (confirm) {
        let partialIndex = this.getPartialIndex(partialName)
        let partials = this.model.partials
        partials = partials.slice(0,partialIndex).concat(partials.slice(partialIndex+1,partials.length))
        this.model.partials = partials
      }
    },
    showAddComponentMenu(componentPath="") {
      this.pathForComponentAddingChild = componentPath;
      let component = _.get(this.model, componentPath) || this.model;

      function allowedChildren(component, site, { allowPartials=true }={}) {
        let manifest = component.bentoManifest;
        let children = {
          components: manifest.allowedComponentChildren(),
        }

        if (allowPartials && manifest.isAllowedPartialsChildren()) {
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

      this.allowedChildren = allowedChildren(component, this.model, { allowPartials: false})
      this.$modal.show('add-child-menu');
    },
    getComponentAction(name, type) {
      this[this.componentAction](name, type);
    },
    replaceHeadComponent(name, type) {
      let site = { partials: _.cloneDeep(this.model.partials) }
      let branchPath = this.pathForComponentAddingChild.concat(['children'])
      
      _.set(site, branchPath, new BentoComponent({ name: name, type: pluralize.singular(type) }))

      this.model.properties.partials = site.partials;
      this.componentAction = 'addComponent';
      this.$modal.hide('add-child-menu');
    },
    addComponent(name, type) {
      let site = { partials: _.cloneDeep(this.model.partials) }
      let branchPath = this.pathForComponentAddingChild.concat(['children'])
      let branch = _.get(site, branchPath)

      branch.push(new BentoComponent({ name: name, type: pluralize.singular(type) }))

      this.model.partials = site.partials;
      this.$modal.hide('add-child-menu');
    },
    removeComponent(path) {
      let page = { children: _.cloneDeep(this.model.children) }
      let node = _.get(page, path)

      let confirm = window.confirm(`This item${(node.children.length) ? (' and all its children ') : (' ')}will be PERMANENTLY deleted. Continue?`)
      if (confirm) {
        let branch = _.get(page, path.slice(0, path.length-1))
        let index = _.last(path)

        branch.splice(index, 1)

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
      this.bus.$emit('pasteComponent')
    },
    consoleLogBody() {
      console.log(this.model.getJsonBody())
    },
    saveModel(routeOption) {
      // update this so it only saves if a change is made
      this.loading = true;
      json_api.updateRecord({
        resource: this.model.type,
        id:       this.model.id,
        body: {
          data: {
            id: this.model.id,
            type: this.model.type,
            attributes: this.model.serializedProperties(),
          }
        }
      })
      .then(() => {
        this.saved = true
        if(routeOption === 'return') {
          this.$router.push('/sites/' + this.site_id)
        }
      })
      .catch((error) => {
        console.error('request failed', error);
        this.error = true;
      })
      .finally(() => {
        this.loading = false
      })
    },
  },
  components: {
    BentoBaseComponentAttributes,
    BentoPartialNode,
    // Import this differently because these components are circular.
    BentoComponentTree: () => import('@/components/site-editor/bento-components/component-tree.vue'),
  }
}
</script>


<style scoped lang="scss">
.inactive-partial {
  .partial-content {
    visibility: hidden;
  }
}
// h1, h2 {
//   font-weight: normal;
// }
ul {
  list-style-type: disc;
}
li {
  display: list-item;
  padding-right: 0px;
}
// a {
//   color: #42b983;
// }
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

.page-action-buttons {
  display: inline-block;
  width: 100%;
}
.component-wrapper {
  list-style: none;
}
.component-data {
  display: inline-block;
  width: 100%;

  * {
    display: inline-block;;
  }
}
.component-button-wrapper {
  float: right;
}
.action-button {
  width: 29px;
}
.empty {
  width: 29px;
  visibility: hidden;
}
// .component-name {
//   font-weight: 600;
// }
// .close-component-details {
//   float: right;
// }
// .children-list {
//   min-height: 10px;
// }
// .allowed-children-list {
//   padding: 0 0 0 10px;
//   list-style: none;
// }
// .allowed-children-list > li {
//   margin: 5px 0px;

//   &:hover {
//     color: #42b983;
//   }
// }
// .action-button {
//   width: 29px;
// }
// .empty, .paste-mode-disabled {
//   visibility: hidden;
// }
</style>
