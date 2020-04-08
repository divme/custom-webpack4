<template>
  <div class="option-list">
    <div v-for="item in curOptions" :key="item.name" class="option-box" @click="optionClick(item)">
      <svg-icon :icon-class="item.svg"/>
      <span class="option-name">{{ item.shortName }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true
    }
  },
  computed: {
    curOptions() {
      return this.options.map(function(cur) {
        const str = cur.shortName.indexOf('涨') < 0 ? 'put' : 'call'
        let strPrev
        switch (cur.type) {
          case 'Vanilla':
            strPrev = 'van'
            break
          case 'CallPutSpread':
            strPrev = 'spread'
            break
          case 'Digital':
            strPrev = 'dig'
            break
          case 'KnockOutOptions':
            strPrev = 'shark'
            break
          default:
            strPrev = 'van'
        }
        cur.svg = strPrev + str
        return cur
      })
    }
  },
  methods: {
    optionClick(item, e) {
      this.$store.dispatch('ConfirmCurOption', {
        curOption: item
      })
      if (item.type) {
        switch (item.type) {
          case 'Vanilla':
            this.$router.push({ path: '/optionDetailVanilla' })
            break
          case 'CallPutSpread':
            this.$router.push({ path: '/optionDetailSpread' })
            break
          case 'Digital':
            this.$router.push({ path: '/optionDetailDigital' })
            break
          case 'KnockOutOptions':
            this.$router.push({ path: '/optionDetailShark' })
            break
          default:
            this.$router.push({ path: '/optionDetail' })
        }
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .option-list{
    display: flex;
    justify-content: start;
    align-items: center;
    flex-wrap: wrap;
    .option-box{
      flex: 0 0 25%;
      margin: .2rem 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      .svg-icon{
        width: .25rem;
        height: .25rem;
      }
      .option-name{
        margin-top: .12rem;
        font-size: 14px;
      }
    }
  }
</style>
