const express = require('express'); // ladataan moduuli
const fs = require('fs');
const bodyParser = require("body-parser"); // haetaan body-parser moduuli JSON -tiedostojen lukua varten.
//const pure = require('purecss'); //pure.css

const app = express(); // funktio tallennetaan muuttujaan app
const port = process.env.PORT || 3000;

app.use(express.json());
  
app.use(
    bodyParser.urlencoded({
      extended: true
    })
  ); 

//----------------------------------------------------------------------------------------------------------------------
// Reitti "/": hakee public kansiosta staattisen HTML-sivun
//----------------------------------------------------------------------------------------------------------------------

app.use(express.static("./public")); 

//----------------------------------------------------------------------------------------------------------------------
// guestbook -reitti, taulukon parsiminen ja tyylittely Pure.css:llä
//----------------------------------------------------------------------------------------------------------------------

app.get('/guestbook', (req, res) => {
  
    fs.readFile('./data/messagedata.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error reading messages file');
      }
      
      const messages = JSON.parse(data); //taulukon parsiminen ja tyylittely Pure.css:llä: https://purecss.io/tables/

        //Luodaan ensin muuttuja, johon tallennetaan HTML-sivun alku body -osioon asti
        let base =`<!DOCTYPE html> 
                  <html lang="en">
                  <head>
                      <meta charset="UTF-8">
                      <meta http-equiv="X-UA-Compatible" content="IE=edge">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/purecss@3.0.0/build/pure-min.css"> 
                      <title>Guestbook</title>
                  </head>
                        <body>
                            <style>
                            body {
                              margin-left: 50px;
                              }
                          </style>
              <br> <h2>Pure.css:llä tyylitelty taulukko</h2>`;
        
        //muuttuja, johon tallennetaan HTML -sivun lopputagit
        let baseEnd = `</body>
            </html>`;
  
        let table = '<table class="pure-table pure-table-horizontal">'; //luodaan html -taulukko
        table += '<tbody>';
        table += '<thead style="background-color: #E6F285"><tr><th>Date</th><th>Name</th><th>Message</th></tr></thead>';
    
        messages.forEach(function(message) { // viestit käydään läpi
  
          var dateString = message.date; // huolitellaan päivämäärä esityskelpoisempaan muotoon
          const date = new Date(dateString);
  
          const year = date.getFullYear();
          const month = date.getMonth() + 1; // lisätään 1 kuukausiin, koska tammikuu on 0
          const day = date.getDate();
          const formattedDate = `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year}`;
          
          table += '<tr>';
          table += '<td>'+ formattedDate + '</td>';
          table += '<td>'+ message.username +'</td>';
          table += '<td>'+ message.message +'</td>';
          table += '</tr>';
  
        });
        table += '</tbody>';
        table += '</table>';
        
        res.send(base + table + baseEnd); 
      });
  });
  

//----------------------------------------------------------------------------------------------------------------------
//  app.post /newmessages -reitti tallentaa newmessage.html sivun formista tiedot json -fileen
//----------------------------------------------------------------------------------------------------------------------
app.get('/newmessage', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'newmessage.html');
  res.sendFile(filePath);
});

app.post("/newmessage", function (req, res) {
    var data = require("./data/messagedata.json");
    
    var newData = {
      username: req.body.username,
      country: req.body.usercountry,
      message: req.body.usermessage,
      date: new Date()
    };
    
    // tarkistetaan, onko data originaalia
    var originalData = data.some(function (item) {
      return item.username === newData.username &&
             item.country === newData.country &&
             item.message === newData.message;
    });
    
    if (!originalData) {//jos arvo on originaali, lisätään fileen. 
      data.push(newData);
    
      var jsonStr = JSON.stringify(data);
    
      fs.writeFile("./data/messagedata.json", jsonStr, err => { 
        if (err) throw err;
      
        
      });
    }
    
    res.sendFile(__dirname + "/public/newmessage.html");
    });

//----------------------------------------------------------------------------------------------------------------------
//  messages -reitti hakee viestit ja lähettää paluuarvona taulukon, jota client -puolen javascript hyödyntää 
//----------------------------------------------------------------------------------------------------------------------

app.get('/messages', (req, res) => {
  
    fs.readFile('./data/messagedata.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error reading messages file');
      }
      
      const messages = JSON.parse(data);
        let table = '<p>You can find the pure.css /guestbook route <a id="textLink" href="/guestbook">here</a> <table>'; //luodaan html -taulukko
  
        table += '<tbody>';
    
        messages.forEach(function(message) { // viestit käydään läpi
  
          var dateString = message.date; // huolitellaan päivämäärä esityskelpoisempaan muotoon
          const date = new Date(dateString);
  
          const year = date.getFullYear();
          const month = date.getMonth() + 1; // lisätään 1 kuukausiin, koska tammikuu on 0
          const day = date.getDate();
          const formattedDate = `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year}`;
  
        table += '<tr>';
          table += '<td>' + message.username + " from " + message.country + '</td>' 
          table +='<td id="userdate">' + formattedDate + '</td>'
          table += '</tr>';
          table +='<tr>';
          table += '<td id="userMessage">' + message.message + '</td>';
          table += '</tr>'
          
        });
        table += '</tbody>';
        table += '</table>';
        
        res.send(table);
      });
  
      
  });


//----------------------------------------------------------------------------------------------------------------------
// /ajaxmessage
//----------------------------------------------------------------------------------------------------------------------

const path = require('path');

app.get('/ajaxmessage', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'ajaxmessage.html');
  res.sendFile(filePath);
});

  
app.post('/ajaxmessage', function(req, res) {

    const username = req.body.username;
    const country = req.body.country;
    const message = req.body.message;
  
    const data = {
      username: username,
      country: country,
      message: message
    };
  
    fs.readFile(path.join(__dirname, './data/data.json'), function(err, content) {
      if (err) {
        console.error(err);
        res.status(500).send('Internal server error');
      } else {
        let messages = JSON.parse(content.toString());
        messages.push(data);
  
        fs.writeFile(path.join(__dirname, './data/data.json'), JSON.stringify(messages), function(err) {
          if (err) {
            console.error(err);
            res.status(500).send('Internal server error');
          } else {
            res.json(messages);
          }
        });
      }
    });
  });


//----------------------------------------------------------------------------------------------------------------------
// Portti
//----------------------------------------------------------------------------------------------------------------------
app.listen(port, function() {
  console.log(`Server running on http://localhost:${port}`);
});