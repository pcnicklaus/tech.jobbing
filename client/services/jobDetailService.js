
app.service('jobDetailService', function () {

  // this is already formatted
  this.craigslist = [];

  this.dice = [];
  this.dice.before = [];
  // this is formatted set in formatDice
  // this.dice.formatted

  this.indeed = [];

  this.myJobs = [];

  return {
    craigslist: this.craigslist,
    dice: this.dice,
    indeed: this.indeed
  };

});
