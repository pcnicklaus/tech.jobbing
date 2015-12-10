var path      = require('path');
var express   = require('express');
var router    = express.Router();
var cheerio   = require('cheerio');
var request   = require('request');
var User      = require('../models/users.js');
var nodemailer = require('nodemailer');
require('dotenv').load();

var config    = require('../../_config.js');

router.post('/mail', function (req, res, next) {

    // console.log(' req.body.title   ', req.body.title[0].description)
    var text = req.body.jobs;
    var email = JSON.stringify(req.body.email);

    var emailMessage = '';
    for (var i = 0; i < text.length; i++) {
      emailMessage += '<br> Title:' + text[i].title + '<br> Description:' + text[i].description + '<br>Link:' + text[i].url + '<br>';
    }
    // create reusable transporter object using SMTP transport
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'techjobbing@gmail.com',
            pass: process.env.GOOGLE
        }
    });

      var mailOptions = {
        from: 'Patrick ✔ <techjobbing@gmail.com>', // sender address
        to: email, // list of receivers
        subject: 'Your Jobs ✔', // Subject line
        text: emailMessage, // plaintext body
        html: '<b>' + emailMessage + ' ✔</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });

});

router.post('/analyze', function(req, res){
  // console.log(req.params, "REQ")
  var description = req.body.description;
  var cleaned = description.replace(/"/g, '');
  var cleaned2 = cleaned.replace('/', '');
  console.log("descript req.body", cleaned)
  request({
    method: 'POST',
    url: 'http://gateway-a.watsonplatform.net/calls/text/TextGetRankedKeywords?text='+cleaned2+'&apikey=' + process.env.ALCHEMY + '&outputMode=json&sentiment=1&showSourceText=1'
  }, function(err, response){
    if(err){
      console.log('err', err);
      res.json(err);
    } else {

      var result = JSON.parse(response.body).keywords;
      // console.log(response.body);
      // console.log(response.body.status, "STATUS");
      console.log(result, "RESULT");
      res.json(result);
      // res.render('index', {keywords: result[0].text});
      // res.send(result);

    }
  });
});





router.post('/scrape', function(req, res, next) {
    // var newDater = new Dater({
    //   location: req.body.location
    // });
    console.log('here 877887')
      var city = req.body.city;
      var keyword = req.body.keyword;

    console.log(req.body);
    // https://denver.craigslist.org/search/sof?query=javascript
    url = 'https://'+ city + '.craigslist.org/search/jjj?sort=date&query=' + keyword;
    console.log(url);
    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);
            console.log('here 2');
            var title;
            var link;
            var holder;
            var jobs = [];

            $('a.hdrlnk').filter(function(){
                var data = $(this);
                // console.log(data, data.attr('href'));
                title = data.text();
                link = data.attr('href');
                holder = title + ' ' + link;
                jobs.push(holder);
            });
            // console.log(jobs);
            res.send(jobs);
        }
    });
});

router.post('/detail', function(req, res, next) {

    url = req.body.url;
    console.log(url)

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            var jobDetail = {
                    title: '',
                    description: '',
                    compensation: '',
                    url: url
                };

            $('span.postingtitletext').filter(function(){
                var data = $(this);
                jobDetail.title = data.text();
            });

            $('#postingbody').filter(function () {
                var data = $(this);
                jobDetail.description = data.text();
            });

            $('p.attrgroup').filter(function() {
                var data = $(this);
                jobDetail.compensation = data.children().first().text();
            });
            // res.send(jobs);
        }
        // console.log(jobDetail);
        res.send(jobDetail);
    });
});

router.post('/glassdoor', function(req, res, next) {


    var url = "http://api.glassdoor.com/api/api.htm?t.p=49627&t.k=h7qO3cGBOJ1&userip=127.0.0.1&useragent=&format=json&v=1&action=jobs-stats&city=denver&jt=developer&returnJobTitles=true&q=developer&minRating=3&admLevelRequested=1";

    $http.get(url)
        .success(function () {
            console.log(response);
        })
        .error(function () {
            console.log(error);
        });

});

