<template>
  <div id="home">
    <div><el-button type="primary" icon="el-icon-search">搜索按钮</el-button></div>
    <ul class="side">
      <li><router-link to="testform">omo-form</router-link></li>
      <li><router-link to="drag">omo-drag</router-link></li>
      <img src="@/assets/via.jpg" alt=""/>
    </ul>
    <div class="main">
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
  .side {
    background: url("../../assets/via.jpg") no-repeat right top;
    background-size: 50px 50px;
  }
</style>
