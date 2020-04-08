const path = require('path');

const project = path.resolve(__dirname, '../');
const dist = path.resolve(project, 'dist');
const src = path.resolve(project, 'src');

module.exports = {
  project,
  dist,
  src
};
