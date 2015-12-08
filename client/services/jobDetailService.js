
app.service('jobDetailService', function () {

  // this is already formatted
  this.craigslist = [];

  this.dice = [];
  this.dice.before = [];
  // this is formatted set in formatDice
  // this.dice.formatted

  this.indeed = [];

  this.myJobs = [];

  this.allJobs = []

  // this.setJobs = function (array) {
  //   var self = this;
  //   console.log(array, ' array in setJobs')
  //   for (var i = 0; i <)
  // };

  return {
    craigslist: this.craigslist,
    dice: this.dice,
    indeed: this.indeed,
    allJobs: this.allJobs,
    setJobs: this.setJobs
  };

});
