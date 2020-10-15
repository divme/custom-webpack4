<template>
  <div id="home">
    <div><el-button type="primary" icon="el-icon-search">搜索ds按钮</el-button></div>
    <ul class="side">
      <img src="../../assets/via.jpg" alt=""/>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
#home{
  font-size: 15px;
}
.side {
  background: url("../../assets/via.jpg") no-repeat right top;
  background-size: 50px 50px;
}
</style>
