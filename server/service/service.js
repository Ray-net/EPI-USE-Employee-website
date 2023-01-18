exports.home_routes = (req, res) => {
  // Make a get request to /api/users
  res.render("index");
};

exports.table_view = (req, res) => {
  res.render("tableView");
};

exports.view_employee = (req, res) => {
  res.render("viewEmployee");
};
