const Subject = require("../model/SubjectModel")

exports.addingSubject = async(req,res)=>{
    let subject = new Subject({
        subject_code:req.body.subject_code,
        subject:req.body.subject,
        price:req.body.price,
        field:req.body.field,

        university:req.body.university,
        college:req.body.college,
        level:req.body.level,


        uploader:req.body.uploader,
        review:req.body.review,

        preview:req.body.preview,
        contact:req.body.contact,
    })
subject = await subject.save()
if(!subject) return res.status(400).json({error:"there was an error while processing of the subjects"})
res.send(subject)
}

exports.listingSubject = async(req,res)=>{
    let subject = await Subject.find()
    if(!subject) return res.status(400).json({error:"the searched subject could not be found try again"})
    res.send(subject)
}

exports.detailingSubject = async(req,res)=>{
let subject = await Subject.findById(req.params.id)
if(!subject) return res.status(400).json({error:"the searched subject could not be identified at the moment with the entered id"})
res.send(subject)
}

exports.updatingSubject = async(req,res)=>{
    let subject = await Subject.findByIdAndUpdate(req.params.id,{
        subject_code:req.body.subject_code,
        subject:req.body.subject,
        price:req.body.price,
        field:req.body.field,

        university:req.body.university,
        college:req.body.college,
        level:req.body.level,
        uploader:req.body.uploader,
        review:req.body.review,

        preview:req.body.preview,
        contact:req.body.contact,
    },{new:true})

    subject = await subject.save()
    if(!subject) return res.status(400).json({error:"there was some error with saving the subject"})
    res.status(200).json({message:"the subject details were edited successfully"})
}

exports.deletingSubject = async(req,res)=>{
    let subject = await Subject.findByIdAndRemove(req.params.id)

    if(!subject) return res.status(400).json({error:"there was some error while deleting the subject"})
    res.status(200).json({message:"the subject was deleted"})
}