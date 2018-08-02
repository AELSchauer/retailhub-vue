<template>
  <tr class="arg-row">
    <td>{{arg.name}}</td>
    <td>
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
</template>

<script>
export default {
  name: 'bento-query-args-sort',
  data() {
    return {
      isShowingAttributeInput: false,
      changeset: {},
    }
  },
  props: {
    arg: Object,
  },
  methods: {
    addOpt() {
      this.$parent.addOpt(this.arg, { attr: 'attr', order: 'asc' })
    },
    removeOpt(index) {
      this.$parent.removeOpt(this.arg, index)
    },
    removeArg(index) {
      this.$parent.removeArg(index)
    }
  },
}
</script>

<style lang="scss" scoped>
.arg-row > td {
  padding: 15px 10px;
}
</style>
