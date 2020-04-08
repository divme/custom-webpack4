<template>
  <div>
    <omo-btn-jsx type="err">谁啊你</omo-btn-jsx>
    <omo-btn size="small" type="success">small success</omo-btn>
    <omo-btn @clicktt="btnClick">
      <template v-slot:default>
        default
      </template>
    </omo-btn>
    <omo-btn size="big" type="err">error</omo-btn>
    <omo-form>
      <omo-form-item>
        <input v-model="text" type="text">
      </omo-form-item>
    </omo-form>
  </div>
</template>

<script>

export default {
  name: 'FormTest',
  // components: [formItem],
  data() {
    return {
      text: '132'
    }
  },
  methods: {
    btnClick() {
      debugger
      this.promise().then(() => {
        console.log('promise then')
      })
      alert(123)
    },
    promise() {
      const isHas = [1, 2, 3].includes(2)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log(isHas, 'promise')
        }, 1000)
      })
    }
  }
}
</script>

<style scoped>

</style>
