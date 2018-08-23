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
      :scrollable="true"
      height="auto"
      width="90%"
    >
      <div class="modal-content">
        <div class="token-builder row">
          <div class="token-form col-md-6">
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
                <template v-for="(arg, i) in changeset.args">
                  <component :is="`bento-query-args-${arg.name}`" :arg="arg"></component>
                </template>
              </table>
              <select value="" @input="addArg($event.target.value)">
                <option></option>
                <option>filter</option>
                <option>sort</option>
              </select>
            </div>
          </div>
          <div class="token-result col-md-6">
            <pre>{{ get() }}</pre>
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

import BentoQueryArgsFilter from './query-args/filter'
import BentoQueryArgsSort from './query-args/sort'

export default {
  name: 'bento-query-attribute',
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
      let args = this.changeset.args
      if (name === 'filter') {
        args.push({ name: name, attr: 'attr', value: 'value' })
      }
      else if (name === 'sort') {
        args.push({ name: name, opts: [{ attr: 'attr', order: 'asc' }] })
      }

      this.changeset.args = args
    },
    removeArg(index) {
      let args = this.changeset.args
      this.changeset.args = args.slice(0, index).concat(args.slice(index+1, args.length))
    },
    addOpt(arg, opt) {
      arg.opts.push(opt)
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
    BentoQueryArgsFilter,
    BentoQueryArgsSort,
  },
}
</script>

<style lang="scss" scoped>
.attribute-wrapper {
  width: 100%;
}
.modal-content {
  border: none;
  height: auto;
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
