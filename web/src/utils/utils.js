
function initialCap(str) {
  return str.slice(0,1).toUpperCase() + str.slice(1);
};

function getErrMsgs(err) {
  var msgs = [{class: 'box-danger', text: err.message}];
  if (process.env['NODE_ENV'] === 'development') {
    msgs.push({ class: 'box-danger', text: err.stack });
  }
  return msgs;
}

module.exports.initialCap = initialCap;
module.exports.getErrMsgs = getErrMsgs;


