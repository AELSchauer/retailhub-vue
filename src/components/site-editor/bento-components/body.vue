<template>
  <li class="container">
    {{ model.name }}
    <button @click="viewDetails">Details</button>
    <draggable
      v-model="model.children"
      class="children-list"
      element="ol"
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
  </li>
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
    // placeholder: function() {},
  },
  methods: {
    viewDetails: function() {
      this.bus.$emit('selectedComponent', this)
    },

  },
  components: {
    draggable
    // SiteEditorAttributes
  }
}
</script>

<style lang="scss" scoped>
button {
  background: #605B56 !important;
  height: 30px;
  width: 65px;
}
.children-list {
  min-height: 10px;
}
</style>
