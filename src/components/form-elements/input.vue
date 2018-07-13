<template>
  <div :class="_classMerger('input-wrapper', this.rootClass)">
    <label :for="inputId" :class="_classMerger('form-label', this.labelClass)">
      {{ label }}
    </label>
    <div v-if="error" class="input-error">
      There was a problem rendering this input field
    </div>
    <input v-else
      :value="get()"
      @input="set($event.target.value)"
      v-bind="loadedOptions"
    >
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'form-input',
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
      // radio and checkbox types are not supported here because the way
      // the data is processed means they should be separate components
    }
  },
  props: {
    attribute:  String,
    label:      String,
    options:    Object,
    labelClass: String,
    rootClass:  String,
  },
  computed: {
    inputId: function() {
      return 'input' + this.label.replace(/ /g, '');
    },
    loadedOptions: function() {
      let defaultOptions = {
        id: this.inputId,
        class: 'form-input'
      }
      return _
        .chain(this.options)
        .omit(['value','input'])
        .set('class', this._classMerger(defaultOptions.class, this.options.class))
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
        console.error(`ERROR: The input type '${this.options.type}' is not supported. ` +
          'It may be able to be invoked with another form component.')
        this.error = true
      }
    },
    _classMerger(classA, classB) {
      return _
        .chain([ classA ])
        .concat([ classB ])
        .compact()
        .join(' ')
        .value()
    }
  },
}
</script>

<style scoped lang=scss>
@import "~@/styles/placeholders";

.form-label {
  @extend %form-label;
}
</style>
