const express = require('express');
const ejs = require('ejs');
const axios = require("axios");
const app = express();
var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keyjeMS3U62hP7wfU'}).base('appDgNueeMhu1uIpy');



app.use(express.static('public'));
app.set('view engine', 'ejs');


app.get('/', function (req, res) {
    res.render('pages/index');
});

app.get('/builds', function (req, res) {
   
    res.render('pages/builds');
});

app.get('/hacks', function (req, res) {
    res.render('pages/hackz');
});

app.get('/launches', function async (req, res) {
    const projects = []
     base('Processed').select({
    // Selecting the first 3 records in Grid view:
        maxRecords: 10,
        view: "Grid view",
        fields : ['project_name', 'project_desc', 'cover_url', 'project_url']
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.

        records.forEach(function(record) {
            console.log('Retrieved');
            
            const name = record.get('project_name')
            console.log(name);
            const desc = record.get('project_desc')
            console.log(desc);
            const url = record.get('project_url')
            console.log(url);
            const cover = record.get('cover_url')
            console.log(cover);

            const project = {
                name : name, 
                desc : desc, 
                url : url, 
                cover : cover
            }

            projects.push(project)

        });

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();

    }, function done(err) {
        res.render('pages/launches', {projects});

        if (err) { console.error(err); return; }
    });
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on ${port}, http://localhost:${port}`));
