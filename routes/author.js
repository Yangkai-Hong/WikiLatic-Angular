const express = require('express')
const router = express.Router()
const revision = require("../models/revision")

router.get('/revisions',(req,res,next) =>{
    var author = req.query.author;
    revision.getRevsByAuthor(author,function (err,result) {
        if(err!=0){
            res.json({'author':'error'})
        }
        else{
            res.json(result)
        }
    })
});

router.get('/',(req,res,next) =>{
    revision.getUniqueAuthors(function (err,result) {
        if (err!=0){
            res.json({'authors':'error'})
        }
        else{
            res.json(result)
        }
    })
});

module.exports = router;