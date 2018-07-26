<template>
  <tr class="attribute-wrapper">
    <th class="attribute-label" @click="isShowingAttributeInput = true">
      {{ attribute.name }}:
    </th>
    <template v-if="isShowingAttributeInput"
      class="attribute-value"
      :class="[{ 'default-value': get(attribute.name, 'isDefault') }]"
    >
      <td class='attribute-input'>
        <input
          type="text"
          :value="get()"
          @input="set($event.target.value)">
      </td>
      <td class="attribute-buttons">
        <button @click="save" class="btn btn-primary">save</button>
        <button @click="cancel" class="btn btn-secondary">cancel</button>
      </td>
    </template>
    <td v-else
      class="attribute-value" 
    >
      {{ get('tokenized') }}
    </td>
  </tr>
</template>

<script>
import TokenConverter from '@/helpers/token-converter'
import FormInput from '@/components/form-elements/input'

export default {
  name: 'bento-text-attribute',
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
  computed: {},
  methods: {
    toggleShowingAttributeInput() {
      this.isShowingAttributeInput = !this.isShowingAttributeInput;
    },
    get(option='stringified') {
      let attrName = this.attribute.name
      let jsonValue = this.model[attrName] || this.changeset[attrName]
      if (jsonValue) {
        return {
          stringified: TokenConverter.convertJsonToText(jsonValue, attrName),
          tokenized: TokenConverter.convertJsonToInlineTokens(jsonValue, attrName),
          isDefault: false,
        }[option]
      }
      else {
        jsonValue = this.attribute.manifest.default
        return {
          stringified: TokenConverter.convertJsonToText(jsonValue, attrName),
          tokenized: TokenConverter.convertJsonToInlineTokens(jsonValue, attrName),
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
    FormInput,
  },
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
