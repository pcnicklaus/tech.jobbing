var path      = require('path');
var express   = require('express');
var router    = express.Router();
var cheerio   = require('cheerio');
var request   = require('request');

router.get('/scrape', function(req, res, next) {
    // var newDater = new Dater({
    //   location: req.body.location
    // });
      var city = req.body.city;
      var title = req.body.title;


    url = 'https://'+ city + '.craigslist.org/search/jjj?sort=date&query=web%20developer';

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

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
            console.log(jobs);
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
        console.log(jobDetail);
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

    // url = "http://service.dice.com/api/rest/jobsearch/v1/simple.json?text=javascript,node&city=80205&sort=1";
    url = "http://service.dice.com/api/rest/jobsearch/v1/simple.json?text=javascript&city=Denver,+CO&sort=1";

       console.log(req.body);
       // var searchString = req.body.toTranslate;
       // console.log(searchString);
       request(url, function (error, data) {
         if (!error && res.statusCode == 200) {
           var diceData = data.body;
           console.log(diceData);
           res.send(diceData);
         }
    });
});

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
