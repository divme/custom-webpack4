<template>
  <div class="option-list">
    <el-button :loading="loading" :disabled="!hasCall" content="" class="option-box call" @click="optionClick('call')">
      <svg-icon icon-class="optioncall"/>
      <span class="option-name">{{ callName }}</span>
    </el-button>
    <el-button :loading="loading" :disabled="!hasPut" class="option-box put" @click="optionClick('put')">
      <svg-icon icon-class="optionput"/>
      <span class="option-name">{{ putName }}</span>
    </el-button>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      detailRouter: '',
      callName: '欧式看涨',
      putName: '欧式看跌',
      hasPut: false,
      put: [],
      hasCall: false,
      call: []
    }
  },
  computed: {
    curOptions() {
      return this.options.map(function(cur) {
        const str = cur.shortName.indexOf('涨') < 0 ? 'put' : 'call'
        cur.class = str
        cur.svg = 'option' + str
        return cur
      })
    }
  },
  watch: {
    options(val) {
      const cur = val[0]
      if (cur && cur.type) {
        switch (cur.type) {
          case 'Vanilla':
            this.detailRouter = '/optionDetailVanilla'
            this.callName = '欧式看涨'
            this.putName = '欧式看跌'
            break
          case 'CallPutSpread':
            this.detailRouter = '/optionDetailSpread'
            this.callName = '跨价看涨'
            this.putName = '跨价看跌'
            break
          case 'Digital':
            this.detailRouter = '/optionDetailDigital'
            this.callName = '二元看涨'
            this.putName = '二元看跌'
            break
          case 'KnockOutOptions':
            this.detailRouter = '/optionDetailShark'
            this.callName = '看涨鲨鱼鳍'
            this.putName = '看跌鲨鱼鳍'
            break
        }
      }
      val.forEach((cur) => {
        if (cur.shortName.indexOf('涨') < 0) {
          this.hasPut = true
          this.put = cur
        } else {
          this.hasCall = true
          this.call = cur
        }
      })
    }
  },
  methods: {
    optionClick(item, e) {
      this.$store.dispatch('ConfirmCurOption', {
        curOption: this[item]
      })
      this.$router.push({ path: this.detailRouter })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .option-list{
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    .option-box{
      position: relative;
      flex: 0 0 auto;
      align-items: center;
      width: 1.6rem;
      height: .45rem;
      margin: .22rem 0;
      border-radius: .04rem;
      border: none;
      color: var(--white);
      text-align: center;
      &.put{
        background: var(--green);
      }
      &.call{
        background: var(--red);
      }
      &.is-disabled:after{
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 99;
        background: rgba(0, 0, 0, 0.7);
      }
      .svg-icon{
        width: .15rem;
        height: .15rem;
      }
      .option-name{
        font-size: 14px;
      }
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss">
  .option-list{
    .el-button.is-loading:before{
      background: none;
    }
  }
</style>
