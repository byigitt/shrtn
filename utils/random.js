const 
  alphanumeric = require('nanoid-generate/nolookalikes');

module.exports = () => {
  return alphanumeric(5);
};