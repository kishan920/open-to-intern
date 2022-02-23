const collegeModel = require("../model/collegeModel")
const internModel = require("../model/internModel")


// validation functions
const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

// Register a New College

const collegeCreate = async function (req, res) {
    try {
        let requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide college details' })
            return
        }
        if (!isValid(requestBody.name)) {
            res.status(400).send({ status: false, message: 'college name is required' })
            return
        }
        if (!isValid(requestBody.fullName)) {
            res.status(400).send({ status: false, message: 'college full name is required' })
            return
        }
        if (!isValid(requestBody.logoLink)) {
            res.status(400).send({ status: false, message: 'logo link is required' })
            return
        }
         // unique validations >

        let uniqueNameCheck = await collegeModel.findOne({name:requestBody.name})
        if(uniqueNameCheck){
        return res.status(400).send({status:false,msg:"this name already exist"})
        }

        let uniqueFullNameCheck = await collegeModel.findOne({fullName:requestBody.fullName})
        if(uniqueFullNameCheck){
        return res.status(400).send({status:false,msg:"this full  name already exist"})
        }
        let collegeCreate = await collegeModel.create(requestBody)
        res.status(201).send({ status: true, data: collegeCreate })

    } catch (error) {
        res.status(500).send({ status: false, msg: error })
    }

}
//=================================================================================================================================>

// get registered interns with college name
const getAllIntern = async function (req, res) {
    try {
        let collegeName = req.query.collegeName;
        if (!collegeName) {
            return res.status(404).send({ status: false, msg: "please provide college name in query params" })
        }
        let collegeDetail = await collegeModel.findOne({ name: collegeName, isDeleted: false }).select({ _id: 1, name: 1, fullName: 1, logoLink: 1 })
        
        if (!collegeDetail) {
            return res.status(404).send({ status: false, msg: "College name not found" })
        }

        let internDetail = await internModel.find({ collegeId: collegeDetail._id, isDeleted: false }).select({ _id: 1, name: 1, email: 1, mobile: 1 })
        if (internDetail.length === 0) {
            return res.status(200).send({
                status: true, msg: {
                    ...collegeDetail.toObject(), interests: "intern Details not present"
                }
            })
        }

        let result = {
            name: collegeDetail.name,
            fullName: collegeDetail.fullName,
            logoLink: collegeDetail.logoLink,
            interests: internDetail
        }
       
        res.status(200).send({ status: true, data: result })

    } catch (error) {
        res.status(500).send({ status: false, msg: error })
    }

}
module.exports.collegeCreate = collegeCreate;
module.exports.getAllIntern = getAllIntern;
