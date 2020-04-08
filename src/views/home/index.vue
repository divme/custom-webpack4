<template>
  <div>
    <ul class="side">
      <li><router-link to="testform">omo-form</router-link></li>
      <li><router-link to="drag">omo-drag</router-link></li>
      <li><router-link to="draggable">draggable</router-link></li>
      <li><router-link to="dragula">dragula</router-link></li>
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

</style>
