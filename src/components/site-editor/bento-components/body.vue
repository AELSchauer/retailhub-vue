<template>
  <li class="component-wrapper">
    <div class="component-data">
      <div class="component-title">{{model.name}}</div>
      <div class="component-button-wrapper">
        <div @click="viewDetails" class="btn btn-sm details-button">details</div>
        <div
          @click="removeComponent"
          class="btn btn-sm remove-button"
        >
          <font-awesome-icon :icon="['fas', 'minus-square']"/>
        </div>
        <div v-if="allowsChildren"
          @click="showAddChildMenu"
          class="btn btn-sm add-button"
        >
          <font-awesome-icon :icon="['fas', 'plus-square']"/>
        </div>
        <div v-else class="empty">.</div>
      </div>
    </div>
    <ul v-if="model.children">
      <template v-for="(bentoComponent, index) in model.children">
        <bento-base-component-body
          :key="bentoComponent.id"
          :model="bentoComponent"
          :bus="bus"
          :index='index'
        ></bento-base-component-body>
      </template>
    </ul>
  </li>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'bento-base-component-body',
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
      let parentPath = this.$parent.path
      if (parentPath) {
        return parentPath.concat(['children', this.index])
      }
      else {
        return [this.index]
      }
    }
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
  },
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
.add-button, .empty, .remove-button {
  width: 29px;
}
.empty {
  visibility: hidden;
}
</style>