router.post('/dice', function(req, res, next) {

    var city = req.body.cityState;
    var keyword = req.body.keyword;

    url = "http://service.dice.com/api/rest/jobsearch/v1/simple.json?text=" + keyword + "&city=" + city + "sort=1";

       console.log(req.body, url);

         request(url, function (error, data) {
           if (!error && res.statusCode == 200) {
             var diceData = data.body;
             console.log(diceData);
             res.send(diceData);
           }
      });
});

router.post('/dice-detail', function (req, res, next) {

  url = req.body.url;
  location = req.body.location;

  request(url, function(error, response, html){
      if(!error){
          var $ = cheerio.load(html);

          var jobDetail = {
                  title: '',
                  description: '',
                  compensation: '',
                  company: '',
                  location: location,
                  url: url
              };

          $('#jt').filter(function(){
              var data = $(this);
              jobDetail.title = data.text();
          });

          $('#jobdescSec').filter(function () {
              var data = $(this);
              jobDetail.description = data.text();
          });

          $('.ml20').filter(function () {
              var data = $(this);
              // this is actually compensation and telecommuting type thing...
              jobDetail.compensation = data.text();
          });

          // $('p.attrgroup').filter(function() {
          //     var data = $(this);
          //     jobDetail.compensation = data.children().first().text();
          // });
          // res.send(jobs);
      }
      console.log(jobDetail);
      res.send(jobDetail);
  });

});

router.post('/indeed', function(req, res, next) {

    var keyword = req.body.keyword;
    var city    = req.body.city;
    var state   = req.body.state;


    url = "http://api.indeed.com/ads/apisearch?publisher=2880064796047261&format=json&q=" + keyword + "&l=" + city + "%2C+" + state + "&sort=date&radius=&st=employer&jt=fulltime&start=&limit=30&fromage=10&filter=&latlong=1&co=us&chnl=&userip=127.0.0.1&useragent=Mozilla/%2F4.0%28Firefox%29&v=2";

    console.log(req.body);
    console.log(url);

    request(url, function (error, data) {
        if (!error && res.statusCode == 200) {
          var indeedData = data.body
          console.log(indeedData);
          res.send(indeedData);
        }
    });

});

router.post('/indeed-detail', function (req, res, next) {

  url = req.body.url;

  request(url, function(error, response, html){
      if(!error){
          var $ = cheerio.load(html);

          var jobDetail = {
                  description: '',
                  url: url
              };

          $('#job_summary').filter(function () {
              var data = $(this);
              jobDetail.description = data.text();
          });

      }
      console.log(jobDetail, ' job detail');
      res.send(jobDetail);
  });

});

// router.put('/:id', function (req, res, next) {
//   var update = req.body;
//   Dater.findByIdAndUpdateQ(req.params.id, update)
//     .then(function (result) {
//       // console.log(result);
//       res.json(result);
//     })
//     .catch(function (err) {
//       // console.log(result);
//       res.json(result);
//     })
//     .done();
// });

// router.post('/trendyskills', function(req, res, next) {

//     // publisher id = 2880064796047261
//     // url = "http://service.dice.com/api/rest/jobsearch/v1/simple.json?text=javascript,node&city=80205&sort=1";
//     url = "http://trendyskills.com/?q=keywordDate&keyID[]=915&keyID[]=691&dateFrom=2013/02/17&dateTo=2013/02/24&filterAmbiguous=true&showAmbiguous=";

//       console.log(req.body);
//       // var searchString = req.body.toTranslate;
//       // console.log(searchString);
//       request(url, function (error, data) {
//         if (!error && res.statusCode == 200) {
//           var indeedData = data.body
//           console.log(indeedData);
//           res.send(indeedData);
//         }
//       });

// });
// graphing
// http://trendyskills.com/?q=keywordDate&keyID[]=915&keyID[]=691&dateFrom=2013/02/17&dateTo=2013/02/24&filterAmbiguous=true&showAmbiguous=
// http://trendyskills.com/ = trending frameworks

// http://rss.careerjet.co.uk/rss?s=developer%20javascript%20junior&l=Denver&lid=8071&psz=50&snl=100

module.exports = router;
