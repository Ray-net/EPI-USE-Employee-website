var employee = require('../model/model');
const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
app.use(fileUpload());
const path = require('path');
var md5 = require("nodejs-md5");

exports.upload = (req,res)=>{
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }
    console.log(req);
    const file = req.body.img.files;
    const filePath = path.join(__dirname, 'libs', 'images', `${file.name}`);
  
    file.mv(filePath, err => {
        if (err) return res.status(500).send(err)
        return filePath;
    })

}
// create and save new user
exports.create = (req,res)=>{
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }

    // new user
    const createEmployee = new employee({
        name : req.body.name,
        surname :req.body.surname,
        dateOfBirth: req.body.dob,
        manager:req.body.manager,
        employeeNumber:req.body.employeenumber,
        role: req.body.role,
        salary: req.body.salary,
        email: req.body.email

    })
    console.log(createEmployee);

    // save user in the database
    createEmployee
        .save(createEmployee)
        .then(data => {
            //res.send(data)
            res.redirect('/');
        })
        .catch(err =>{
            res.status(500).send({
                message : err.message || "Some error occurred while creating a create operation"
            });
        });

}

// retrieve and return all users
exports.find = (req, res)=>{
        employee.find()
            .then(user => {
                res.send(user)
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving user information" })
            })
    
}
exports.findone = (req, res)=>{

    if(req.query.id){
        const id = req.query.id;

        employee.findOne({employeeNumber:id})
            .then(data =>{
                if(!data){
                    res.status(404).send({ message : "Not found user with id "+ id})
                }else{
                    res.send(data)
                }
            })
            .catch(err =>{
                res.status(500).send({ message: "Erro retrieving user with id " + id})
            })

    }


}
// Update a new idetified user by user id
exports.update = (req, res)=>{
    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }
    let id = req.body.originalId;

    const createEmployee = {

        name : req.body.name,
        surname :req.body.surname,
        dateOfBirth: req.body.dob,
        manager:req.body.manager,
        employeeNumber:req.body.employeenumber,
        role: req.body.role,
        salary: req.body.salary,
        email: req.body.email
    };
    
    employee.updateOne({employeeNumber:id}, createEmployee)
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Update user with ${id}. Maybe user not found!`})
            }else{
                res.send(data)
            }
        })
        .catch(err =>{
            res.status(500).send({ message : "Error Update user information"})
        })
}
//{ u1 : { $gt :  30, $lt : 60}}
exports.findsalaryrange = (req, res)=>{

    if(req.params.min && req.params.max){
        const min = req.params.min;
        const max = req.params.max;
    
        console.log(min);
        employee.find({salary:{ $gt :  Number(min), $lt : Number(max)}})
            .then(data =>{
                if(!data){
                    res.status(404).send({ message : "Not found user with id "+ id})
                }else{
                    res.send(data)
                }
            })
            .catch(err =>{
                res.status(500).send({ message: "Erro retrieving user with id " + id})
            })

    }

    
}


// Delete a employee with specified employee number in the request
exports.delete = (req, res)=>{
    const id = req.query.id;
    employee.deleteOne({employeeNumber: id})
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
            }else{
                employee.find()
                    .then(allworker => {
                        allworker.forEach(element => {
                            if(element.manager ==id){
                                const createEmployee = {

                                    name : element.name,
                                    surname :element.surname,
                                    dateOfBirth: element.dob,
                                    manager:'',
                                    employeeNumber:element.employeeNumber,
                                    role: element.role,
                                    salary: element.salary,
                                    email: element.email
                                };
                                employee.updateOne({employeeNumber:element.employeeNumber}, createEmployee)
                        .then(data => {
                            if(!data){
                                res.status(404).send({ message : `Cannot Update user with ${id}. Maybe user not found!`})
                            }
                        })
                        .catch(err =>{
                            res.status(500).send({ message : "Error Update user information"})
                        })
                            }
                        });
                        
                })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving user information" })
            })
                res.redirect('/');
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });
        
}
exports.encrypt = (req, res)=>{
    const str = req.query.str;
    md5.string(str, function (err, md5) {
        if (err) {
            res.status(404).send({ message : "Not found user with id "+ id});
        }
        else {
           res.send(md5);
        }
    });
    
}


