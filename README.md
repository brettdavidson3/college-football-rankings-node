# college-football-rankings-node
An alternate way of ranking college football teams

The idea of this project is to create a college football ranking system that is entirely objective, in the same way the computers were used in the original BCS formula.

The current ranking system for college football relies on the opinion of a selection committee, which is subject to the unavoidable biases of the individual members of the committee.
I would like to prove that an objective system can work by producing weekly rankings and comparing them to the committee's.  Hopefully by the end of the season this ranking system will prove to be more accurate.

## Requirements

You will need [node](http://nodejs.org/) and [grunt](http://gruntjs.com/getting-started) to run the data setup and (eventually) the web application.

## The Dataset

Special thanks to [NCAA savant](http://ncaasavant.com/about.php) for providing the source data for this project.

## Number Crunching

The first step in setting up the application is generating the poll results for each week.  This is done by calling:
```
grunt import
```
Currently this will just output the results to your console, but it will eventually be exported as it's own json file for consumption.
