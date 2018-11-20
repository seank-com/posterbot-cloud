
function initialCap(str) {
  return str.slice(0,1).toUpperCase() + str.slice(1);
};

function getUser(req) {
  if (req.user) {
    req.user.username = initialCap(req.user.username);
    req.user.startmonth = req.user.createdAt.toLocaleString('en-US', { month: 'short', year: 'numeric' });
  }
  return req.user;
};

module.exports.initialCap = initialCap;
module.exports.getUser = getUser;


