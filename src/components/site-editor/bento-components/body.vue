<template>
  <div class="container">
    <div class="child-actions row">
      <div class="child-name">{{model.name}}</div>
      <div class="action-buttons float-right row">
        <div @click="viewDetails" class="btn-sm">details</div>
        <div v-if="allowsChildren"
          @click="showAddChildMenu"
          class="btn-sm">+</div>
      </div>
    </div>
    <draggable
      v-model="model.children"
      class="children-list"
      :options="{group:'children'}"
      @start="drag=true"
      @end="drag=false"
    >
      <template v-for="child in model.children">
        <bento-base-component-body
          :key="model.id"
          :model="child"
          :bus="bus"
        ></bento-base-component-body>
      </template>
    </draggable>
  </div>
</template>

<script>
// import SiteEditorAttributes from '@/components/site-editor/attributes/index'
import draggable from 'vuedraggable'

export default {
  name: 'bento-base-component-body',
  data() {
    return {}
  },
  props: {
    model: Object,
    bus:   Object
  },
  computed: {
    allowsChildren: function() {
      return this.model.bentoManifest.find().allowsChildren
    }
  },
  methods: {
    viewDetails() {
      this.bus.$emit('selectComponent', this)
    },
    showAddChildMenu() {
      this.bus.$emit('showAddChildMenu', this)
    },
    removeChild() {
      this.bus.$emit('removeChild', this)
    },
  },
  components: {
    draggable
    // SiteEditorAttributes
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding-right: 0px;
}
.children-list {
  min-height: 10px;
}
.child-actions {
  height: 30px;
  margin: 5px 0px;
  display: flex;
  justify-content: space-between;

  .child-name {
    vertical-align: middle;
  }
  .action-buttons > * {
    height: 30px;
    margin: 0px 2px;
    background: #605B56 !important;
    color: #fff;
  }

  &:hover {
    background: #605B56;
  }
}
</style>
