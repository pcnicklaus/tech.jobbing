
app.service('jobDetailService', function () {

  this.craigslist = [];
  this.dice = [];
  this.indeed = [];

  return {
    craigslist: this.craigslist,
    dice: this.dice
  };

});
