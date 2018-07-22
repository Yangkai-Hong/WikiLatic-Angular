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

var authors = [];
router.get('/all',(req,res,next) =>{
    revision.getUniqueAuthors(function (err,result) {
        if (err!=0){
            res.json({'authors':'error'})
        }
        else{
            authors = [];
            for (var i=0;i<result.length;i++){
                authors.push(result[i]['_id'])
            }
            res.json({authors:authors})
        }
    })
});

module.exports = router;