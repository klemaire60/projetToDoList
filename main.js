// Fonction pour récupérer les données de l'API uniquement si l'utilisateur est connecté
async function fetchDataIfLoggedIn() {
    const token = localStorage.getItem('token'); // Récupérer le token JWT depuis le stockage local
    if (token) {
        await fetchData(); // Appeler fetchData uniquement si un token est présent
    }
}




// Appeler la fonction fetchDataIfLoggedIn lorsque le DOM est entièrement chargé
document.addEventListener('DOMContentLoaded', fetchDataIfLoggedIn);

// Fonction pour récupérer les données de l'API
async function fetchData() {
    try {
        const apiUrl = `http://192.168.65.204:3000`;
        const response = await fetch(apiUrl);
        if (!response.ok){
            throw new Error('La requête a échoué');
        }
        const data = await response.json();
        let task1 = document.getElementById("tache1"); // Récupérer la tâche1
        let task2 = document.getElementById("tache2"); // Récupérer la tâche2
        
//conceptualisation base:
        app.get('/', async (req, res) => {
            try {
              const results = await query(`
              SELECT taches FROM todo
              `);
          
              res.json(results);
            } catch (err) {
              console.error('Erreur lors de l\'exécution de la requête MySQL:', err);
              res.status(500).send('Erreur lors de la requête SQL');
            }
          });

        app.post('/', async (req, res) => {
            try {
              const results = await query(`
              INSERT INTO nottodo
              UPDATE Todo SET
              `);
          
              res.json(results);
            } catch (err) {
              console.error('Erreur lors de l\'exécution de la requête MySQL:', err);
              res.status(500).send('Erreur lors de la requête SQL');
            }
          });



        // Effacer les options existantes
        task1.innerHTML = '';
        task2.innerHTML = '';


        // Parcourir les données et ajouter des options au menu déroulant
        data.forEach(item => {
            let option = document.createElement("option");
            option.value = item.name;
            option.text = item.name;
            option.setAttribute('forcex', item.forcetest);
            option.setAttribute('vitessex', item.vitesse);
            option.setAttribute('defensex', item.defense);
            option.setAttribute('durabilitex', item.durabilité);
            option.setAttribute('intelligencex', item.intelligence);
        
            let option2 = option.cloneNode(true);
        
           
        
            select.appendChild(option);
            select2.appendChild(option2);
         
        });
      


    } catch (error) {
        // Gestion des erreurs ici
        console.error('Erreur lors de la récupération des données de l\'API:', error);
    }
}

///////////////////////////////////////////////////////////
async function fetchDataAccessoires() {
    try {
        const apiUrlbis = `http://192.168.65.204:3000/Dates`;
        const responsebis = await fetch(apiUrlbis);
        if (!responsebis.ok) {
            throw new Error('La requête a échoué');
        }
        const data = await responsebis.json();
        let dateD = document.getElementById("date"); // Récupérer le menu déroulant

        // Effacer les options existantes
        dateD.innerHTML = '';

        // Parcourir les données et ajouter des options au menu déroulant
        data.forEach(item => {
            let optionD = document.createElement("option");
            optionD.value = item.temps;
            optionD.text = item.temps;
            optionD.setAttribute('tempsx', item.temps);
            
         
            let option4 = option3.cloneNode(true);

            selectD.appendChild(optionD);
        });
        
    } catch (error) {
        console.error('Erreur lors de la récupération des données de l\'API:', error);
    }
}

///////////////////////////////////////////////////////////

// Code existant pour afficher les résultats et empêcher la soumission du formulaire
document.getElementById('button1').addEventListener('click', async function (event) {
    event.preventDefault(); // Empêche le formulaire de se soumettre

    document.getElementById('carte1').classList.remove('hidden');
    document.getElementById('carte2').classList.remove('hidden');
    document.getElementById('image1').classList.remove('hidden');
    document.getElementById('image2').classList.remove('hidden');
    document.getElementById('result').classList.remove('hidden');

    try {
                
        let select1Value = document.getElementById('choix').value;
        let select2Value = document.getElementById('choix2').value;
        let select3Value = parseInt(document.getElementById('choix').options[document.getElementById('choix').selectedIndex].getAttribute('forcex'));
        let select4Value = parseInt(document.getElementById('choix2').options[document.getElementById('choix2').selectedIndex].getAttribute('forcex'));
        let select5Value = parseInt(document.getElementById('choix').options[document.getElementById('choix').selectedIndex].getAttribute('vitessex'));
        let select6Value = parseInt(document.getElementById('choix2').options[document.getElementById('choix2').selectedIndex].getAttribute('vitessex'));
        let select7Value = parseInt(document.getElementById('choix').options[document.getElementById('choix').selectedIndex].getAttribute('defensex'));
        let select8Value = parseInt(document.getElementById('choix2').options[document.getElementById('choix2').selectedIndex].getAttribute('defensex'));
        let select9Value = parseInt(document.getElementById('choix').options[document.getElementById('choix').selectedIndex].getAttribute('durabilitex'));
        let select10Value = parseInt(document.getElementById('choix2').options[document.getElementById('choix2').selectedIndex].getAttribute('durabilitex'));
        let select11Value = parseInt(document.getElementById('choix').options[document.getElementById('choix').selectedIndex].getAttribute('intelligencex'));
        let select12Value = parseInt(document.getElementById('choix2').options[document.getElementById('choix2').selectedIndex].getAttribute('intelligencex'));

        let select13Value = document.getElementById('choixA1').value;
        let select14Value = document.getElementById('choixA2').value;
        let select15Value = parseInt(document.getElementById('choixA1').options[document.getElementById('choixA1').selectedIndex].getAttribute('bonusx'));
        let select16Value = parseInt(document.getElementById('choixA2').options[document.getElementById('choixA2').selectedIndex].getAttribute('bonusx'));
        let select17Value = parseInt(document.getElementById('choixA1').options[document.getElementById('choixA1').selectedIndex].getAttribute('malusx'));
        let select18Value = parseInt(document.getElementById('choixA2').options[document.getElementById('choixA2').selectedIndex].getAttribute('malusx'));
        let select19Value = parseInt(document.getElementById('choixA1').options[document.getElementById('choixA1').selectedIndex].getAttribute('effectsx'));
        let select20Value = parseInt(document.getElementById('choixA2').options[document.getElementById('choixA2').selectedIndex].getAttribute('effectsx'));
        afficherResultat(select1Value, select2Value, select3Value, select4Value, select5Value, select6Value, select7Value, select8Value, select9Value, select10Value, select11Value, select12Value, select13Value, select14Value, select15Value, select16Value, select17Value, select18Value, select19Value, select20Value);

        const winner = determineWinner(select3Value, select4Value, select5Value, select6Value, select7Value, select8Value, select9Value, select10Value, select11Value, select12Value, select15Value, select16Value, select17Value, select18Value, select19Value, select20Value);
    } catch (error) {
        console.error('Erreur lors de la récupération des données de l\'API:', error);
    }
});

