const INVALID_QUERY = "Invalid query";

const responseP = document.querySelector('#response');
const addRowButton = document.querySelector('#insert-row-btn');
const textArea = document.querySelector('#text-area');
const submitQueryButton = document.querySelector('#submit-query-btn');
const table = document.querySelector('#table');
const xhttp = new XMLHttpRequest();

addRowButton.addEventListener('click', function () {
  let query = "?dbquery=INSERT INTO Patient (Name, DateOfBirth) VALUES ('Sara Brown', '1901-01-01'), ('John Smith', '1941-01-01'), ('Jack Ma', '1961-01-30'), ('Elon Musk', '1999-01-01')";

  xhttp.open("POST", `http://nsinghsidhu12.com/COMP4537/labs/5/api/v1/sql/`, true);
  xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhttp.send(query);

  xhttp.onreadystatechange = function () {
    clearElements();
    if (this.readyState == 4 && this.status == 200) {
      console.log("response: " + this.responseText);
      responseP.textContent = JSON.parse(this.responseText).message;

    } else if (this.readyState == 4 && (this.status == 400 || this.status == 500)) {
      responseP.textContent = JSON.parse(this.responseText).message;
    }
  };

});

submitQueryButton.addEventListener('click', function () {
  const query = textArea.value;
  const firstWord = query.split(' ')[0];

  if (firstWord.toUpperCase() === 'SELECT') {
    xhttp.open("GET", `http://nsinghsidhu12.com/COMP4537/labs/5/api/v1/sql/?dbquery=` + query, true);
    xhttp.send();
  } else if (firstWord.toUpperCase() === 'INSERT') {
    xhttp.open("POST", `http://nsinghsidhu12.com/COMP4537/labs/5/api/v1/sql/`, true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send("?dbquery=" + query);
  } else {
    clearElements();
    responseP.textContent = INVALID_QUERY;
    responseP.style.color = "red";
  }

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let response = JSON.parse(this.responseText);
      const rows = response.result;
      clearElements();
      responseP.textContent = response.message;
      responseP.style.color = "green";
      if (rows) {
        createHTMLTable(rows);
      }
    } else if (this.readyState == 4 && (this.status == 400 || this.status == 500)) {
      clearElements();
      responseP.textContent = JSON.parse(this.responseText).message;
      responseP.style.color = "red";
    }
  };
});

function createHTMLTable(rows) {
  table.innerHTML = "";
  let tableHTML = "<tr>";
  for (let key in rows[0]) {
    tableHTML += "<th>" + key + "</th>";
  }
  tableHTML += "</tr>";

  for (let i = 0; i < rows.length; i++) {
    tableHTML += "<tr>";
    for (let key in rows[i]) {
      tableHTML += "<td>" + rows[i][key] + "</td>";
    }
    tableHTML += "</tr>";
  }

  table.innerHTML = tableHTML;
}

function clearElements() {
  responseP.textContent = "";
  table.innerHTML = "";
}