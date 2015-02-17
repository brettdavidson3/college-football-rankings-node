var Converter = require('csvtojson').core.Converter;
var fs = require('fs');
var _ = require('lodash');
var moment = require('moment');

module.exports = function(grunt) {
    grunt.registerTask('import', 'Imports the football scores from build/scores.csv and converts them to json in target/scores.json', function() {
        importData(this.async());
    });
}

var firstWeekEnd = null;

var importData = function(done) {
    console.log('Importing data from scores.csv.  This will take a minute...');

    var fileStream = fs.createReadStream('./build/scores_small.csv');
    var converter = new Converter({constructResult:true});

    converter.on('end_parsed', function(output) {
        console.log('Data import finished!');
        runStatistics(output, done);
        done();
    });

    fileStream.pipe(converter);
}

var runStatistics = function(plays, done) {
    console.log('Running statistics on data...');
    var outcomes = determineOutcomes(plays);
    console.log(outcomes);
    var records = determineRecords(outcomes);
    console.log(records);
}

var determineOutcomes = function(plays) {
    console.log('Determining the outcomes of each game...');
    var days = _.groupBy(plays, function(play) {
        return play.gameDate;
    });

    var weeks = {};
    _.forEach(days, function(plays) {
        var games = _.groupBy(plays, function(play) {
            return play.homeTeamCode;
        });

        _.forEach(games, function(plays) {
            var weekNumber = getWeekNumber(weeks, plays[0]);
            weeks[weekNumber].push(determineOutcome(plays));
        })
    });

    return weeks;
}

var getWeekNumber = function(weeks, play) {
    var gameDate = moment(play.gameDate);
    var number = 1;
    if (!firstWeekEnd) {
        firstWeekEnd = gameDate.day(7);
    } else {
        var currentWeekEnd = firstWeekEnd.clone();

        do {
            number++;
            currentWeekEnd.add(7, 'days');
        } while (gameDate.isAfter(currentWeekEnd));
    }

    if (!weeks[number]) {
        weeks[number] = [];
    }

    return number;
}

var determineOutcome = function(plays) {
    var winner,
        loser,
        firstPlay = plays[0];
    var homeScore = _.max(_.pluck(plays, 'homeScore'));
    var awayScore = _.max(_.pluck(plays, 'visitorScore'));

    if (homeScore > awayScore) {
        return  {
            winner: firstPlay.homeTeamCode,
            loser: firstPlay.awayTeamCode
        }
    }

    if (homeScore == awayScore) {
        throw new Error('Could not determine outcome, scores were the same!');
    }

    return {
        winner: firstPlay.awayTeamCode,
        loser: firstPlay.homeTeamCode
    }
}

var determineRecords = function(outcomesByWeek) {
    console.log('Determining the records for each team...')
    var teams = {};
    _.forEach(outcomesByWeek, function(outcomes) {
        _.forEach(outcomes, function(outcome) {
            addOutcomeForTeam(teams, outcome.winner, 'win');
            addOutcomeForTeam(teams, outcome.loser, 'loss');
        });
    });
    return teams;
}

var addOutcomeForTeam = function(teams, teamName, outcome) {
    if (!teams[teamName]) {
        teams[teamName] = {
            win: 0,
            loss: 0
        };
    }

    teams[teamName][outcome]++;
}
