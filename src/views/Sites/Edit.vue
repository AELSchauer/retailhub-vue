<template>
  <section v-if="error">
    <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
  </section>
  <div v-else-if="loading">
    Loading...
  </div>
  <div v-else>
    <modal name="partial-form">
      <input v-model="partialName" type="text" name="partialName">
      <div class="btn button-custom" @click="getPartialAction">{{ partialAction }}</div>
      <div class="btn button-custom" @click="cancelPartialAction">cancel</div>
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
          <div @click="setPartialAction('add')"
            class="action-button add-partial btn btn-sm float-right"
          >
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
                <div @click="setPartialAction('edit', partial.name)"
                  class="action-button edit-partial btn btn-sm"
                >
                  <font-awesome-icon :icon="['fas', 'edit']"/>
                </div>
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
                  :model="partial.content"
                  :bus="bus"
                  :index="getPartialIndex(partial.name)"
                ></bento-partial-node>
              </ul>
            </div>
          </div>
        </template>
        <div class="save-navigate-buttons">
          <button @click="saveAction('stay')" :disabled="isSiteChanged" class="btn btn-sm button-custom">
            save and stay
          </button>
          <button @click="saveAction('quit')" :disabled="isSiteChanged" class="btn btn-sm button-custom">
            save and quit
          </button>
          <button @click="cancelAction()" class="btn btn-sm button-custom">
            quit
          </button>
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

import Site from '@/models/site'
import BentoComponent from '@/models/bento/component'
import BentoPartial from '@/models/bento/partial'

import BentoBaseComponentAttributes from '@/components/site-editor/bento-components/attributes'
import BentoPartialNode from '@/components/site-editor/bento-components/partial-node'

export default {
  name: 'SiteEdit',
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
      activePartial: 0,
      allowedChildren: [],
      breadcrumbs: breadcrumbs,
      bus: new Vue(),
      componentAction: null,
      detailComponent: { model: new BentoComponent() },
      error: false,
      loading: true,
      partialAction: null,
      partialName: null,
      pathForComponentAddingChild: null,
      permissions: ['admin'],
      site_id: site_id,
    }
  },
  computed: {
    ...mapGetters({ currentUser: 'currentUser' }),
    partials: function() {
      if (this.$route.query.names) {
        let queryNames = this.$route.query.names.split(',')
        return this.get('partials').filter(partial => {
          return _.includes(queryNames, partial.name)
        })
      }
      else {
        return this.get('partials')
      }
    },
    isSiteChanged: function() {
      let changed = _.get(this.site, 'changes', {})
      return _.keys(changed.attributes).length + _.keys(changed.relationships).length
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
    this.getSite()
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
    getSite() {
      Site.find(this.site_id)
      .then((record) => {
        record.takeSnapshot()
        this.site = record
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
      return this.site.get(attrName)
    },
    set(attrName, newValue) {
      return this.site.set(attrName, newValue)
    },
    viewComponentDetails(component) {
      this.detailComponent = component;
    },
    closeComponentDetails() {
      this.detailComponent = { model: new BentoComponent() };
    },
    getPartialIndex(partialName) {
      return _
        .chain(this.get('partials'))
        .map('name')
        .indexOf(partialName)
        .value()
    },
    switchActivePartial(index) {
      this.activePartial = index;
      this.closeComponentDetails();
    },
    getPartialAction() {
      let partialMethod = `${this.partialAction}Partial`
      this[partialMethod]();
    },
    setPartialAction(action, partialName) {
      this.partialAction = action
      if (action === 'edit') {
        this.partialName = partialName
        this.partialIndex = this.getPartialIndex(partialName)
      }
      this.$modal.show('partial-form')
    },
    addPartial() {
      let partials = this.get('partials')
      partials.push(new BentoPartial({ name: this.partialName }))
      this.set('partials', partials)
      this.cancelPartialAction()
    },
    editPartial() {
      let partials = this.get('partials')
      partials[this.partialIndex].name = this.partialName
      this.set('partials', partials)
      this.cancelPartialAction()
    },
    cancelPartialAction() {
      this.partialName = null
      this.$modal.hide('partial-form')
    },
    removePartial(partialName) {
      let confirm = window.confirm(`This partial will be PERMANENTLY deleted. Continue?`)
      if (confirm) {
        let partialIndex = this.getPartialIndex(partialName)
        let partials = this.get('partials')
        partials = partials.slice(0,partialIndex).concat(partials.slice(partialIndex+1,partials.length))
        this.set('partials', partials)
      }
    },
    showAddComponentMenu(componentPath="") {
      this.pathForComponentAddingChild = componentPath;
      let component = this.get(componentPath) || this.site;

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

      this.allowedChildren = allowedChildren(component, this.site, { allowPartials: false })
      this.$modal.show('add-child-menu');
    },
    getComponentAction(name, type) {
      this[this.componentAction](name, type);
    },
    addComponent(name, type) {
      let site = { partials: _.cloneDeep(this.get('partials')) }
      let branchPath = this.pathForComponentAddingChild.concat(['children'])
      let branch = _.get(site, branchPath)

      branch.push(new BentoComponent({ name: name, type: type.singularize() }))

      this.set('partials', site.partials);
      this.$modal.hide('add-child-menu');
    },
    removeComponent(path) {
      let page = { children: _.cloneDeep(this.site.children) }
      let node = _.get(page, path)

      let confirm = window.confirm(`This item${(node.children.length) ? (' and all its children ') : (' ')}will be PERMANENTLY deleted. Continue?`)
      if (confirm) {
        let branch = _.get(page, path.slice(0, path.length-1))
        let index = _.last(path)

        branch.splice(index, 1)

        this.site.children = page.children
      }
    },
    replaceHeadComponent(name, type) {
      let site = { partials: _.cloneDeep(this.get('partials')) }
      let branchPath = this.pathForComponentAddingChild.concat(['content'])

      _.set(site, branchPath, new BentoComponent({ name: name, type: type.singularize() }))

      this.site.properties.partials = site.partials;
      this.componentAction = 'addComponent';
      this.$modal.hide('add-child-menu');
    },
    saveAction(routeOption) {
      this.loading = true;
      this.site.save()
      .then(() => {
        if(routeOption === 'quit') {
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
    cancelAction() {
      this.loading = true;
      this.site.rollback()
      this.$router.push('/sites/' + this.site_id)
      this.loading = false
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
ul {
  list-style-type: disc;
}
li {
  display: list-item;
  padding-right: 0px;
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
</style>
