import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql";
import { body, validationResult } from "express-validator";
import dateFormat from "dateformat";
import { debug } from "console";
import { userInfo } from "os";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

global.IDConnexion = null;
global.pageRetour = "/";


//connexion au serveur
const server = app.listen(4000, function () {
    console.log("serveur fonctionne sur 4000... ! ");
});

//configuration de EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//importation de Bootstrap
app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js"));
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.use("/public", express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//inclure le modele de express-session
app.use(session ({ 
    secret : '1111111',
    saveUninitialized : false, 
    resave : false, 
    cookie: {maxAge: 60000 } // cookie expiré automatiquement après cette durée 
}));

//connexion au serveur MySQL
const con = mysql.createConnection({
    host: "localhost",
    user: "scott",
    password: "oracle",
    database: "nomad"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("connected!");
});


//chemin vers la page d'accueil
app.get("/", function (req, res) {
    pageRetour = "/";
    res.render("pages/accueil", {
        siteTitle: "Nomad",
        pageTitle: "Accueil",
        user: req.session.user,
    });
});

//formulaire d'ajout d'un client
app.post("/compte/add", function (req, res) {
    const requete = "INSERT INTO client (nom, prenom, courriel, mot_de_passe, numero_telephone) VALUES (?, ?, ?, ?, ?)";
    let num = req.body.numero_telephone;
    num = num.replace(/\s/g, "");
    const parametres = [
        req.body.nom,
        req.body.prenom,
        req.body.courriel,
        req.body.mot_de_passe,
        num
    ];
    con.query(requete, parametres, function (err, result) {
        if (err) throw err;
        res.redirect("/connexion");
    });
});

//chemin pour la deconnexion
app.get('/deconnecter', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).json('Une erreur s\'est produite lors de la déconnexion.');
        } 
    })
    IDConnexion = 0;
    res.redirect(pageRetour);
});

//chemin vers la page d'inscription
app.get("/inscription", function (req, res) {
    res.render("pages/inscription", {
        siteTitle: "Nomad",
        pageTitle: "Inscription",
    });
});

app.get("/location/:id", function(req, res){
    pageRetour = "/location/" + req.params.id;
    con.query(
        "SELECT * FROM logement WHERE id_logement = '" + req.params.id + "'",
        function (err, result) {
            if (err) throw err;
            res.render("pages/location", {
                siteTitle: "Nomad",
                pageTitle: "Location",
                logement: result[0],
                prix: result[0].prix,
                user: req.session.user
            });
    });
});

//chemin vers la page de logement
app.get("/logement", function (req, res) {
    var minPrice = req.query.minPrice;
    var maxPrice = req.query.maxPrice;
    var destination = req.query.destination;
    var numChambre = req.query.numChambre;
    var numPeople = req.query.numPeople;

    pageRetour = "/logement";
    con.query("SELECT * FROM coups_de_coeur WHERE coups_de_coeur.id_client = ?", [IDConnexion], function (err,
        coupDeCoeur) {
        if (err) throw err;
        if (minPrice && maxPrice) {

            con.query("SELECT * FROM logement WHERE prix BETWEEN ? AND ?", [minPrice, maxPrice], function (err, logementFiltrer) {
                if (err) throw err;

                con.query("SELECT * FROM destination", function (err, resDest) {
                    if (err) throw err;

                    res.render("pages/logement", {
                        siteTitle: "Nomad",
                        pageTitle: "Logement",
                        items: logementFiltrer,
                        destination: resDest,
                        coupDeCoeur: coupDeCoeur,
                        user: req.session.user,
                    });
                });
            });

        } else if (destination && numChambre && numPeople) {
            
            var sqlQuery = "SELECT * FROM logement WHERE destination = ? AND nombreChambre >= ? AND nombrePersonnes >= ?";
            var sqlParams = [destination, numChambre, numPeople];

            if (minPrice && maxPrice) {
                sqlQuery += " AND prix BETWEEN ? AND ?";
                sqlParams.push(minPrice, maxPrice);
            }

            con.query(sqlQuery, sqlParams, function (err, recherche) {
                if (err) throw err;

                con.query("SELECT * FROM destination", function (err, resDest) {
                    if (err) throw err;

                    res.render("pages/logement", {
                        siteTitle: "Nomad",
                        pageTitle: "Logement",
                        items: recherche,
                        destination: resDest,
                        coupDeCoeur: coupDeCoeur,
                        user: req.session.user,
                    });
                });
            });

        } else {
            con.query("SELECT * FROM logement", function (err, logements) {
                if (err) throw err;

                con.query("SELECT * FROM destination", function (err, destinations) {
                    if (err) throw err;
                            res.render("pages/logement", {
                                siteTitle: "Nomad",
                                pageTitle: "Logement",
                                items: logements,
                                destination: destinations,
                                coupDeCoeur: coupDeCoeur,
                                user: req.session.user,
                            });                   
                });
            });
        }
});
});

//formulaire d'ajout d'un logement a la table coups de coeur
app.post("/coupDeCoeur/add/:id", function (req, res) {
    const requete = "INSERT INTO coups_de_coeur (id_client, id_logement) VALUES (?, ?)";
    const parametres = [req.session.user.IDConnexion, req.params.id];
    con.query(requete, parametres, function (err, result) {
        if (err) throw err;
        res.redirect(pageRetour)
    });    
});

