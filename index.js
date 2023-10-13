let addRowButton = document.querySelector('#insert-row-btn');
let textArea = document.querySelector('#text-area');
let submitQueryButton = document.querySelector('#submit-query-btn');
const xhttp = new XMLHttpRequest();


addRowButton.addEventListener('click', function() {
  let query = "?dbquery=INSERT INTO Patient (Name, DateOfBirth) VALUES ('Sara Brown', '1901-01-01'), ('John Smith', '1941-01-01'), ('Jack Ma', '1961-01-30'), ('Elon Musk', '1999-01-01')";

  xhttp.open("POST", "http://localhost:5000/COMP4537/labs/5/api/v1/sql/", true);
  xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhttp.send(query);

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      textArea.value = this.responseText;
    }
  };

});

submitQueryButton.addEventListener('click', function() {
  console.log("submit query button clicked");
});