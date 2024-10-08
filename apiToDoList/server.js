const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const rateLimit = require('express-rate-limit');

const connection = require('./db');

const app = express();
const port = 3000;
const jwtKey = "key";

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100
});

app.use(limiter);

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
            bcrypt.genSalt(10, (err, salt) => {
                if(err) {
                    console.error("erreur lors de la génération du sel bcrypt : ", err);
                    return res.status(500).json({ message: "Erreur lors de la création du compte" });
                }
                
                bcrypt.hash(password, salt, (hashErr, hashedPassword) => {
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
                        return res.status(200).json(
                            {
                                message: "Compte créé avec succès",
                                token : token
                            }
                        );
                    });
                });
            });
        } else {
            return res.status(409).json({message : "Email déjà utilisé"});
        }
    })
});

app.post('/login', (req, res) => {
    const {mail, password} = req.body;
    
    if(!mail || !password) return res.status(400).json({ message : "L'Email ou le mot de passe est manquant !"});
    if(!validator.isEmail(mail)) return res.status(400).json({ message : "L'email n'est pas valide"});
    
    const sqlLogin = 'SELECT password, token FROM User WHERE mail = ?'
    
    connection.query(sqlLogin, [mail], (err, results) => {
        if(err) {
            console.error('Erreur lors de la requete sql login\nErreur : ', err);
            return res.status(500).json({message : "erreur lors de la connexion"});
        }
        
        if(results.length === 0) {
            return res.status(409).json({message : "Email incorrect"})
        }
        
        const isPasswordValid = bcrypt.compareSync(password, results[0].password);
        
        if(isPasswordValid) {
            const sqlLoginToken = 'UPDATE User SET token = ? WHERE mail = ?'
            let token = jwt.sign({ mail }, jwtKey);
            
            connection.query(sqlLoginToken, [token, mail], (err) => {
                if(err) {
                    console.error("Erreur lors de la requete sql loginToken\nErreur : ", err);
                    return res.status(500).json({message : "Erreur lors de la création du token, veuillez réessayez"});
                }
                return res.status(200).json(
                    {
                        message : "Connexion réussie", 
                        token : token
                    }
                );
            })
        } else {
            return res.status(409).json({message : "Mot de passe incorrect"});
        }
    })
})

app.post('/disconnect', (req, res) => {
    const {token} = req.body;
    
    if(!token) return res.status(400).json({message : "le token du user est requis pour la déconnexion"});
    
    const sqlDisconnect = 'UPDATE User SET token = NULL WHERE token = ?'
    
    connection.query(sqlDisconnect, [token], (err) => {
        if(err) {
            console.error('Erreur lors de la requete sql disconnect\nErreur : ', err);
            return res.status(500).json({message : "erreur lors de la déconnexion"});
        }
        return res.status(200).json({message : "Utilisateur déconnecté"});
    })
})

app.post('/addTask', (req, res) => {
    const {taskName, userToken} = req.body;
    
    if(!taskName) return res.status(400).json({message : "Le nom de la tâche est requis"});
    if(!userToken) return res.status(400).json({message : "Le token du user est requis"});
    
    const sqlTaskVerif = 'SELECT * FROM Task WHERE name = ? AND idUser  = (SELECT id FROM User WHERE token = ?)';
    connection.query(sqlTaskVerif, [taskName, userToken], (err, results) => {
        
        if(err) {
            console.error('Erreur lors de la requete SQL TaskVerif\n erreur : ', err);
            return res.status(500).json({message : "Erreur lors de la création de la tâche"});
        }
        
        if(results.length === 0) {
            const sqlAddTask = 'INSERT INTO Task (name, idUser) VALUES (?, (SELECT id FROM User WHERE token = ?))';
            
            connection.query(sqlAddTask, [taskName, userToken], (err) => {
                if(err) {
                    console.error('Erreur lors de la requete SQL addTask\n erreur : ', err);
                    return res.status(500).json({message : "Erreur lors de la création de la tâche"});
                }
                
                res.status(200).json({message : "La tâche à bien été ajoutée"})
            })
        } else {
            return res.status(409).json({message : "Vous avez déjà enregistré cette tâche"})
        }
    })
});

app.post('/removeTask', (req, res) => {
    const {taskName, userToken} = req.body;
    
    if(!taskName) return res.status(400).json({message : "Le nom de la têche est requis"});
    if(!userToken) return res.status(400).json({message : "Le token du user est requis"});
    
    const sqlRemoveTask = 'DELETE FROM Task WHERE name = ? AND idUser = (SELECT id FROM User WHERE token = ?)';
    connection.query(sqlRemoveTask, [taskName, userToken], (err) => {
        if(err) {
            console.error('Erreur lors de la requete SQL removeTask\n erreur : ', err);
            return res.status(500).json({message : "Erreur lors de la suppression de la tâche"});
        }
        
        res.status(200).json({message : "La tâche à été correctement supprimée"});
    })
});

app.get('/getTaskList', (req, res) => {
    const {userToken} = req.body;
    
    if(!userToken) return res.status(400).json({message : "Le token du user est requis"});
    
    const sqlGetTask = 'SELECT name FROM Task WHERE idUser = (SELECT id FROM User WHERE token = ?)';
    connection.query(sqlGetTask, [userToken], (err, results) => {
        if(err) {
            console.error('Erreur lors de la requete sql getTask\nErreur : ', err);
            return res.status(500).json({message : "Erreur lors de la récupération des tâches"});
        }
        
        const taskNames = results.map(row => row.name);
        
        res.status(200).json({tasks : taskNames});
    })
})

app.post('/verifyToken', (req, res) => {
    const {token} = req.body;

    const sqlVerifyToken = 'SELECT token FROM User WHERE token = ?';

    connection.query(sqlVerifyToken, [token], (err, results) => {
        if(err) {
            console.error("Erreur lors de la requete SQL verifyToken\nErreur : ");
        }

        if(results.length === 0) return res.status(200).json({isisTokenValid : false});
        return res.status(200).json({isisTokenValid : true});
    })
})

app.listen(port, () => {
    console.log(`Le serveur est en écoute sur le port ${port}`);
});
