import Vue from 'vue'
// eslint-disable-next-line no-unused-vars
function formatName(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
const components = require.context('./', true, /index\.vue$/)
console.log('require', components.keys())
components.keys().forEach((key) => {
  // debugger
  const config = components(key)
  const arr = key.split('/')
  const name = formatName(arr[arr.length - 2].replace(/-/, '').replace(/\.\w+$/, ''))
  console.log(name)
  Vue.component(name, config.default || config)
})
// ["./omo-dragform/index.vue", "./omo-form/index.vue"]
