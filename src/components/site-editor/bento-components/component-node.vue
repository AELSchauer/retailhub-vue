<template>
  <li class="component-wrapper">
    <div class="component-data">
      <div class="component-title">{{model.name}}</div>
      <div class="component-button-wrapper">
        <div @click="viewDetails" class="btn btn-sm details-button">details</div>
        <div v-if="!pasteModeEnabled"
          @click="copyOrCutComponent('copy')"
          class="btn btn-sm action-button copy-button"
        >
          <font-awesome-icon :icon="['fa', 'copy']"/>
        </div>
        <div v-else class="empty">.</div>
        <div v-if="!pasteModeEnabled"
          @click="copyOrCutComponent('cut')"
          class="btn btn-sm action-button cut-button"
        >
          <font-awesome-icon :icon="['fa', 'cut']"/>
        </div>
        <div v-else class="empty">.</div>
        <div
          @click="removeComponent"
          class="btn btn-sm action-button remove-button"
        >
          <font-awesome-icon :icon="['fas', 'minus-square']"/>
        </div>
        <div v-if="allowsChildren"
          @click="showAddChildMenu"
          class="btn btn-sm action-button add-button"
        >
          <font-awesome-icon :icon="['fas', 'plus-square']"/>
        </div>
        <div v-else class="empty">.</div>
      </div>
    </div>
    <template v-if="model.children.length || allowsChildren">
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
  name: 'bento-component-node',
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
      let parentPath = this.$parent.$parent.path
      if (parentPath) {
        return parentPath.concat(['children', this.index])
      }
      else {
        return [this.index]
      }
    },
    canPaste: function() {
      let component = this.componentToCopyOrCut;
    }
  },
  created() {
    this.bus.$on('copyOrCutComponent', (component, action) => {
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
    showAddChildMenu() {
      this.bus.$emit('showAddChildMenu', this)
    },
    removeComponent() {
      this.bus.$emit('removeComponent', this)
    },
    copyOrCutComponent(action) {
      this.bus.$emit('copyOrCutComponent', this, action)
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
