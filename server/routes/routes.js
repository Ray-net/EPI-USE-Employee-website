const express = require('express');
const route = express.Router()

const services = require('../service/service');
const controller = require('../controller/controller');

/**
 *  @description Root Route
 *  @method GET /
 */
route.get('/', services.home_routes);


/**
 *  @description for update user
 *  @method GET /update-user
 */
route.get('/table-view', services.table_view);

route.get('/view-employee', services.view_employee);

// API
route.post('/api/create', controller.create);
route.get('/api/findall', controller.find);
route.get('/api/findsalary/:min/:max', controller.findsalaryrange);
route.get('/api/findone', controller.findone);
route.post('/api/update', controller.update);
route.get('/api/delete', controller.delete);
route.post('/api/uploads', controller.upload);
route.get('/api/encrypt', controller.encrypt);

module.exports = route



