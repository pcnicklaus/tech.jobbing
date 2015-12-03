var path      = require('path');
var express   = require('express');
var router    = express.Router();
var cheerio   = require('cheerio');
var request   = require('request');

router.get('/scrape', function(req, res, next) {
    // var newDater = new Dater({
    //   username: req.body.username,
    //   gender: req.body.gender,
    //   age: req.body.age,
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
                // console.log(title, link, 'link');
                // link = data.parent().text();
                // console.log(link)
                // test = data.parent().parent().text
                // console.log(test)
                // title = data.children().first().text();

                // json.title = title;
            });
            console.log(jobs);
            res.send(jobs);
        }
    });
});

router.get('/detail', function (req, res, next) {

    var url = 'http:' +
})

module.exports = router;
