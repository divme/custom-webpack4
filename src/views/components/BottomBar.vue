<template xmlns:font-size="http://www.w3.org/1999/xhtml">
  <div class="footer">
    <router-link :class="{ active : isQuote }" to="/">
      <svg-icon icon-class="quote"/>
      <span>报价</span>
    </router-link>
    <router-link :class="{ active : isMine }" to="/mine">
      <svg-icon icon-class="mine"/>
      <span>我的</span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'BottomBar',
  props: {
    current: {
      type: String,
      required: true,
      default: 'quote'
    }
  },
  data() {
    return {
      isQuote: false,
      isMine: false,
      isEnquiry: false
    }
  },
  created() {
    this.$nextTick(() => {
      this.isCurrent(this.current)
    })
  },
  methods: {
    isCurrent(str) {
      this.isQuote = false
      this.isMine = false
      this.isEnquiry = false
      if (str === 'mine') {
        this.isMine = true
      } else if (str === 'quote') {
        this.isQuote = true
      } else if (str === 'enquiry') {
        this.isEnquiry = true
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .footer{
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: .5rem;
    /*border-top: 1px solid var(--border);*/
    background: var(--bg-lighter);
    z-index: 99;
    &>a{
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 50%;
      height: .5rem;
      font-size: 10px;
      text-align: center;
      color: var(--text);
      .svg-icon{
        width: .2rem;
        height: .2rem;
      }
      span{
        margin-top: .07rem;
        font-size: 12px;
      }
    }
    .active{
      color: var(--red);
    }
  }
</style>
