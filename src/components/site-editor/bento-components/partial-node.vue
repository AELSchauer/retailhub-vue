<template>
  <li class="component-wrapper">
    <div class="component-data head-component">
      <div class="component-title">{{ get('displayName') }}</div>
      <div class="component-button-wrapper">
        <div @click="viewDetails" class="btn btn-sm details-button">details</div>
        <div
          @click="replaceHeadComponent"
          class="btn btn-sm action-button replace-button"
        >
          <font-awesome-icon :icon="['fas', 'ellipsis-h']" />
        </div>
        <div v-if="allowsChildren"
          @click="showAddComponentMenu"
          class="btn btn-sm action-button add-button"
        >
          <font-awesome-icon :icon="['fas', 'plus-square']"/>
        </div>
        <div v-else class="empty">.</div>
      </div>
    </div>
    <template v-if="get('hasChildren')">
      <bento-component-tree
        :model="model"
        :bus="bus"
        :isSubclass="true"
      ></bento-component-tree>
    </template>
  </li>
</template>
 <script>
export default {
  name: 'bento-partial-node',
  data() {
    return {
      pasteModeEnabled: false,
    }
  },
  props: {
    model: Object,
    bus:   Object,
    index: Number,
  },
  computed: {
    allowsChildren: function() {
      let manifest = this.get('bentoManifest')
      return (manifest) ? (manifest.find().allowsChildren) : (false)
    },
    path: function() {
      return [ 'partials', this.index, 'children' ]
    },
  },
  methods: {
    get(attrName) {
      if (attrName === 'hasChildren') {
        return !_.isEmpty(this.get('children'))
      }
      else {
        return this.model.get(attrName)
      }
    },
    viewDetails() {
      this.bus.$emit('selectComponent', this)
    },
    showAddComponentMenu() {
      this.bus.$emit('showAddComponentMenu', this)
    },
    replaceHeadComponent() {
      let confirm = window.confirm(`By replacing this partial's head component, this item${(this.model.children.length) ? (' and all its children ') : (' ')}will be PERMANENTLY deleted. Continue?`)
      if (confirm) {
        this.bus.$emit('replaceHeadComponent', this)
      }
    },
    removeComponent() {
      this.bus.$emit('removeComponent', this)
    },
  },
  components: {
    // Import this differently because these components are circular.
    BentoComponentTree: () => import('@/components/site-editor/bento-components/component-tree.vue'),
  }
}
</script>
 <style lang="scss" scoped>
.component-wrapper {
  list-style: none;
}
.component-data {
  display: inline-block;
  width: 100%;
   &:hover {
    background: #605B56;
  }
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
.paste-placeholder {
  border: black dashed 1px;
  font-style: italic;
}
</style>