function afficherResultat(value1, value2, value3, value4, value5, value6, value7, value8, value9, value10, value11, value12, value13, value14, value15, value16, value17, value18, value19, value20) {
    document.getElementById('name1').textContent = value1;
    document.getElementById('name2').textContent = value2;
    document.getElementById('force1').textContent = value3;
    document.getElementById('force2').textContent = value4;
    document.getElementById('vitesse1').textContent = value5;
    document.getElementById('vitesse2').textContent = value6;
    document.getElementById('defense1').textContent = value7;
    document.getElementById('defense2').textContent = value8;
    document.getElementById('durabilite1').textContent = value9;
    document.getElementById('durabilite2').textContent = value10;
    document.getElementById('intelligence1').textContent = value11;
    document.getElementById('intelligence2').textContent = value12;

    document.getElementById('nameA1').textContent = value13;
    document.getElementById('nameA2').textContent = value14;
    document.getElementById('bonus1').textContent = value15;
    document.getElementById('bonus2').textContent = value16;
    document.getElementById('malus1').textContent = value17;
    document.getElementById('malus2').textContent = value18;
    document.getElementById('effects1').textContent = value19;
    document.getElementById('effects2').textContent = value20;
    
    // Appeler la fonction pour récupérer les données des personnages à chaque fois que le bouton est cliqué

    let image1 = document.getElementById('image1');
    let image2 = document.getElementById('image2');
    console.log(value15, value9);
    if (value1 === "Doom Slayer") {
        image1.src = "Images/doomguy-doom-2880x1800-12603.jpg";
    } else if (value1 === "J2") {
        image1.src = "chemin/vers/image1.jpg";
    } else if (value1 === "Batman") {
        image1.src = "Images/batman-wallpapers-574x1024.jpg";
    } else if (value1 === "Superman") {
        image1.src = "Images/Superman_50.jpg";
    }

    if (value2 === "Doom Slayer") {
        image2.src = "Images/doomguy-doom-2880x1800-12603.jpg";
    } else if (value2 === "J2") {
        image2.src = "chemin/vers/image2.jpg";
    } else if (value2 === "Batman") {
        image2.src = "Images/batman-wallpapers-574x1024.jpg";
    } else if (value2 === "Superman") {
        image2.src = "Images/Superman_50.jpg";
    }
}

// Fonction pour comparer les caractéristiques et déterminer le gagnant
function determineWinner(value3, value4, value5, value6, value7, value8, value9, value10, value11, value12, value15, value16, value17, value18) {
    // Calcul des scores pour chaque personnage
    console.log(value9 + value15);
    const score1 = value3 + value5 + value7 + value9 + value11 + value15 + value17;
    const score2 = value4 + value6 + value8 + value10 + value12 + value16 + value18;
    console.log(score1, score2);
    if (score1 > score2) {
        document.getElementById('result').textContent = "Le personnage 1 est le gagnant!";
    } else if (score2 > score1) {
        document.getElementById('result').textContent = "Le personnage 2 est le gagnant!";
    } else {
        document.getElementById('result').textContent = "Égalité!";
    }
}


  
/*
<script>

let connexionSubmit = document.getElementById("connexionSubmit");

async function redirectIfLoggedIn() {
  const token = localStorage.getItem('token');
  if (token) {
    const userData = await fetchData();
    if (userData && userData.email) {
      connexionSubmit.value = userData.email; // Remplacez la valeur du bouton par l'e-mail de l'utilisateur
      connexionSubmit.innerHTML = userData.email;
   
    }
  }
}
</script>
*/
const letoken = localStorage.getItem('token'); // Récupérer le token JWT depuis le stockage local
var coucou = ({
    message: "salut",
    token: letoken
}
);

console.log(coucou.message);

/*
<script>
var button = document.getElementById('button1');

// Cachez le bouton immédiatement lors du chargement de la page
button.style.display = 'none';

// Attendez 5 secondes avant d'afficher le bouton
setTimeout(function() {
    button.style.display = 'block';
}, 3000); // 3000 millisecondes = 3 secondes
</script>
*/