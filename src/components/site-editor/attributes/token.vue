<template>
  <tr class="attribute-wrapper">
    <th class="attribute-label" @click="showAttributeInput">
      {{ attribute.name }}:
    </th>
    <td class="attribute-value" >
      {{ get() }}
    </td>
    <modal name='token-builder'
      :resizable="true"
      :clickToClose="false"
      :height="600">
      <div class="modal-content">
        <div class="token-builder">
          <div>
            <label>model</label>
            <select v-model="changeset.model">
              <option>deals</option>
              <option>events</option>
              <option>malls</option>
            </select>
          </div>
          <div>
            <label>args</label>
            <table>
              <tr v-for="(arg, i) in changeset.args" class="arg-row">
                <td>{{arg.name}}</td>
                <td v-if="arg.name === 'filter'">
                  <tr v-for="(opt, j) in arg.opts" class="opt-row">
                    <td><input type="text" v-model="opt.attr"></td>
                    <td>=</td>
                    <td><input type="text" v-model="opt.value"></td>
                    <td v-if="!(j === 0 && arg.opts.length === 1)">
                      <font-awesome-icon
                        @click="removeOpt(arg, j)"
                        :icon="['fas', 'minus-square']"
                      />
                    </td>
                    <td v-if="(j + 1) === arg.opts.length">
                      <font-awesome-icon
                        @click="addOpt(arg, 'sort')"
                        :icon="['fas', 'plus-square']"
                      />
                    </td>
                  </tr>
                </td>
                <td v-else-if="arg.name === 'sort'">
                  <tr v-for="(opt, j) in arg.opts" class="opt-row">
                    <td><input type="text" v-model="opt.attr"></td>
                    <td>
                      <select v-model="opt.order">
                        <option>asc</option>
                        <option>desc</option>
                      </select>
                    </td>
                    <td v-if="!(j === 0 && arg.opts.length === 1)">
                      <font-awesome-icon
                        @click="removeOpt(arg, j)"
                        :icon="['fas', 'minus-square']"
                      />
                    </td>
                    <td v-if="(j + 1) === arg.opts.length">
                      <font-awesome-icon
                        @click="addOpt(arg, 'sort')"
                        :icon="['fas', 'plus-square']"
                      />
                    </td>
                  </tr>
                </td>
                <td>
                  <font-awesome-icon
                    @click="removeArg(i)"
                    :icon="['fas', 'minus-square']"
                  />
                </td>
              </tr>
            </table>
            <select value="" @input="addArg($event.target.value)">
              <option></option>
              <option>filter</option>
              <option>sort</option>
            </select>
          </div>
        </div>
        <div class="action-buttons btn-group">
          <button @click="save" class="btn btn-block btn-primary">save</button>
          <button @click="cancel" class="btn btn-block btn-secondary">cancel</button>
        </div>
      </div>
    </modal>
  </tr>
</template>

<script>
import _ from 'lodash'
import TokenConverter from '@/helpers/token-converter'
import FormInput from '@/components/form-elements/input'

export default {
  name: 'bento-token-attribute',
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
  created() {
    this.changeset = this.jsonToToken()
  },
  methods: {
    showAttributeInput() {
      this.isShowingAttributeInput = !this.isShowingAttributeInput;
      (this.isShowingAttributeInput) ? (this.$modal.show('token-builder')) : (this.$modal.hide('token-builder'))
    },
    jsonToToken() {
      let data = this.model[this.attribute.name].api
      let args = _.toPairs(data.args).map(([name, opts]) => {
        if (name === 'filter') {
          return {
            name: name,
            opts: _.toPairs(opts).map(([attr, value]) => {
              return {
                attr: attr,
                value: value
              }
            })
          }
        }
        else if (name === 'sort') {
          let [attrs, orders] = opts
          return {
            name: name,
            opts: attrs.map((attr, index) => {
              return {
                attr: attr,
                order: orders[index],
              }
            })
          }
        }
      })
      return {
        model: data.model,
        args: args
      }
    },
    tokenToJson() {
      let args = {}
      this.changeset.args.forEach(arg => {
        let opts
        if (arg.name === 'filter') {
          opts = {}
          arg.opts.forEach(opt => {
            console.log('opt', opt)
            opts[opt.attr] = opt.value
          })
        }
        else if (arg.name === 'sort') {
          opts = [[], []]
          arg.opts.forEach(opt => {
            opts[0].push(opt.attr)
            opts[1].push(opt.order)
          })
        }
        args[arg.name] = opts
      })

      return {
        api: {
          model: this.changeset.model,
          args: args
        }
      }
    },
    addArg(name) {
      if (name === 'filter') {
        this.changeset.args.push({ name: name, attr: 'attr', value: 'value' })
      }
      else if (name === 'sort') {
        this.changeset.args.push({ name: name, opts: [{ attr: 'attr', order: 'asc' }] })
      }
    },
    removeArg(index) {
      let args = this.changeset.args
      this.changeset.args = args.slice(0, index).concat(args.slice(index+1, args.length))
    },
    addOpt(arg, name) {
      if (name === 'filter') {
        arg.opts.push({ attr: 'attr', value: 'value' })
      }
      else if (name === 'sort') {
        arg.opts.push({ attr: 'attr', order: 'asc' })
      }
    },
    removeOpt(arg, index) {
      let opts = arg.opts
      arg.opts = opts.slice(0, index).concat(opts.slice(index+1, opts.length))
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
      this.changeset = this.jsonToToken()
      this.showAttributeInput()
    },
    save() {
      let attr = this.attribute.name
      this.model[attr] = this.tokenToJson()
      this.showAttributeInput()
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
.modal-content {
  border: none;
  height: 100%;
  padding: 20px;
  display: flex;
  justify-content: space-between;
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
.arg-row > td {
  padding: 15px 10px;
}
.action-buttons {
  margin-top: 20px;
  display: flex;
  align-items: bottom;

  .btn {
    margin: 10px 0;
  }
}
</style>