//formulaire de retrait d'un logement de la table coups de coeur
app.post("/coupDeCoeur/remove/:id", function (req, res) {
    const requete = "DELETE FROM coups_de_coeur WHERE id_client = ? AND id_logement = ?";
    const parametres = [req.session.user.IDConnexion, req.params.id];
    con.query(requete, parametres, function (err, result) {
        if (err) throw err;
        res.redirect(pageRetour)
    });    
});


//chemin vers la page des coups de coeur
app.get("/coups-de-coeur", function (req, res) {
    pageRetour = "/coups-de-coeur";
    if (req.session.user) {
        con.query("SELECT * FROM logement INNER JOIN coups_de_coeur ON logement.id_logement = coups_de_coeur.id_logement WHERE coups_de_coeur.id_client = ?", [IDConnexion], function (err,
            result) {
            if (err) throw err;
            res.render("pages/coupdecoeur", {
                siteTitle: "Nomad",
                pageTitle: "Coups de coeur",
                items: result,
                user: req.session.user,
            });
        });
    }
    else {
        res.render("pages/coupdecoeur", {
            siteTitle: "Nomad",
            pageTitle: "Coups de coeur",
            items: 0,
            user: req.session.user,
        });
    }
});

//chemin vers la page de connexion
app.get("/connexion", function (req, res) {
    res.render("pages/connexion", {
        siteTitle: "Nomad",
        pageTitle: "Connexion",
    });
    
});


//prend les informations de connexion dans la bd pour se connecter
app.post("/connexion", function (req, res) {
    const { courriel, mot_de_passe } = req.body;

    con.query("SELECT * FROM client WHERE courriel = ? AND mot_de_passe = ?", [courriel, mot_de_passe], (err, result) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json('Une erreur s\'est produite lors de la connexion.');
        } else {
            //si la connexion est reussie
            if (result.length === 1) {
                const infoUtilisateur = {
                    IDConnexion : result[0].id_client,
                    NomUtilisateur : result[0].prenom + " " + result[0].nom,
                }
                req.session.user = infoUtilisateur;
                IDConnexion = req.session.user.IDConnexion;
                res.redirect(pageRetour);
            } else {
                //si la connexion a echoue
                req.session.destroy(err => {
                    if (err) {
                        console.error('Error destroying session:', err);
                        res.status(500).json('Une erreur s\'est produite lors de la déconnexion.');
                    } 
                })
                res.render("pages/connexion", {
                    siteTitle: "Nomad",
                    pageTitle: "Connexion",
                    errorMessage: 'Courriel ou mot de passe incorrect.'
                });
            }
        }
    });
});

//Chemin vers l'infromation du logement selectionné
app.get("/information/:id", function (req, res) {
    pageRetour = "/information/" + req.params.id;
    con.query("SELECT * FROM coups_de_coeur WHERE coups_de_coeur.id_client = ?", [IDConnexion], function (err,
        coupDeCoeur) {
        if (err) throw err;
        con.query(
            "SELECT * FROM logement WHERE id_logement = '" + req.params.id + "'",
            function (err, result) {
                if (err) throw err;
                res.render("pages/information", {
                    siteTitle: "Nomad",
                    pageTitle: result[0].adresse,
                    logement: result[0],
                    coupDeCoeur: coupDeCoeur,
                    user: req.session.user,
                });
        });
    });
});

//chemin vers la page d'ajout de logement
app.get("/ajout-logement", function (req, res) {
    res.render("pages/ajouterlogement", {
        siteTitle: "Nomad",
        pageTitle: "Ajout logement",
    });
});

//formulaire d'ajout d'un logement
app.post("/logement/add", function (req, res) {
    const requete = "INSERT INTO logement (adresse, nom_proprietaire, destination, prix, description, disponibilite, nombreChambre, nombrePersonnes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const parametres = [
        req.body.adresse,
        req.body.nom_proprietaire,
        req.body.destination,
        req.body.prix,
        req.body.description,
        req.body.disponibilite,
        req.body.nombreChambre,
        req.body.nombrePersonnes
    ];
    con.query(requete, parametres, function (err, result) {
        if (err) throw err;
        res.redirect("/logement");
    });
});



/*** gestion de session ***/ 
//chemin pour acceder a la session d'un utilisateur
app.get ('/', (req, res) => {
    var sess;
    sess = req.session ;
    if (sess.courriel) {
        return res.redirect ('/coups-de-coeur') ;
    }
    res.sendFile(__dirname + '/views/coupsDeCoeur.ejs');
});

//chemin pour gerer les connexions des utilisateurs
app.post ('/connexion', (req, res) => {
    var sess;
    sess = req.session ;
    sess.courriel = req.body.courriel ;
    const { courriel, mot_de_passe } = req.body;

    con.query("SELECT * FROM client WHERE courriel = ? AND mot_de_passe = ?", [courriel, mot_de_passe], (err, result) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json('Une erreur s\'est produite lors de la connexion.');
        } else {
            if (result.length === 1) {
                //si l'authentification est reussie
                req.session.userID = result[0].id_client;
                IDConnexion = result[0].id_client;
                estConnecter = true;
                NomUtilisateur = result[0].prenom + " " + result[0].nom;
                res.redirect("/coups-de-coeur");
            } else {
                //si l'authentification a echoue
                res.render("pages/connexion", {
                    siteTitle: "Nomad",
                    pageTitle: "Connexion",
                    errorMessage: 'Courriel ou mot de passe incorrect.'
                });
            }
        }
    });
});


//chemin pour deconnecter la session de l'utilisateur
app.get('/deconnecter', (req , res) => {
    req.session.destroy ((err) => {
        retirerConnexion();
        res.redirect('/') ;
    });
});
