const express = require('express')
const router = express.Router()
const revision = require("../models/revision")
const fs = require('fs')

var AnonNumber = new Array()
var BotNumber = new Array()
var AdminNumber = new Array()
var UserNumber = new Array()

var mostRevisions = new Array()
var leastRevisions = new Array()
var longestHistory = new Array()
var shortestHistory = new Array()
var largestGroup = new Array()
var smallestGroup = new Array()

router.get('/infos',(req,res,next) => {
    var num = parseInt(req.query.num);
    revision.MostRevisions(num, function (err, result) {
        if (err != 0) {
            console.log('mostRevs err in overall router')
        }
        else {
        	mostRevisions = [];
        	for (var i=0;i<result.length;i++){
                mostRevisions.push(result[i]['_id'])
			}
        }
    })
	next();
});

router.get('/infos',(req,res,next) => {
    var num = parseInt(req.query.num);
    revision.LeastRevisions(num, function (err, result) {
        LeastRevisions = new Array();
        if (err != 0) {
            console.log('leastRevs err in overall router')
        }
        else {
        	leastRevisions = [];
            for (var i=0;i<result.length;i++){
            	leastRevisions.push(result[i]['_id'])
			}
        }
    })
	next();
});

router.get('/infos',(req,res,next) =>{
    revision.LargestGroup(function (err, result) {
        LargestGroup = new Array();
        if (err != 0) {
            console.log('largeGP error in overall router')
        }
        else {
            largestGroup = [];
            for (var i=0;i<result.length;i++){
            	largestGroup.push(result[i]['_id'])
			}
        }
    })
	next();
});

router.get('/infos',(req,res,next) =>{
    revision.SmallestGroup(function (err, result) {
        SmallestGroup = new Array();
        if (err != 0) {
            console.log('smallGP error in overall router')
        }
        else {
            smallestGroup = [];
            for (var i=0;i<result.length;i++){
                smallestGroup.push(result[i]['_id'])
            }
        }
    })
	next();
});

router.get('/infos',(req,res,next) =>{
    revision.top3LongestHistory(function (err, result) {
        longHis = new Array();
        if (err != 0) {
            console.log('longHis error in overall router')
        }
        else {
            longestHistory = [];
            for (var i=0;i<result.length;i++){
                longestHistory.push(result[i]['_id'])
            }
        }
    })
	next();
});

router.get('/infos',(req,res,next) =>{
    revision.ShortestHistory(function(err,result){
        shortHis = new Array();
        if (err != 0){
            console.log('shortHis error in overall router')
        }
        else{
            shortestHistory = [];
            for (var i=0;i<result.length;i++){
                shortestHistory.push(result[i]['_id'])
            }
            res.json({mostRevisions: mostRevisions,
				leastRevisions: leastRevisions,
				longestHistory: longestHistory,
				shortestHistory: shortestHistory,
				largestGroup: largestGroup,
				smallestGroup: smallestGroup})
        }
    })
});

//show revisions duration information (facing dataset changes)
revision.getDuration(function (err,result) {
	if (err!=0){
		console.log('getDuration error in overall router')
	}
	else {
		//console.log(result)
		var min = result[0]['_id'];
		var max = result[result.length-1]['_id'];
		console.log('Duration of the revisions is from '+min+' to '+max);
	}
});

// get number of anon, bot, admin and regular users
router.get('/chartData',(req,res,next) =>{
	revision.getAnonNumber(function(err,result){
		if (err != 0){
			console.log('getAnonNum error in overall router')
		}
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

router.get('/chartData',(req,res,next) =>{
	revision.getBotNumber(function(err,result){
		if (err != 0){
			console.log('getBotNum error in overall router')
		}
		else{
			BotNumber.splice(0,BotNumber.length);
			for (var i = 2001; i <= 2018 ; i++){
				BotNumber.push({_id:i.toString(),numOfEdits:0})
			}
			for (var i in result){
				for (var j = 2001; j <= 2018 ; j++){
					if (result[i]['_id'] == j.toString())
						BotNumber[j-2001]['numOfEdits'] += result[i]['numOfEdits']
				}
			}
			next()
		}
	})
});

router.get('/chartData',(req,res,next) =>{
	revision.getAdminNumber(function(err,result){
		if (err != 0){
			console.log('getAdminNum error in overall router')
		}
		else{
			AdminNumber.splice(0,AdminNumber.length);
			for (var i = 2001; i <= 2018 ; i++){
				AdminNumber.push({_id:i.toString(),numOfEdits:0})
			}
			for (var i in result){
				for (var j = 2001; j <= 2018 ; j++){
					if (result[i]['_id'] == j.toString())
						AdminNumber[j-2001]['numOfEdits'] += result[i]['numOfEdits']
				}
			}
			next()
		}
	})
});

router.get('/chartData',(req,res,next) =>{
	revision.getUserNumber(function(err,result){
		if (err != 0){
			console.log('getUserNum error in overall router')
		}
		else{
			UserNumber.splice(0,UserNumber.length);
			for (var i = 2001; i <= 2018 ; i++){
				UserNumber.push({_id:i.toString(),numOfEdits:0})
			}
			for (var i in result){
				for (var j = 2001; j <= 2018 ; j++){
					if (result[i]['_id'] == j.toString())
						UserNumber[j-2001]['numOfEdits'] += result[i]['numOfEdits']
				}
			}
			//convert data to google char format
			var chart = new Array()
			for (var year = 2001 ; year <= 2018 ; year ++){
				chart.push({Year:year.toString(),
							Administrator:AdminNumber[year-2001]['numOfEdits'],
							Anonymous:AnonNumber[year-2001]['numOfEdits'],
							Bot:BotNumber[year-2001]['numOfEdits'],
							Regular_user:UserNumber[year-2001]['numOfEdits']})
			}
			console.log('Overall chart data added to /chartData successfully!')
			res.json(chart)
		}
	})
});

// Add usertype attribute to revisions
// 1. convert admin.txt/bot.txt content to array
var adminArray = new Array()
var botArray = new Array()
var admins = fs.createReadStream('admin.txt');
var bots = fs.createReadStream('bot.txt')
function txtToArray(txt,array) {
    var remainingData = '';
    txt.on('data', function(data) {
        remainingData += data;
        if (remainingData.charAt(remainingData.length-1) != '\n'){
            remainingData+='\n'
        }
        //console.log(remainingData);
        var index = remainingData.indexOf('\n');
        //console.log(index);
        while (index > -1) {
            var line = remainingData.substring(0, index);
            // new remainingData = remainingData - line
            remainingData = remainingData.substring(index + 1);
            array.push(line);
            index = remainingData.indexOf('\n');
        }
        //console.log(array.length)
    });
}
// 2. run the txt to array function
txtToArray(bots,botArray);
txtToArray(admins,adminArray);

router.get('/addUserType',(req,res,next) =>{
	//console.log(botArray)
    revision.addUserType(botArray, 'bot',function (err) {
		if (err!=0){
			console.log('addBot error in overall router')
		}
		else {
            console.log("Have added {userType:'bot'} to "+botArray.length +" bots")
		}
    });
    next();
});

router.get('/addUserType',(req,res,next) =>{
    revision.addUserType(adminArray, 'admin',function (err) {
		if (err!=0){
			console.log('addAdmin error in overall router')
		}
		else {
			console.log("Have added {userType:'admin'} to "+adminArray.length +" admins")
		}
    });
});

module.exports = router;


