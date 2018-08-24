<template>
  <modal
    name="data-variables-editor"
    :resizable="true"
    :scrollable="true"
    height="auto"
    width="90%"
    @before-close="indexPage()"
  >
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="float-left">Data Variables</h4>
        <span class="float-right">
          <font-awesome-icon v-if="template === 'index'" :icon="['fa', 'plus']" @click="addPage()"/>
          <font-awesome-icon v-else-if="template === 'add'" :icon="['fa', 'arrow-left']" @click="indexPage()"/>
        </span>
      </div>
      <table v-if="template === 'index'">
        <tr v-for="variable in allDataVariables()">
          <td>
            {{ variable.name }}
          </td>
          <td v-if="variable.type === 'image'">
            <img :src="variable.value" class="image-variable">
          </td>
          <td v-else>
            {{ variable.value }}
          </td>
          <td>
            {{ variable.type }}
          </td>
          <td>
            <button :disabled="variable.protected" @click="editPage(variable)"><font-awesome-icon :icon="['fa', 'edit']"/></button>
            <button :disabled="variable.protected" @click="deleteVariable(variable.name)"><font-awesome-icon :icon="['fa', 'minus']"/></button>
          </td>
        </tr>
      </table>
      <div v-else>
        <select v-model="changesetVariable.type">
          <option disabled value="">Select a variable type</option>
          <option>constant</option>
          <option>query</option>
          <option>image</option>
        </select>
        <br>
        <form @submit.prevent="saveVariable()" autocomplete="off" :hidden="changesetVariable.type === ''">
          <table>
            <tr>
              <td>name</td>
              <td>
                <input
                  type="text"
                  :value="changesetVariable.name"
                  @input="setVariableName($event)"
                  required
                >
              </td>
            </tr>
            <tr v-if="changesetVariable.type === 'constant'">
              <td>value</td>
              <td>
                <input
                  v-model="changesetVariable.value"
                  type="text"
                  required
                >
              </td>
            </tr>
            <tr>
              <td>protected?</td>
              <td>
                <input
                  v-model="changesetVariable.protected"
                  type="checkbox"
                >
              </td>
            </tr>
            <tr>
              <td>
                <button type="submit">submit</button>
              </td>
              <td>
                <button @click="indexPage()">cancel</button>
              </td>
            </tr>
          </table>
        </form>
      </div>
    </div>
  </modal>
</template>

<script>
  // 
export default {
  name: 'bento-data-variables-editor',
  data() {
    return {
      template: 'index',
      selectedVariable: null,
      changesetVariable: {
        name: null,
        type: '',
        protected: false,
        value: null,
      }
    }
  },
  props: {
    bus: Object
  },
  mounted() {
    this.bus.$on('showDataVariablesMenu', () => {
      this.$modal.show('data-variables-editor');
    })
  },
  methods: {
    allDataVariables() {
      return this.$parent.get('all_data_variables');
    },
    addPage() {
      this.template = 'add'
    },
    editPage(variable) {
      this.template = 'edit'
      this.selectedVariable = variable
      this.changesetVariable = _.cloneDeep(variable);
    },
    indexPage() {
      this.template = 'index'
      this.changesetVariable = {
        name: null,
        type: '',
        protected: false,
        value: null,
      }
    },
    setVariableName(event) {
      let names = this.allDataVariables().map(_var => _var.name)
      let newValue = event.target.value
      let oldValue = _.get(this.selectedVariable, 'name')

      this.changesetVariable.name = newValue

      if (oldValue != newValue && _.includes(names, newValue)) {
        event.target.setCustomValidity('Variable name is already taken')
      }
      else {
        event.target.setCustomValidity('')
      }
    },
    formatVariable(variable) {
      let name = variable.name
      _.set(variable, 'protected', variable.protected || false)
      _.unset(variable, 'name')
      return _.set({}, name, variable)
    },
    saveVariable() {
      (this.template === 'add') ? (this.createVariable()) : (this.updateVariable())
    },
    createVariable() {
      let formattedVariable = this.formatVariable(this.changesetVariable)
      this.bus.$emit('createDataVariable', formattedVariable)
      this.indexPage()
    },
    updateVariable() {
      let oldVariableName = this.selectedVariable.name
      let formattedVariable = this.formatVariable(this.changesetVariable)
      this.bus.$emit('updateDataVariable', oldVariableName, formattedVariable)
      this.indexPage()
    },
    deleteVariable(variableName) {
      this.bus.$emit('deleteDataVariable', variableName)
      this.indexPage()
    },
  }
}
</script>

<style lang="scss" scoped>
.image-variable {
  max-height: 100px;
  max-width: 200px;
  background: linear-gradient(45deg, #bbb 25%, transparent 25%, transparent 75%, #bbb 75%, #bbb 0),
              linear-gradient(45deg, #bbb 25%, transparent 25%, transparent 75%, #bbb 75%, #bbb 0),
              #444;
  background-repeat: repeat, repeat;
  background-position: 0px 0, 5px 5px;
  transform-origin: 0 0 0;
  background-origin: padding-box, padding-box;
  background-clip: border-box, border-box;
  background-size: 10px 10px, 10px 10px;
  box-shadow: none;
  text-shadow: none;
  transition: none;
  transform: scaleX(1) scaleY(1) scaleZ(1);
}
.modal-content {
  padding: 20px;
  min-height: 100%;
}
.v--modal-box {
  top: 0px;
}
</style>
