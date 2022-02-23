const collegeModel = require("../model/collegeModel")
const internModel = require("../model/internModel")
const validator = require('validator');            // external npm package for validating email 


// validation functions
const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

// Registers a new intern 
const internCreate = async function (req, res) {

    try {
        let requestBody = req.body
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide intern  details' })
            return
        }
        if (!isValid(requestBody.name)) {
            res.status(400).send({ status: false, message: 'name is required' })
            return
        }
        if (!isValid(requestBody.email)) {
            res.status(400).send({ status: false, message: 'email is required' })
            return
        }
        if (!isValid(requestBody.mobile)) {
            res.status(400).send({ status: false, message: 'mobile number is required' })
            return
        }
        if (!isValid(requestBody.collegeName)) {
            res.status(400).send({ status: false, message: 'college name  is required' })
            return
        }
        if (!(validator.isEmail(requestBody.email))) {
            return res.status(400).send({ status: false, msg: 'enter valid email' })
        }

        if (!(/^(\+\d{1,3}[- ]?)?\d{10}$/.test(requestBody.mobile))) {
            res.status(400).send({ status: false, message: `mobile no should be valid mobile number` })
            return
        }
       
        
        // email unique validation
        let emailCheck = await internModel.findOne({email:requestBody.email})
        if(emailCheck){
        return   res.status(400).send({status:false,msg:"this email already exist"})
        }
        
        // number unique validation
        let mobileCheck = await internModel.findOne({mobile:requestBody.mobile})
        if(mobileCheck){
        return  res.status(400).send({status:false,msg:"this mobile number is already exist"})
        }
        
        const collegeId = await collegeModel.findOne({ name: requestBody.collegeName })
        if (!collegeId) {
            return res.status(400).send({ status: false, msg: 'college not found' })
        }
        if (collegeId.isDeleted === true) {
            return res.status(400).send({ status: false, msg: "college is deleted" })
        }
        const createIntern = {
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            collegeId: collegeId._id
        }
        const internCreate = await internModel.create(createIntern)
        res.status(201).send({ status: true, data: internCreate })

    } catch (error) {
        res.status(500).send({ status: false, msg: error })
    }
}
module.exports.internCreate = internCreate;
