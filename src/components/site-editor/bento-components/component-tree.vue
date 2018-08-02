<template>
  <ul>
    <li v-if="showPasteOption(-1)" class="paste-placeholder component-wrapper">
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
    <template v-for="(bentoComponent, index) in children">
      <bento-component-node
        :model="bentoComponent"
        :bus="bus"
        :index="index"
      ></bento-component-node>
      <li v-if="showPasteOption(index)" class="paste-placeholder component-wrapper">
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
      copyCutPasteMode: false,
      componentToCopyOrCut: null,
    }
  },
  props: {
    model:      Object,
    bus:        Object,
    isSubclass: Boolean,
  },
  computed: {   
    children: function() {
      return this.model.children
    },
  },
  created() {
    this.bus.$on('copyOrCutComponent', (component, action) => {
      this.componentToCopyOrCut = component;
    })
    this.bus.$on('pasteComponent', () => {
      this.componentToCopyOrCut = null;
    })
  },
  methods: {
    pasteComponent(newIndex) {
      console.log('newIndex', newIndex)
      console.log('this.$parent.path', this.$parent.path)
      console.log('this.componentToCopyOrCut.path', this.componentToCopyOrCut.path)
      this.bus.$emit('pasteComponent', newIndex + 1, this.$parent.path)
    },
    showPasteOption(index) {
      // Only show if mode is enabled.
      if (!this.componentToCopyOrCut) {
        return false
      }

      let component = this.componentToCopyOrCut;

      if (component) {
        // Can't paste item to the same index of the current parent.
        if (this.model === component.$parent.model) {
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
