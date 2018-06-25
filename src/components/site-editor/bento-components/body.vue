<template>
  <div class="container">
    {{ model.name }}
    <button @click="viewDetails">Details</button>
    <ul>
      <draggable v-model="model.children" :options="{group:'children'}" @start="drag=true" @end="drag=false">
        <li v-for="child in model.children" :key="model.id">
          <bento-base-component-body
            :model="child"
            :bus="bus"
          ></bento-base-component-body>
        </li>
      </draggable>
    </ul>
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
}
</style>
