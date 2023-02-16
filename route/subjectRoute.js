const express = require("express")
const { addingSubject, listingSubject, detailingSubject, updatingSubject, deletingSubject } = require("../controller/subjectController")
const router = express.Router()







router.post('/addingsubject',addingSubject)
router.get('/listingsubject',listingSubject)

router.get('/detailingsubject/:id',detailingSubject)
router.put('/updatingsubject/:id',updatingSubject)
router.delete('/deletingsubject/:id',deletingSubject)


module.exports = router