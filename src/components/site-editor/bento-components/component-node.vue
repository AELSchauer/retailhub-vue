<template>
  <li class="component-wrapper">
    <div class="component-data">
      <div class="component-title">{{ model.displayName }}</div>
      <div class="component-button-wrapper">
        <div @click="viewDetails" class="btn btn-sm details-button">details</div>
        <div
          @click="removeComponent"
          class="btn btn-sm action-button remove-button"
        >
          <font-awesome-icon :icon="['fas', 'minus-square']"/>
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
    return {}
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
      let parentPath = this.$parent.$parent.path || [];
      return parentPath.concat([ 'children', this.index ])
    },
  },
  methods: {
    viewDetails() {
      this.bus.$emit('selectComponent', this)
    },
    showAddComponentMenu() {
      this.bus.$emit('showAddComponentMenu', this)
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
