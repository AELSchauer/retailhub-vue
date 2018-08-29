<template>
  <ul>
    <template v-for="(bentoComponent, index) in get('children')">
      <bento-component-node
        :model="bentoComponent"
        :bus="bus"
        :index="index"
      ></bento-component-node>
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
  methods: {
    get(attrName) {
      return this.model.get(attrName)
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
