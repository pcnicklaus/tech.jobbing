var path      = require('path');
var express   = require('express');
var router    = express.Router();
var cheerio   = require('cheerio');
var request   = require('request');
var mongoose  = require('mongoose-q')(require('mongoose'));
var User      = require('../models/users');


router.post('/scrape', function(req, res, next) {
    // var newDater = new Dater({
    //   location: req.body.location
    // });

    url = 'https://denver.craigslist.org/search/jjj?sort=date&query=web%20developer';

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);
            var jobs = [];
            var jobDetail = {};
            var cheerioObject = $('a.hdrlnk');
            for (var i = 0; i < 2; i++) {
                var data = $(cheerioObject[i]);
                var jobURL = 'https://denver.craigslist.org' + data.attr('href');
                request(jobURL, function(err, res, pageHtml){
                    if(!err){
                        console.log(jobURL);
                        $ = cheerio.load(pageHtml);
                        jobDetail.description  = $('#postingbody').text();
                        jobDetail.title = data.text();
                        jobDetail.url = jobURL;
                        console.log(jobDetail)
                        jobs.push(jobDetail);
                        jobDetail = {};
                        // jobDetail = {};
                        // console.log(jobs);
                        // res.send(jobs);
                    }
                });


                // var jobBody = getDetail(jobURL);
                // console.log( data.text())
                // jobDetail.title = data.text();
                // jobDetail.url = jobURL;

                // jobDetail.description = jobBody;
                // jobs.push(jobDetail);
            }

            // console.log(jobs);

            // $('a.hdrlnk').filter(function(){
            //     var data = $(this);
            //     // console.log(data, data.attr('href'));
            //     jobDetail.title = data.text();
            //     jobDetail.url = 'https://denver.craigslist.org' + data.attr('href');
            //     jobDetail.description = getDetail(jobDetail.url);
            //     jobs.push(jobDetail);

            // });
            // var limitedCraig = limitCraig(jobs);

            // console.log(limitedCraig, ' limited jobs');
            // res.send(jobs);
        }
    });
});

// function getDetail(link) {
//     var jobBody = request(link, function(error, response, html){
//         if(!error){
//             var $ = cheerio.load(html);
//             jobBody = $('#postingbody').text();
//             return jobBody;
//             // body
//             // for (var i = 0; i < 10; i++) {
//             //     console.log($('#postingbody').text())
//             //     // return $('#postingbody').text()[i];
//             // }
//             // return $('#postingbody').map(function (c) {
//             //     console.log('hi', c)
//             //     var data = $(this);
//             //     return data.text();
//             // });

//             // compensation
//             // $('p.attrgroup').filter(function() {
//             //     var data = $(this);
//             //     jobDetail.compensation = data.children().first().text();
//             // });
//             // res.send(jobs);
//         }
//         // console.log(jobDetail, ' in getDetail function');
//         // return jobDetail;
//     });
// }

router.post('/glassdoor', function(req, res, next) {


    var url = "http://api.glassdoor.com/api/api.htm?t.p=49627&t.k=h7qO3cGBOJ1&userip=127.0.0.1&useragent=&format=json&v=1&action=jobs-stats&city=denver&jt=developer&returnJobTitles=true&q=developer&minRating=3&admLevelRequested=1";


});

router.post('/dice', function(req, res, next) {

    var jobDetail = {};
    var jobs = [];
    // url = "http://service.dice.com/api/rest/jobsearch/v1/simple.json?text=javascript,node&city=80205&sort=1";
    url = "http://service.dice.com/api/rest/jobsearch/v1/simple.json?text=javascript&city=Denver,+CO&sort=1";

       console.log(req.body);
       // var searchString = req.body.toTranslate;
       // console.log(searchString);
       request(url, function (error, data) {
         if (!error && res.statusCode == 200) {
           var diceData = JSON.parse(data.body);
           var parsedDice = diceData.resultItemList;
           for (var i = 0; i < parsedDice.length; i++) {
                jobDetail.title = parsedDice[i].jobTitle;
                jobDetail.company = parsedDice[i].company;
                jobDetail.location = parsedDice[i].location;
                jobDetail.url = parsedDice[i].detailUrl;
                var url = parsedDice[i].detailUrl;
                jobDetail.description = diceScrape(url);
                jobs.push(jobDetail);
                       // console.log(jobDetail)

           }
           // console.log(jobs, ' jobs output');
         }
    });
});

// request(url, function(error, response, html){
//         if(!error){
//             var $ = cheerio.load(html);

function diceScrape (url) {
    request(url, function (error, response, html) {
            if (!error) {
                var $ = cheerio.load(html);
                var descrip;
                $('#jobdesc').filter(function(){
                    var data = $(this);
                    console.log(data, ' data')
                    descrip = data.text();
                    console.log(descrip);

                });

            }
        });
}

// var dice = diceScrape('http://www.dice.com/job/result/cybercod/MS2-12451184?src=19')
// console.log(dice, 'dice function ');


router.post('/indeed', function(req, res, next) {

    // publisher id = 2880064796047261
    // url = "http://service.dice.com/api/rest/jobsearch/v1/simple.json?text=javascript,node&city=80205&sort=1";
    url = "http://api.indeed.com/ads/apisearch?publisher=2880064796047261&format=json&q=javascript&l=denver%2C+co&sort=date&radius=&st=employer&jt=fulltime&start=&limit=30&fromage=10&filter=&latlong=1&co=us&chnl=&userip=127.0.0.1&useragent=Mozilla/%2F4.0%28Firefox%29&v=2";

      console.log(req.body);
      // var searchString = req.body.toTranslate;
      // console.log(searchString);
      request(url, function (error, data) {
        if (!error && res.statusCode == 200) {
          var indeedData = data.body
          console.log(indeedData);
          res.send(indeedData);
        }
      });

});

  // helper function to remove the "found more jobs near denver" links...
  var rawCraigData = [];
  var limitCraig = function (array) {
      for (var i = 0; i < 30; i ++) {
          rawCraigData.push(array[i]);
      }
      // console.log(rawCraigData, 'rawCraig')
      return rawCraigData;
  };

  // helper function that takes title and url frag & pushes them into array as a mapped object
  // var formatCraig = function () {
  //     for (var i = 0; i < 60; i ++) {
  //         // total length of each string. url is always 18 characters, soo...
  //         var title = rawCraigData[i].slice(0, (rawCraigData[i].length - 20));
  //         var urlFrag = rawCraigData[i].slice((rawCraigData[i].length - 20), rawCraigData[i].length);
  //         $scope.craigslistData.push({
  //             title: title,
  //             url: 'https://denver.craigslist.org' + urlFrag
  //         });
  //     }
  // };


module.exports = router;
