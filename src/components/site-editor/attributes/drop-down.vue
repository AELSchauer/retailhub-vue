<template>
  <tr class="attribute-wrapper">
    <th class="attribute-label" @click="isShowingAttributeInput = true">
      {{ attribute.name }}:
    </th>
    <template v-if="isShowingAttributeInput"
      class="attribute-value"
      :class="[{ 'default-value': get(attribute.name, 'isDefault') }]"
    >
      <td class="attribute-form">
        <select
          :value="get()"
          @input="set($event.target.value)"
          class='attribute-input'>
          <option v-for="option in selectOptions"
            :disabled="option.disabled"
            :value="option.value || option.text"
          >
            {{ option.text }}
          </option>
        </select>
      </td>
      <td class="attribute-buttons">
        <button @click="save" class="btn btn-primary">save</button>
        <button @click="cancel" class="btn btn-secondary">cancel</button>
      </td>
    </template>
    <td v-else
      class="attribute-form" 
    >
      {{ get() }}
    </td>
  </tr>
</template>

<script>
import FormSelect from '@/components/form-elements/select'

export default {
  name: 'bento-drop-down-attribute',
  data() {
    return {
      isShowingAttributeInput: false,
      changeset: {},
    }
  },
  props: {
    attribute: Object,
    model:     Object,
  },
  computed: {
    selectOptions: function() {
      return this.attribute.manifest.whitelist.map(name => {
        return { text: name }
      })
    },
  },
  methods: {
    toggleShowingAttributeInput() {
      this.isShowingAttributeInput = !this.isShowingAttributeInput;
    },
    get(attr, option='value') {
      let attrName = this.attribute.name
      let jsonValue = this.model[attrName] || this.changeset[attrName]
      if (jsonValue) {
        return {
          value: jsonValue,
          isDefault: false,
        }[option]
      }
      else {
        jsonValue = this.attribute.manifest.default
        return {
          value: jsonValue,
          isDefault: true,
        }[option]
      }
    },
    set(newValue) {
      let attr = this.attribute.name
      this.changeset[attr] = newValue;
    },
    cancel() {
      let attr = this.attribute.name
      delete this.changeset[attr]
      this.toggleShowingAttributeInput()
    },
    save() {
      let attr = this.attribute.name
      if (this.changeset[attr]) {
        this.model[attr] = this.changeset[attr]
      }
      delete this.changeset[attr]
      this.toggleShowingAttributeInput()
    },
  },
  components: {
    FormSelect,
  }
}
</script>

<style lang="scss" scoped>
.attribute-wrapper {
  width: 100%;
}
th, td {
  padding-left: 10px
}
.attribute-label, .attribute-buttons {
    width:1%;
    white-space:nowrap;
}
.attribute-input input {
  width: 100%;
}
.default-value {
  font-style: italic;
}
</style>
