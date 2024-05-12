//HTML ELEMENTS

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const teamList = document.getElementById('teamLIST');
const idInput = document.getElementById('textInput');
const colorPicker = document.getElementById('pixelColor');
const progressBar = document.getElementById("timeLeft");
const serveur = "https://pixel-api.codenestedu.fr";
const chooseTeamButton = document.getElementById("teamBTN");
const logText = document.getElementById("log-text");
const table = document.getElementById("stats");


//=======================================================
//API CALLS 

//GET THE TAB
const getTab = () => {
  
  fetch(`${serveur}/tableau`)
  .then(response => {
    if (!response.ok) {
      return response.json().then(data => {
        throw new Error(data.error);
      });
    }
    return response.json();
  })

  .then(data => {
    //fills the canvas with the data
    for (let i = 0; i<data.length; i++){
      for (let j = 0; j<data[i].length; j++){
        ctx.fillStyle = data[i][j];
        ctx.fillRect(j*5, i*5, 50, 50);
      }
    }
  })

  .catch(error => {
    console.error('Erreur lors de la récupération du tableau :', error);
  });
}

//GET THE TIME LEFT
const getTimeLeft = async () => {
  fetch(`${serveur}/temps-attente?uid=${idInput.value}`)
    .then(response => {
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(data.error);
        });
      }
      return  response.json();
    })
    .then(data => {
      setTimeout(function(){
        //starts the countdown
        countDown(data["tempsAttente"]);
      }, 100);  

    })
    .catch(error => {
      console.error('Erreur lors de la récupération du temps restant :', error);
    });
}

//GET THE LAST PLAYERS
export const getLastPlayers = () => {
  
  fetch(`${serveur}/liste-joueurs?uid=8c3d6b9a`)
  .then(response => {
    if (!response.ok) {
      return response.json().then(data => {
        throw new Error(data.error);
      });
    }
    return response.json();
  })

  .then(data => {
    //Clears the table before filling it again...
    clearTable(table);

    data.forEach( (player) => {
      //gets and parses the raw data to show it in the table
      const date = new Date(player.lastModificationPixel);
      const now = new Date();
      const diff = ((now.getTime()-date.getTime())/1000)
      addRow(player.nom,player.equipe,player.banned,Math.trunc(diff),player.nbPixelsModifies);
    });
  })

  .catch(error => {
    console.error('Erreur lors de la récupération des joueurs :', error);
  });
}

//CHOOSE A TEAM
const chooseTeam = () => {

  const formData = {
  uid: idInput.value,
  nouvelleEquipe: parseInt(teamList.value)
  };

  fetch(`${serveur}/choisir-equipe`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    
    body: JSON.stringify(formData)
})
  .then(response => {
      if (!response.ok) {
        return response.json().then(data => {
          //changes the log text to show the error
          logText.innerHTML = data["msg"];
          logText.style.backgroundColor = "red";
          throw new Error(data.error);
      });
    }

    return response.json();
})
  .then(data => {
      //changes the log text to show the success
      logText.innerHTML = data["msg"];
      logText.style.backgroundColor = "green";
      getTimeLeft()

  })
  .catch(error => {
      console.log('Erreur lors du changement d\'équipe ', error);
  });
};

//SEND A PIXEL
 const sendPixel = async (x,y) => {
  const formData = {
    uid: idInput.value,
    col: x,
    row: y,
    color: colorPicker.value
  };

  fetch(`${serveur}/modifier-case`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
})
  .then(response => {
      //si le serveur a répondu une erreur
      if (!response.ok) {
        return response.json().then(data => {

          console.log(data);
          logText.innerHTML = data["msg"];
          logText.style.backgroundColor = "red";
          throw new Error(data["msg"]);
      });
    }
    return response.json();
})
  .then(data => {
      logText.innerHTML = data["msg"];
      logText.style.backgroundColor = "green";
      getTimeLeft();

  })
  .catch(error => {
      console.log('Erreur lors de l\' envoi du pixel : ', error);
  });


};

//=======================================================
//DOM MANIPULATION

//CLEAR THE TABLE 
const  clearTable = (table)  => {
  var rows = table.rows;
  var i = rows.length;
  while (--i) {
    rows[i].parentNode.removeChild(rows[i]);
    // or
    // table.deleteRow(i);
  }
}

//ADD A ROW TO THE TABLE
const  addRow = (name,team,bann,temps,pixels) => {
  // adds a row under the first row (header)
  var newLine = table.insertRow(-1);

  //adds cells to the row (order is important)
  var pixCell = newLine.insertCell(0);
  var timeCell = newLine.insertCell(0);
  var banCell = newLine.insertCell(0);
  var teamCell = newLine.insertCell(0);
  var nameCell = newLine.insertCell(0);
  
  // fills the cells with the data
  var textNote = document.createTextNode(name);
  var teamNode = document.createTextNode(team);
  let banNode = document.createTextNode(bann);
  let timeNode = document.createTextNode(temps);
  let pixNode = document.createTextNode(pixels);

  //appends the data to the cells
  banCell.appendChild(banNode);
  timeCell.appendChild(timeNode);
  pixCell.appendChild(pixNode);
  teamCell.appendChild(teamNode);
  nameCell.appendChild(textNote);
}

//GET THE CURSOR POSITION
function getCursorPosition(canvas, event) {
  //a bit groofy but it looks like it works very well
  const rect = canvas.getBoundingClientRect()
  const xPos = event.clientX - rect.left
  const yPos = event.clientY - rect.top
  const xScale = Math.floor(xPos/5)
  const yScale =  Math.floor(yPos/5)

  return [xScale,yScale]
}

//COUNTDOWN FUNCTION
function countDown(sec) {
  var timeleft = sec;
//gets the time left and starts the countdown
  var downloadTimer = setInterval(function(){
    if(timeleft <= 0){
      clearInterval(downloadTimer);
    }
    progressBar.value = 15000 - timeleft;
    timeleft -= 100;
  }, 100);
}

//=======================================================
//EVENT LISTENERS

chooseTeamButton.addEventListener("click", () => {
  chooseTeam();
});

canvas.addEventListener('mousedown', async (e) => {
  let pos = getCursorPosition(canvas, e)
  await sendPixel(pos[0], pos[1]);

  setTimeout(function(){
    getTab();
  }, 100);  
})

//=======================================================


window.onload = getTab;
setInterval(getTab, 1000);
setInterval(getLastPlayers, 1000);