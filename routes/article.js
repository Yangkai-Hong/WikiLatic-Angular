const express = require('express')
const router = express.Router()
const revision = require("../models/revision")

var number
var top5 = new Array()
var AnonNumber = new Array()
var adminNumber = new Array()
var botNumber = new Array()
var userNumber = new Array()

//get all articles
router.get('/all',(req,res,next) =>{
	revision.getArticles(function (err,result) {
		if (err!=0){
			console.log('getAllArticles err in article router')
		}
		else {
			res.json(result);
		}
    })
});

//update revisions for an individual article
router.get('/individual/revisions',(req, res,next) =>{
	title = req.query.title
	revision.updateRevisions(title,function(err, result){
		if (err != 0){
			res.json({'count':'error'}
		)
		}else{
			//console.log(result)
			updatedNum = result.length
			res.json({'count':updatedNum})
		}
	})
});

router.get('/individual',(req, res, next) =>{
	title = req.query.title
	revision.getRevNumTotal(title,function(err, result){
		if (err != 0){
			res.json({'count':'error'}
		)}
		else{
			number = result
			next()
		}
	})
});

router.get('/individual',(req,res,next) =>{
	title = req.query.title
	revision.getTop5(title,function(err, result){
		if (err != 0){
			console.log('error')}
		else{
			top5.splice(0,top5.length)
			for (var i in result){
				top5.push(result[i]['_id'])
			}
			next()
		}
	})
});

router.get('/individual',(req,res,next) =>{
	title = req.query.title
	revision.getAnonNumByYear(title,function(err, result){
		if (err != 0){console.log('error')}
		else{
			AnonNumber.splice(0,AnonNumber.length);
			for (var i = 2001; i <= 2018 ; i++){
				AnonNumber.push({_id:i.toString(),numOfEdits:0})
			}
			for (var i in result){
				for (var j = 2001; j <= 2018 ; j++){
					if (result[i]['_id'] == j.toString())
						AnonNumber[j-2001]['numOfEdits'] += result[i]['numOfEdits']
				}
			}
			next()
		}		
	})
});

router.get('/individual',(req,res,next) =>{
	title = req.query.title
	revision.getBotNumByYear(title,function(err, result){
		if (err != 0){console.log('error')}
		else{
			botNumber.splice(0,botNumber.length);
			for (var i = 2001; i <= 2018 ; i++){
				botNumber.push({_id:i.toString(),numOfEdits:0})
			}
			for (var i in result){
				for (var j = 2001; j <= 2018 ; j++){
					if (result[i]['_id'] == j.toString())
						botNumber[j-2001]['numOfEdits'] += result[i]['numOfEdits']
				}
			}
			next()
		}				
	})	
});

router.get('/individual',(req,res,next) =>{
	title = req.query.title
	revision.getAdminNumByYear(title,function(err, result){
		if (err != 0){console.log('error')}
		else{
			adminNumber.splice(0,adminNumber.length);
			for (var i = 2001; i <= 2018 ; i++){
				adminNumber.push({_id:i.toString(),numOfEdits:0})
			}
			for (var i in result){
				for (var j = 2001; j <= 2018 ; j++){
					if (result[i]['_id'] == j.toString())
						adminNumber[j-2001]['numOfEdits'] += result[i]['numOfEdits']
				}
			}
			next()
		}				
	})		
});

router.get('/individual',(req,res,next) =>{
	title = req.query.title
	revision.getUserNumByYear(title,function(err, result){
		if (err != 0){console.log('error')}
		else{
			userNumber.splice(0,userNumber.length);
			for (var i = 2001; i <= 2018 ; i++){
				userNumber.push({_id:i.toString(),numOfEdits:0})
			}
			for (var i in result){
				for (var j = 2001; j <= 2018 ; j++){
					if (result[i]['_id'] == j.toString())
						userNumber[j-2001]['numOfEdits'] += result[i]['numOfEdits']
				}
			}

			//convert data to google char format
			var chart = new Array()
			for (var year = 2001 ; year <= 2018 ; year ++){
				chart.push({year:year.toString(),
					       admin:adminNumber[year-2001]['numOfEdits'],
					       anon:AnonNumber[year-2001]['numOfEdits'],
					       bot:botNumber[year-2001]['numOfEdits'],
					       user:userNumber[year-2001]['numOfEdits']})
			}
			//console.log('User')
			res.json({Title:title,RevNum:number,top5:top5,result:chart})
		}				
	})
});

router.get('/individual/top5',(req,res,next) =>{
	var title = req.query.title
	var users = req.query.users
	//console.log(title,users)
	revision.getTop5RevNumByYear(title,users,function(err, result){
		if (err != 0){console.log('error')}
		else{
			var chartData = new Array()
			var duration = new Array()
			for (var i in result){
				duration.push(result[i]['_id']['year'])
			}
			earliest = Math.min.apply(null,duration);
			latest = Math.max.apply(null,duration);
			//console.log(earliest,latest);
            for (j=0;j<users.length;j++) {
                for (i = earliest; i < latest + 1; i++) {
                    chartData.push({year: i, user: users[j], revNum: 0})
                }
            }
			for (var i in result){
				for (j=0;j<chartData.length;j++)
				if (result[i]['_id']['year']==chartData[j]['year'] && result[i]['_id']['user']==chartData[j]['user']){
					chartData[j]['revNum'] = result[i]['numOfEdits'];
				}
			}
			res.json(chartData)
			//console.log(chartData)
		}
	})	
});

module.exports = router;



