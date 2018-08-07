<template>
  <li class="component-wrapper">
    <div class="component-data head-component">
      <div class="component-title">{{ model.name }}</div>
      <div class="component-button-wrapper">
        <div @click="viewDetails" class="btn btn-sm details-button">details</div>
        <div @click="replaceHeadComponent" class="btn btn-sm replace-button">replace</div>
        <div class="empty">.</div>
        <div class="empty">.</div>
        <div class="empty">.</div>
        <div v-if="allowsChildren"
          @click="showAddComponentMenu"
          class="btn btn-sm action-button add-button"
        >
          <font-awesome-icon :icon="['fas', 'plus-square']"/>
        </div>
        <div v-else class="empty">.</div>
      </div>
    </div>
    <template v-if="model.children.length">
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
      return this.model.bentoManifest.find().allowsChildren
    },
    path: function() {
      return [ 'partials', this.index, 'children' ]
    },
    canPaste: function() {
      let component = this.componentToGraft;
    }
  },
  created() {
    this.bus.$on('graftComponent', (component, action) => {
      this.pasteModeEnabled = true;
    })
    this.bus.$on('pasteComponent', () => {
      this.pasteModeEnabled = false;
    })
  },
  methods: {
    viewDetails() {
      this.bus.$emit('selectComponent', this)
    },
    showAddComponentMenu() {
      this.bus.$emit('showAddComponentMenu', this)
    },
    replaceHeadComponent() {
      let confirm = window.confirm(`This item${(this.model.children.length) ? (' and all its children ') : (' ')}will be PERMANENTLY deleted. Continue?`)
      if (confirm) {
        this.bus.$emit('replaceHeadComponent', this)
      }
    },
    removeComponent() {
      this.bus.$emit('removeComponent', this)
    },
    graftComponent(action) {
      this.bus.$emit('graftComponent', this, action)
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
