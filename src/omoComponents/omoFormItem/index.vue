<template>
  <div>
    form item
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'FormItem',
  props: {
    model: {
      type: Object,
      default: function() {
        return {}
      }
    },
    rules: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: function() {
        return {}
      }
    }
  },
  provide() {
    return {
      form: this
    }
  },
  data() {
    return {
      fields: []
    }
  }
}
</script>

<style scoped>

</style>
