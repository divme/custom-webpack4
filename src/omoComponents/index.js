import Vue from 'vue';
// eslint-disable-next-line no-unused-vars
function formatName(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
const components = require.context('./', true, /\.vue$/);
components.keys().forEach((key) => {
    const config = components(key);
    const arr = key.split('/');
    const name = formatName(arr[arr.length - 2].replace(/-/, '').replace(/\.\w+$/, ''));
    Vue.component(name, config.default || config);
});
