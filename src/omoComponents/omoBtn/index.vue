<!--<template>-->
<!--  <div :class="[type, size]" class="btn" @click="click">-->
<!--    <slot>默认值</slot>-->
<!--  </div>-->
<!--</template>-->

<script>
// props: type size loading click
// event: click
// slot:  文字和图标
export default {
  name: 'Btn',
  props: {
    type: {
      type: String,
      default: 'default'
    },
    size: {
      type: String,
      default: 'medium'
    }
  },
  methods: {
    click() {
      this.$emit('clicktt')
    }
  },
  // 渲染函数+ createElement()
  render(h) {
    return h(
      'div',
      {
        class: ['btn', this.type, this.size],
        on: {
          click: this.click
        }
      },
      [this.$slots.default]
    )
  }
}
</script>

<style lang="scss" scoped>
  .btn{
    width: 100px;
    height: 36px;
    line-height: 36px;
    margin: 10px;
    text-align: center;
    border-radius: 3px;
    border: 1px solid yellowgreen;
    background: #ffffff;
    color: yellowgreen;
    cursor: pointer;
    &.small{
      width: 80px;
      height: 30px;
      line-height: 30px;
    }
    &.big{
      width: 120px;
      height: 42px;
      line-height: 42px;
    }
    &.success{
      border: 1px solid yellowgreen;
      background: yellowgreen;
      color: #fff;
    }
    &.err{
      border: 1px solid orange;
      background: orange;
      color: #fff;
    }
    &.warning{
      border: 1px solid red;
      background: red;
      color: #fff;
    }
  }
</style>
