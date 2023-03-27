
const messages = document.getElementById("target"); 
document.getElementById('load-data').addEventListener('click', loadGuestbookData);

function loadGuestbookData() {

    const xhttp = new XMLHttpRequest(); // luodaan XMLHttpRequest olio
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        messages.innerHTML = this.responseText; // vastauksena saatava HTML table asetetaan div -elementtiin. Lähde: https://www.w3schools.com/xml/ajax_xmlhttprequest_response.asp
        
      }
    };
    xhttp.open("GET", "/messages", true);  
    xhttp.send(); 

    } 

// ajaxmessage:


//const messageForm = document.getElementById('message-form');

let element = document.getElementById('submitBtn');
if (element) {
  element.addEventListener('click', newAjaxmessage)
}


//document.getElementById('submitBtn').addEventListener('click', newAjaxmessage); 

function newAjaxmessage() {
  
    const username = document.getElementById('username').value; //tallennetaan kenttien arvot muuttujiin
    const country = document.getElementById('country').value;
    const message = document.getElementById('message').value;
    
  
    const isValid = checkInputs(); // tyhjien kenttien tarkistus
    
    if (isValid) { // jos checkInputs palauttaa arvon "true", suoritetaan if-lause
      const xhr = new XMLHttpRequest(); // luodaan XMLHTTPRequest olio
  
      xhr.open('POST', '/ajaxmessage'); // POST -pyyntö reittiin /ajaxmessage
      xhr.setRequestHeader('Content-Type', 'application/json'); // Määritellään HTTP pyynnössä lähetettävän datan tyyppi: application/json, referenssi: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON
  
      xhr.onload = function() {
        if (xhr.status === 200) {
          const messages = JSON.parse(xhr.responseText);
          const ajaxmesages = document.getElementById('ajaxmessages');
  
          ajaxmesages.innerHTML = '';
  
          messages.forEach(function(message) {
            const messageElement = document.createElement('div');
            messageElement.setAttribute('id', 'ajaxmessages2');
            messageElement.innerText = message.username + ' from ' + message.country + ': ' + message.message;
            ajaxmesages.appendChild(messageElement);
  
          });
        } else {
          console.error(xhr.statusText);
        }
      };
  
      xhr.send(JSON.stringify({ username: username, country: country, message: message }));
  
        document.getElementById('username').value = ''; // tyhjennetään kentät
        document.getElementById('country').value = '';
        document.getElementById('message').value = '';
  
  ;
    }
  
  };
  
  function checkInputs() {
  
    const inputElements = [
      document.getElementById('username'),
      document.getElementById('country'),
      document.getElementById('message')
    ];
    
    let isValid = true;
  
    for (let i = 0; i < inputElements.length; i++) {
      const inputElement = inputElements[i];
      
      if (!inputElement.value) { // Check if the input field is empty
        inputElement.style.borderColor = 'rgb(255, 115, 138)';
        isValid = false;
      } else {
        inputElement.style.borderColor = 'black';
      }
    }
    
    if (!isValid) {
      document.getElementById('error').innerHTML = "Please fill in all the fields";
    } else {
      document.getElementById('error').innerHTML = "";
    }
    
    return isValid;
  }
  