const INVALID_QUERY = "Invalid query";

const responseP = document.querySelector('#response');
const addRowButton = document.querySelector('#insert-row-btn');
const textArea = document.querySelector('#text-area');
const submitQueryButton = document.querySelector('#submit-query-btn');
const xhttp = new XMLHttpRequest();


addRowButton.addEventListener('click', function() {
  let query = "?dbquery=INSERT INTO Patient (Name, DateOfBirth) VALUES ('Sara Brown', '1901-01-01'), ('John Smith', '1941-01-01'), ('Jack Ma', '1961-01-30'), ('Elon Musk', '1999-01-01')";

  xhttp.open("POST", "http://localhost:5000/COMP4537/labs/5/api/v1/sql/", true);
  xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhttp.send(query);

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      textArea.value = this.responseText.message;
    }
  };

});

submitQueryButton.addEventListener('click', function() {

  const query = textArea.value;
  const firstWord = query.split(' ')[0];

  console.log(query);

  if (firstWord.toUpperCase() === 'SELECT') {
    xhttp.open("GET", "http://localhost:5000/COMP4537/labs/5/api/v1/sql/?dbquery=" + query, true);
    xhttp.send();
  } else if (firstWord.toUpperCase() === 'INSERT') {
    xhttp.open("POST", "http://localhost:5000/COMP4537/labs/5/api/v1/sql/", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send("?dbquery=" + query);
  } else {
    responseP.textContent = INVALID_QUERY;
    responseP.style.color = "red";
  }

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let response = JSON.parse(this.responseText);
      responseP.textContent = response.message;
    }
  };


});