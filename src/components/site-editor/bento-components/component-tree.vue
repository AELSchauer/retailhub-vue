<template>
  <ul>
    <li v-if="showPastePlaceholder(-1)" class="paste-placeholder component-wrapper">
      <div class="component-data">
        <div class="component-title">paste here</div>
        <div class="component-button-wrapper">
          <div
            @click="pasteComponent(-1)"
            class="btn btn-sm action-button paste-button"
          >
            <font-awesome-icon :icon="['fa', 'paste']"/>
          </div>
          <div class="empty">.</div>
          <div class="empty">.</div>
        </div>
      </div>
    </li>
    <template v-for="(bentoComponent, index) in get('children')">
      <bento-component-node
        :model="bentoComponent"
        :bus="bus"
        :index="index"
      ></bento-component-node>
      <li v-if="showPastePlaceholder(index)" class="paste-placeholder component-wrapper">
        <div class="component-data">
          <div class="component-title">paste here</div>
          <div class="component-button-wrapper">
            <div
              @click="pasteComponent(index)"
              class="btn btn-sm action-button paste-button"
            >
              <font-awesome-icon :icon="['fa', 'paste']"/>
            </div>
            <div class="empty">.</div>
            <div class="empty">.</div>
          </div>
        </div>
      </li>
    </template>
  </ul>
</template>

<script>
export default {
  name: 'bento-component-tree',
  data() {
    return {
      graftMode: false,
      componentToGraft: null,
    }
  },
  props: {
    model:      Object,
    bus:        Object,
    isSubclass: Boolean,
  },
  created() {
    this.bus.$on('graftComponent', (component, action) => {
      this.componentToGraft = component;
      this.graftMode = action;
    })
    this.bus.$on('pasteComponent', () => {
      this.componentToGraft = null;
    })
  },
  methods: {
    get(attrName) {
      return this.model.get(attrName)
    },
    pasteComponent(newIndex) {
      this.bus.$emit('pasteComponent', newIndex + 1, this.$parent.path)
    },
    showPastePlaceholder(index) {
      // Only show if mode is enabled.
      if (!this.componentToGraft) {
        return false
      }

      let component = this.componentToGraft;

      if (component) {
        // If cutting component, can't paste the component to be at the same position.
        if (this.graftMode === 'cut' && this.model === component.$parent.model) {
          if (component.$parent.model.children.length === 1) {
            return false
          }
          else if (_.last(component.path) === index || _.last(component.path) === (index + 1)) {
            return false
          }
          return true
        }

        // Can't paste item to be child of itself.
        let path = this.$parent.path || [];
        let isComponentAParentComponent = _
          .chain(component.path)
          .every((node, index) => {
            return node === path[index]
          })
          .value()

        if (isComponentAParentComponent) {
          return false
        }

        // Can't paste item if parent doesn't allow that component as a child.
        let manifest = this.$parent.model.bentoManifest
        if (this.componentToGraft.model.type === 'partial') {
          return manifest.isAllowedPartialsChildren()
        }
        else {
          let allowedChildren = manifest.allowedComponentChildren()
          return _
            .chain(allowedChildren)
            .map(child => {
              return child.name
            })
            .includes(this.componentToGraft.model.name)
            .value()
        }

        return true
      }
    },
  },
  components: {
    // Import this differently because these components are circular.
    BentoComponentNode: () => import('@/components/site-editor/bento-components/component-node.vue'),
  }
}
</script>

<style lang="scss" scoped>
.component-subtree {
  border-left: #605B56 solid 1px;
}
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
