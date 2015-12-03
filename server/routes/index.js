var path      = require('path');
var express   = require('express');
var router    = express.Router();
var cheerio   = require('cheerio');
var request   = require('request');

router.get('/scrape', function(req, res, next) {
    // var newDater = new Dater({
    //   location: req.body.location
    // });

    url = 'https://denver.craigslist.org/search/jjj?sort=date&query=web%20developer';

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
        console.log(res.send(jobDetail));
    });
});

module.exports = router;
