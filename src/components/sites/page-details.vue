<template>
  <tr class="page-details">
    <td class="page-name">
      <div v-if="toggleEditPage">
        <input type="text" name="pageName" v-model="path">
        <div 
          @click="save"
          class="btn btn-sm btn-primary">
          save
        </div>
        <div 
          @click="cancel"
          class="btn btn-sm btn-secondary">
          cancel
        </div>
      </div>
      <div v-else>
        {{ model.path }}
      </div>
    </td>
    <td class="page-actions">
      <button 
        @click="toggleEditPage = !toggleEditPage"
        :disabled="model.isRequiredPage"
        class="btn btn-sm btn-info">
        <font-awesome-icon :icon="['fas', 'edit']"/>
      </button>
      <router-link 
        :to="{
          name: 'SitePageEdit',
          params: {
            page_id: model.id,
            page_name: model.path,
            site_name: site.name,
          }
        }"
        class="btn btn-success btn-sm site-editor-button"
      >
        <font-awesome-icon :icon="['fas', 'cubes']"/>
      </router-link>
      <button
        :disabled="model.isRequiredPage"
        class="btn btn-sm btn-danger delete-button">
        <font-awesome-icon
          @click="deletePage()"
          :icon="['fas', 'minus-square']"
        />
      </button>
    </td>
    <td>
      <em>add something here to indicate if the page is valid?</em>
    </td>
  </tr>
</template>

<script>
import json_api from '@/services/json-api'

export default {
  name: 'site-page-details',
  data() {
    return {
      toggleEditPage: false,
      path: this.model.path,
    }
  },
  props: {
    model: Object,
    site:  Object,
  },
  methods: {
    save() {
      // update this so it only saves if a change is made
      this.$parent.loading = true
      json_api.updateRecord({
        resource: 'pages',
        id:       this.model.id,
        body: {
          data: {
            id: this.model.id,
            type: this.model.type,
            attributes: {
              path: this.path
            }
          }
        }
      })
      .then(() => {
        this.model.path = this.path;
      })
      .catch((error) => {
        console.error('request failed', error);
        this.$parent.error = true;
      })
      .finally(() => {
        this.$parent.loading = false
        this.toggleEditPage = false;
      })
    },
    cancel() {
      this.toggleEditPage = false;
    },
    deletePage() {
      let confirm = window.confirm('Do you really want to delete this page?')
      if (confirm) {
        // delete page
      }
    }
  }
}
  
</script>

<style scoped>
.delete-button {
  background-color: #dc3545;
}
.page-name {
  padding: 0 10px 0 0;
}
</style>
