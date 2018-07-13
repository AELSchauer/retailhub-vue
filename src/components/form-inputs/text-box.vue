<template>
  <div :class="rootClass">
    <label :for="inputId" class="form-label col-md-2">
      {{ label }}
    </label>
    <div v-if="error" class="input-error col-md-9">
      There was a problem rendering this input field
    </div>
    <input v-else
      :value="get()"
      @input="set($event.target.value)"
      :id="'input' + this.attribute.camelCase().capitalize()"
      class="form-control col-md-9"
      :required="options.required"
      :autofocus="options.autofocus"
      :type="options.type"
    >
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'form-input-text-box',
  data() {
    return {
      error: false,
      loading: true,
      // See this page for origins of this list:
      // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
      allowedTypes: [
        'date', 'datetime-local', 'email', 'hidden', 'month', 'number',
        'password', 'range', 'tel', 'text', 'time', 'url', 'week'
      ]
    }
  },
  props: {
    attribute:    String,
    label:        String,
    options:      Object,
    wrapperClass: String,
  },
  computed: {
    inputId: function() {
      return 'input' + this.attribute.camelCase().capitalize()
    },
    rootClass: function() {
      return _
        .chain(['input-wrapper'])
        .concat(this.wrapperClass)
        .compact()
        .join(' ')
        .value()
    }
  },
  created() {
    this.verifyType()
  },
  methods: {
    get() {
      return this.$parent.get(this.attribute)
    },
    set(newValue) {
      this.$parent.set(this.attribute, newValue)
    },
    verifyType() {
      if (!_.includes(this.allowedTypes, this.options.type)) {
        this.error = true
      }
    }
  },
}
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}
a {
  color: #42b983;
}
.form-label {
  align-self: center;
  margin: 0;
  padding: 0 10px 0 0;
  text-align: right;
}
.form-input {
  align-self: center;
  margin: 0;
}
.row {
  padding: 5px 0;
}
.btn-row {
  padding: 0px 5px;
}
.input-error {
  color: red;
}
</style>
