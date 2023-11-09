const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();


app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please include the private app access token in your repo BUT only an access token built in a TEST ACCOUNT. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const cobjID = "2-18518517"

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
app.get('/', async (req, res) => {
    const cobj = `https://api.hubapi.com/crm/v3/objects/${cobjID}?properties=clue_name&properties=location&properties=clue_description&limit=50`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(cobj, { headers });
        const data = resp.data.results;
        res.render('clues', { title: 'Clues | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here
app.get('/updates', async (req, res) => {
    try {
        res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum.' });      
    } catch (error) {
        console.error(error);
    }
});


// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here

app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "clue_name": req.body.clue_name,
            "location": req.body.location,
            "clue_description": req.body.clue_description
        }
    }

    const updateClue = `https://api.hubapi.com/crm/v3/objects/${cobjID}/`; 
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.post(updateClue, update, { headers } );
        res.redirect('/');
    } catch(err) {
        console.error(err);
        res.status(500).send(err)
    }

});


app.listen(3001, () => console.log('Listening on http://localhost:3001'));