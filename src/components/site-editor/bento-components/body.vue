<!-- <template>
  <div class="container">
    <div class="child-actions row">
      <div class="child-name">{{model.name}} {{path}}</div>
      <div class="action-buttons float-right row">
        <div @click="viewDetails" class="btn-sm">details</div>
        <div v-if="allowsChildren"
          @click="showAddChildMenu"
          class="btn-sm">+</div>
      </div>
    </div>
    <template v-for="(child, index) in model.children">
      <bento-base-component-body
        :key="model.id"
        :model="child"
        :bus="bus"
        :index="index"
      ></bento-base-component-body>
    </template>
  </div>
</template> -->

<template>
  <li class="component-wrapper">
    <div class="component-data">
<!--       <td class="component-title" :class="'indent-' + ((path.length - 1) / 2)">{{model.name}} {{path}}</td>
      <td class="details-button-wrapper">
        <div @click="viewDetails" class="btn-sm">details</div>
      </td>
      <td class="add-button-wrapper">
        <div v-if="allowsChildren"
          @click="showAddChildMenu"
          class="btn-sm"
        >
          <font-awesome-icon :icon="['fas', 'plus-square']"/>
        </div>
        <div v-else class="empty">.</div>
      </td> -->
      <div class="component-title">{{model.name}} {{path}}</div>
      <div class="component-button-wrapper">
        <div @click="viewDetails" class="btn btn-sm details-button">details</div>
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
// import SiteEditorAttributes from '@/components/site-editor/attributes/index'
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
      console.log('this.path', this.path)
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
.component-wrapper {
  list-style: none;
}
.component-data {
  display: inline-block;
  width: 100%;

  * {
    display: inline-block;;
  }
}
.component-title {
}
.component-button-wrapper {
  float: right;
}
.add-button, .empty {
  width: 29px;
}

.empty {
  visibility: hidden;
}


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
