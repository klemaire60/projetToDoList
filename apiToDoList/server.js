const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const connection = require('./db');

const app = express();
const port = 3000;
const jwtKey = "key";
const bcryptKey = "key";

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/register' , (req, res) => {
    
    const {mail, password} = req.body;
    if(!mail || !password) return res.status(400).json({ message : "L'Email ou le mot de passe est manquant !"});
    
    if(!validator.isEmail(mail)) return res.status(400).json({ message : "L'email n'est pas valide"});
    
    const sqlVerif = `SELECT mail FROM User WHERE mail = ?`;
    
    connection.query(sqlVerif, [mail], (err, results) => {
        
        if(err) {
            console.error("Erreur SQL lors de la verification du mail\nerreur : ", err)
            return res.status(500).json({ message: 'Erreur lors de la création du compte'});
        }
        
        if(results.length === 0) {
            bcrypt.hash(password, bcryptKey, (hashErr, hashedPassword) => {
                if (hashErr) {
                    console.error('Erreur lors du hachage du mot de passe :', hashErr);
                    return res.status(500).json({ message: "Erreur lors de la création du compte" });
                }
                
                let token = jwt.sign({ mail }, jwtKey);
                
                const sqlNewUser = `INSERT INTO User (mail, password, token) VALUES (?, ?, ?)`;
                connection.query(sqlNewUser, [mail, hashedPassword, token], (sqlErr) => {
                    if (sqlErr) {
                        console.error('Erreur lors de la création du nouvel utilisateur\nErreur : ', sqlErr);
                        return res.status(500).json({ message: "Erreur lors de la création du compte" });
                    }
                    return res.status(200).json({ message: "Compte créé avec succès" });
                });
            });
        } else {
            return res.json(
                {
                    message : "Email déjà utilisé",
                    token : token
                }
            );
        }
    })
});

app.post('/login', (req, res) => {
    const {mail, password} = req.body;
    
    if(!mail || !password) return res.status(400).json({ message : "L'Email ou le mot de passe est manquant !"});
    
    if(!validator.isEmail(mail)) return res.status(400).json({ message : "L'email n'est pas valide"});
    
    const sqlLogin = 'SELECT password FROM User WHERE mail = ?'
    
    connection.query(sqlLogin, [mail], (err, results) => {
        if(err) {
            console.error('Erreur lors de la requete sql login\nErreur : ', err);
            return res.status(500).json({message : "erreur lors de la connexion"});
        }
        
        if(results.length === 0) {
            return res.json({message : "Email incorrect"})
        }
        
        const password = bcrypt.compare(results[0].password, bcryptKey)
        
        if(!password) {
            return res.json({message : "Mot de passe incorrect"});
        } else {
            let token = jwt.sign({ mail }, jwtKey);
            return res.json(
                {
                    message : "Connexion réussie", 
                    token : token
                }
            )
        }
    })
})

app.listen(port, () => {
    console.log(`Le serveur est en écoute sur le port ${port}`);
});