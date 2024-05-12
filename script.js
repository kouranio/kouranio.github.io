let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');



let p = document.getElementById('players');
let teamList = document.getElementById('teamLIST');
let idInput = document.getElementById('textInput');
let colorPicker = document.getElementById('pixelColor');
let progressBar = document.getElementById("timeLeft");
const serveur = "https://pixel-api.codenestedu.fr";
//const sendButton = document.getElementById("sendBTN");
//const updateButton = document.getElementById("updateBTN");
const playersButton = document.getElementById("playersBTN");
const chooseTeamButton = document.getElementById("teamBTN");
const logText = document.getElementById("log-text");


var table = document.getElementById("stats");

//GET THE TAB
const getTab = () => {
  
  fetch(`https://pixel-api.codenestedu.fr/tableau`)
  .then(response => {
    if (!response.ok) {
      return response.json().then(data => {
        throw new Error(data.error);
      });
    }
    return response.json();
  })

  .then(data => {
    //console.log("updated");
    for (let i = 0; i<data.length; i++){
      for (let j = 0; j<data[i].length; j++){
        ctx.fillStyle = data[i][j];
        ctx.fillRect(j*5, i*5, 50, 50);
      }
    }
  })

  .catch(error => {
    //alert(error.message);
    console.error('Erreur lors de la récupération des données :', error);
  });
}

const getTimeLeft = async () => {
  fetch(`${serveur}/temps-attente?uid=${idInput.value}`)
    //si on arrive ici (la première étape de la gestion de la réponse du serveur)
    //on teste si on n'a pas eu une erreur retournée 
    .then(response => {
      //si erreur 404
      if (!response.ok) {
        //il faut analyser le json retourner par le serveur {"error":"Year not found"}
        return response.json().then(data => {
          //ce throw est récupéré par la catch un peu plus bas
          throw new Error(data.error);
        });
      }
      //si pas d'erreur alors le json est "retournée" au then juste en dessous
      return  response.json();
    })
    //si on arrive ici (la seconde étape de la gestion de la réponse du serveur)
    //on peut traiter sans crainte cette réponse
    .then(data => {
      setTimeout(function(){
        console.log('Réponse du serveur:', data);
        console.log("temps restant récupéré depuis getTimeLeft " + data["tempsAttente"]);
        countDown(data["tempsAttente"]);
      }, 100);  

    })
    .catch(error => {
      //alert(error.message);
      console.error('Erreur lors de la récupération des données :', error);
    });
}


export const getLastPlayers = () => {
  
  fetch(`https://pixel-api.codenestedu.fr/liste-joueurs?uid=8c3d6b9a`)
  .then(response => {
    if (!response.ok) {
      return response.json().then(data => {
        throw new Error(data.error);
      });
    }
    return response.json();
  })

  .then(data => {
    //console.log(data);
    //p.innerHTML = "";
    console.log(table.rows.length);
    
    //table.getElementsByTagName("tbody")[0].innerHTML = table.rows[0].innerHTML;
    clearTable(table);
    //$table.find("tr:gt(0)").remove();

    //table.deleteRow(0);
    
    data.forEach( (player) => {
      let date = new Date(player.lastModificationPixel);
      const d = new Date();
      let day = d.getUTCDate();
      let diff = ((d.getTime()-date.getTime())/1000)
      //var pd = document.createElement('p');
      //pd.innerHTML = player.nom + " " + player.equipe + " " + player.banned + " " + Math.trunc(diff) + " " + player.nbPixelsModifies;
      ajouteLigne(player.nom,player.equipe,player.banned,Math.trunc(diff),player.nbPixelsModifies);
      //p.appendChild(pd);
      ;
    });
    /*
    let player = data[0];
    console.log(player);
    
    let date = new Date(player.lastModificationPixel);
    */
    //console.log(date.toDateString());
    
  })

  .catch(error => {
    //alert(error.message);
    console.error('Erreur lors de la récupération des données :', error);
  });
}


function clearTable(table) {
  var rows = table.rows;
  var i = rows.length;
  while (--i) {
    rows[i].parentNode.removeChild(rows[i]);
    // or
    // table.deleteRow(i);
  }
}

function ajouteLigne(name,team,bann,temps,pixels) {
  // Récupération d'une référence à la table


  // Insère une ligne dans la table à l'indice de ligne 0
  var nouvelleLigne = table.insertRow(-1);

  // Insère une cellule dans la ligne à l'indice 0
  var pixCell = nouvelleLigne.insertCell(0);
  var timeCell = nouvelleLigne.insertCell(0);
  var banCell = nouvelleLigne.insertCell(0);
  var teamCell = nouvelleLigne.insertCell(0);
  var nameCell = nouvelleLigne.insertCell(0);
  
  // Ajoute un nœud texte à la cellule
  var textNote = document.createTextNode(name);
  var teamNode = document.createTextNode(team);
  let banNode = document.createTextNode(bann);
  let timeNode = document.createTextNode(temps);
  let pixNode = document.createTextNode(pixels);

  banCell.appendChild(banNode);
  timeCell.appendChild(timeNode);
  pixCell.appendChild(pixNode);
  teamCell.appendChild(teamNode);
  nameCell.appendChild(textNote);





}

export const chooseTeam = () => {

  //console.log(idInput.value);
  const formData = {
    uid: idInput.value,
    nouvelleEquipe: parseInt(teamList.value)
};
  //console.log(formData);
  //console.log(idInput.value);
  //requete POST
  fetch(`${serveur}/choisir-equipe`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    //le données sont associées à la requete
    
    body: JSON.stringify(formData)
})


  .then(response => {
      //si le serveur a répondu une erreur
      if (!response.ok) {
        return response.json().then(data => {
          logText.innerHTML = data["msg"];
          logText.style.backgroundColor = "red";
          throw new Error(data.error);
      });
    }

    return response.json();
})
  .then(data => {
      //si tout s'est bien passé
      console.log('Réponse du serveur::', data);
      logText.innerHTML = data["msg"];
      logText.style.backgroundColor = "green";
      getTimeLeft()

  })
  .catch(error => {
      console.log('Erreur lors du changement d\'équipe ', error);
  });
};

 const sendPixel = async (x,y) => {
  const formData = {
    uid: idInput.value,
    col: x,
    row: y,
    color: colorPicker.value
  };
  console.log(formData);
  console.log(idInput.value);
  fetch(`${serveur}/modifier-case`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    //le données sont associées à la requete
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
      //si tout s'est bien passé
      console.log('Réponse du serveur:', data);
      getTimeLeft();

  })
  .catch(error => {
      console.log('Erreur lors de l\' envoi du pixel ', error);
  });


};

function getCursorPosition(canvas, event) {
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  console.log("x: " + Math.floor(x/5) + " y: " + Math.floor(y/5))
  return [Math.floor(x/5), Math.floor(y/5)]
}

function countDown(sec) {
  var timeleft = sec;
  console.log(typeof(timeleft))
  console.log("temps restant : " + timeleft);
  var downloadTimer = setInterval(function(){
    if(timeleft <= 0){
      clearInterval(downloadTimer);
    }
    progressBar.value = 15000 - timeleft;
    //console.log("valeur de la barre : " + progressBar.value);
    timeleft -= 100;
  }, 100);
}





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



window.onload = getTab;
const timeID = setInterval(getTab, 1000);
const lastPlayers = setInterval(getLastPlayers, 1000);