import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import { body, validationResult } from "express-validator";
import dateFormat from "dateformat";
import { debug } from "console";
import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
import { ObjectId } from 'mongodb';
import fetch from "node-fetch";
import axios from "axios";
import bcrypt from "bcrypt";


//Génere un salt
const saltRondes = 10;
const salt = bcrypt.genSaltSync(saltRondes);

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


global.IDConnexion = null;
global.pageRetour = "/";
global.estProprietaire = false;
global.langue = "français";

config();

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
app.use(express.static("client"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//inclure le modele de express-session
app.use(session({
    secret: '1111111',
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 60000 * 120 } // cookie expiré automatiquement après cette durée, donc 2h
}));

//connexion à mongoDB
export async function connectToMongo(uri) {
    let mongoClient;
    try {
        mongoClient = new MongoClient(uri);
        console.log("Connection à MongoDB...");
        await mongoClient.connect();
        console.log("Connecté à MongoDB!");
        return mongoClient;
    } catch (error) {
        console.error("Erreur de connexion à MongoDB!", error);
        process.exit();
    }
}

const con = await connectToMongo(process.env.DB_URI);
const db = con.db("Nomad");

// Route handler for returning the HTML page
app.get("/", async function (req, res) {
    pageRetour = "/";
    try {
        const logements = await db.collection("logement").find({}).toArray();
        // Render the accueil page
        res.render("pages/accueil", {
            siteTitle: "Nomad",
            pageTitle: "Accueil",
            logement: logements,
            user: req.session.user,
            langue: langue,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/changer-langue/:pageTitle/:id/:prixTotal/:idProprio', function (req, res) {
    var pageTitle = req.params.pageTitle;
    var id = req.params.id;
    var prixTotal = req.params.prixTotal;
    var idProprio = req.params.idProprio;
    if (langue == "français" ){
        langue = "english";
        
        
      }else{
        langue = "français";
        
      }
    console.log('Langue updated:', langue);
    if(pageTitle == "Accueil"){
        pageTitle = "";
    }
    if(pageTitle == "Coups de coeur"){
        pageTitle = "coups-de-coeur";
    }
    if(pageTitle == "information"){
        pageTitle == "information";
        pageTitle = pageTitle + "/" + id;
    }
    if(pageTitle == "Transaction"){
        pageTitle = pageTitle + "/" + prixTotal;
    }
    if(pageTitle == "NomadPlus"){
        pageTitle = "dashboard";
    }
    if(pageTitle == "Ajout logement"){
        pageTitle = "ajout-logement?";
    }
    if(pageTitle == "Modif logement"){
        pageTitle = "logement/edit/" + idProprio;
    }
    
        
    res.redirect("/" + pageTitle);
});



//Route qui retourne une liste de logements
app.get("/logement-liste", async function (req, res) {
    try {
        const logements = await db.collection("logement").find({}).toArray();
        res.json(logements); // Sending logements array as JSON
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


//chemin vers la page d'inscription
app.get("/inscription", function (req, res) {
    res.render("pages/inscription", {
        siteTitle: "Nomad",
        pageTitle: "Inscription",
        user: req.session.user,
    });
});

//chemin vers la page de connexion
app.get("/connexion", function (req, res) {
    res.render("pages/connexion", {
        siteTitle: "Nomad",
        pageTitle: "Connexion",
        user: req.session.user,
    });
});

//chemin vers la page de A Propos
app.get("/apropos", function (req, res) {
    res.render("pages/apropos", {
        siteTitle: "Nomad",
        pageTitle: "APropos",
        user: req.session.user,
    });
});

//chemin vers la page infoCompte
app.get("/infocompte", async function (req, res) {
    try {
        const utilisateur = await db.collection("user").findOne({ _id: IDConnexion })
        const transactions = await db.collection("transaction").find({ proprietaire_id_client: IDConnexion }).toArray();

        res.render("pages/infocompte", {
            siteTitle: "Nomad",
            pageTitle: "infocompte",
            utilisateur: utilisateur,
            //location: lesLocations,
            transactions : transactions,
            user: req.session.user,
            langue: langue,
        });

    } catch (error) {
        console.error("Error fetching utilisateur:", error);
        res.status(500).send("Internal Server Error");
    }
});

//pour modifier les informations d'un utilisateur
app.post("/infocompte/modifier", async function (req, res) {
    try {
        const collection = db.collection("user");
        const updateDoc = {
            $set: {
                nom: req.body.nom,
                prenom: req.body.prenom,
                courriel: req.body.courriel,
                numero_telephone: req.body.numero_telephone
            }
        };

        const result = await collection.updateOne({ _id: IDConnexion }, updateDoc);
        console.log("User document modified:", result.modifiedCount);
        res.redirect("/infocompte");
    } catch (err) {
        console.error("Error updating client document:", err);
        return res.status(500).send("Internal Server Error");
    }
});

//pour supprimer un utilisateur
app.post("/infocompte/supprimer", async function (req, res) {
    try {
        var password = req.body.mdp;
        var lesLocations;
        const utilisateur = await db.collection("user").findOne({ _id: IDConnexion });
        const transactions = await db.collection("transaction").find({ proprietaire_id_client: IDConnexion }).toArray();
        lesLocations = await db.collection("logement").find({ _id: { $in: utilisateur.mes_locations } }).toArray();
        const mdpCorrect = await bcrypt.compare(password, utilisateur.mot_de_passe);
        if (mdpCorrect) {
            const result = await db.collection("user").deleteOne({ _id: IDConnexion });
            await db.collection("logement").deleteMany({ proprietaire_id_client: IDConnexion })
            req.session.destroy(err => {
                if (err) {
                    console.error('Error destroying session:', err);
                    res.status(500).json('Une erreur s\'est produite lors de la déconnexion.');
                }
            })
            IDConnexion = null;
            res.redirect("/");
        } else {
            res.render("pages/infocompte", {
                siteTitle: "Nomad",
                pageTitle: "infocompte",
                utilisateur: utilisateur,
                transactions : transactions,
                location: lesLocations,
                user: req.session.user,
                errorMessage: 'mot de passe incorrect.'
            });
        }
    } catch (err) {
        console.error("Error updating client document:", err);
        return res.status(500).send("Internal Server Error");
    }
});


// formulaire d'ajout d'un client
app.post("/compte/add", async function (req, res) {
    const { courriel, numero_telephone } = req.body;

    try {
        const courrielExiste = await db.collection("user").findOne({ courriel: courriel });
        const telExiste = await db.collection("user").findOne({ numero_telephone: numero_telephone });
        if (!courrielExiste && !telExiste) {
            const collection = db.collection("user");
            const clientDocument = {
                nom: req.body.nom,
                prenom: req.body.prenom,
                courriel: req.body.courriel,
                mot_de_passe: bcrypt.hashSync(req.body.mot_de_passe, salt),
                numero_telephone: req.body.numero_telephone,
                coups_de_coeur: [],
                proprietaire: false,
                mes_locations: []
            };

            const result = await collection.insertOne(clientDocument);
            console.log("User document inserted:", result.insertedId);
            res.redirect("/connexion");
        } else {
            res.render("pages/inscription", {
                siteTitle: "Nomad",
                pageTitle: "Inscription",
                user: req.session.user,
                errorMessage: "Le courriel ou numero de téléphone rentré est déja utilisé"
            });
        }

    } catch (err) {
        console.error("Error inserting client document:", err);
        return res.status(500).send("Internal Server Error");
    }
});

//methode pour se deconnecter
app.get('/deconnecter', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).json('Une erreur s\'est produite lors de la déconnexion.');
        }
    })
    IDConnexion = null;
    res.redirect("/");
});

app.get("/logement", async function (req, res) {
    try {
        var slider = req.query.slider;
        var destination = req.query.destination;
        var numChambre = req.query.numChambre;
        var numPeople = req.query.numPeople;
        var coupDeCoeur;

        const logements = await db.collection("logement").find({}).toArray();
        const destinations = await db.collection("destination").find({}).toArray();

        var toutLogements = logements;
        var resultatRecherche = toutLogements;


        if (slider && destination && numChambre && numPeople) {
            resultatRecherche = resultatRecherche.filter(logement => logement.prix <= slider);
        } else if (destination && numChambre && numPeople) {
            resultatRecherche = toutLogements.filter(logement => logement.destination === destination && logement.nombreChambre >= numChambre && logement.nombrePersonnes >= numPeople);
        }

        if (req.session.user) {
            const user = await db.collection("user").findOne({ _id: IDConnexion });
            console.log(user);
            coupDeCoeur = user.coups_de_coeur;
        } else {
            coupDeCoeur = [];
        }
        pageRetour = "/logement";
        res.render("pages/logement", {
            siteTitle: "Nomad",
            pageTitle: "Logement",
            resultatRecherche: resultatRecherche,
            destination: destinations,
            coupDeCoeur: coupDeCoeur,
            user: req.session.user,
        });
    } catch (error) {
        console.error("Error fetching logements:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.post("/coupDeCoeur/add/:id", async function (req, res) {
    try {
        const id = new ObjectId(req.params.id);

        const result = await db.collection("user").updateOne(
            { _id: IDConnexion },
            { $push: { coups_de_coeur: id } }
        );

        console.log("User document updated:", result);
        res.redirect(pageRetour);
    } catch (err) {
        console.error("Error updating user document:", err);
        return res.status(500).send("Internal Server Error");
    }
});



app.post("/coupDeCoeur/remove/:id", async function (req, res) {
    try {
        const id = new ObjectId(req.params.id);

        await db.collection("user").updateOne(
            { _id: IDConnexion },
            { $pull: { coups_de_coeur: id } },
        );
        res.redirect(pageRetour);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});



//chemin vers la page des coups de coeur
app.get("/coups-de-coeur", async function (req, res) {
    try {
        pageRetour = "/coups-de-coeur";
        let items = [];

        if (req.session.user) {
            const user = await db.collection("user").findOne({ _id: IDConnexion });

            if (user && user.coups_de_coeur && user.coups_de_coeur.length > 0) {

                items = await db.collection("logement").find({ _id: { $in: user.coups_de_coeur } }).toArray();
            }
        }

        res.render("pages/coupdecoeur", {
            siteTitle: "Nomad",
            pageTitle: "Coups de coeur",
            items: items,
            user: req.session.user,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

//prend les informations de connexion dans la bd pour se connecter
app.post("/connexion", async function (req, res) {
    const { courriel, mot_de_passe } = req.body;
    try {
        var erreur = false;
        const user = await db.collection("user").findOne({ courriel: courriel });
        if (user) {
            const mdpCorrect = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
            if (mdpCorrect) {
                const infoUtilisateur = {
                    IDConnexion: user._id,
                    NomUtilisateur: user.prenom + " " + user.nom,
                }
                req.session.user = infoUtilisateur;
                IDConnexion = req.session.user.IDConnexion;
                estProprietaire = user.proprietaire;
                res.redirect(pageRetour);
            } else {
                erreur = true;
            }
        } else {
            erreur = true;
        }
        if (erreur) {

            IDConnexion = null;
            res.render("pages/connexion", {
                siteTitle: "Nomad",
                pageTitle: "",
                user: req.session.user,
                errorMessage: 'Courriel ou mot de passe incorrect.'
            });
        }
    } catch (err) {
        console.error('Error executing MongoDB query:', err);
        res.status(500).json('Une erreur s\'est produite lors de la connexion.');
    }
});


// Chemin vers l'information du logement sélectionné
app.get("/information/:id", async function (req, res) {
    try {
        pageRetour = "/information/" + req.params.id;
        const id = new ObjectId(req.params.id)
        const { datepicker1, datepicker2 } = req.body;
        const currentDate = new Date();

        if (req.session.user) {
            const user = await db.collection("user").findOne({ _id: IDConnexion });
            var coupDeCoeur = user.coups_de_coeur;
        } else {
            coupDeCoeur = [];
        }
        const logement = await db.collection("logement").findOne({ _id: id });
        console.log(logement);
        res.render("pages/information", {
            siteTitle: "Nomad",
            pageTitle: "information",
            id: id,
            pageTitleVerif: "Information",
            logement: logement,
            prix: logement.prix,
            coupDeCoeur: coupDeCoeur,
            user: req.session.user,
            currentDate: currentDate,
            langue: langue,
        });
    } catch (err) {
        console.error('Error executing MongoDB query:', err);
        res.status(500).send('Une erreur s\'est produite lors du traitement de la demande.');
    }
});

app.post("/proprietaire/add", async function (req, res) {
    try {
        await db.collection("user").updateOne(
            { _id: IDConnexion },
            { $set: { proprietaire: true } }
        );
        req.session.user.proprietaire = true;
        estProprietaire = req.session.user.proprietaire;
        res.redirect("/dashboard")
    } catch (err) {
        console.error('Error executing MongoDB query:', err);
        res.status(500).send('Une erreur s\'est produite lors du traitement de la demande.');
    }
});

// app.get("/location/:id", async function (req, res) {
//     try {
//         pageRetour = "/location/" + req.params.id;

//         const { datepicker1, datepicker2 } = req.body;

//         //const user = await db.collection("user").findOne({ _id: ObjectId(IDConnexion) });
//         //const coupDeCoeur = await user.arrayField.filter(id => id === req.params.id);
//         const id = new ObjectId(req.params.id);
//         const logement = await db.collection("logement").findOne({ _id: id });


//         res.render("pages/location", {
//             siteTitle: "Nomad",
//             pageTitle: "Location",
//             logement: logement,
//             prix: logement.prix,
//             user: req.session.user,

//         });

//     } catch (err) {
//         console.error('Error executing MongoDB query:', err);
//         res.status(500).send('Une erreur s\'est produite lors du traitement de la demande.');
//     }
// });


// chemin vers la page du dashboard
app.get("/dashboard", async function (req, res) {
    pageRetour = "/dashboard";
    try {
        const logement = await db.collection("logement").find({ proprietaire_id_client: IDConnexion }).toArray();
        res.render("pages/NomadPlus", {
            pageTitle: "NomadPlus",
            user: req.session.user,
            logement: logement,
        });
    } catch (err) {
        console.error('Error executing MongoDB query:', err);
        res.status(500).send('Une erreur s\'est produite lors du traitement de la demande.');
    }
});

//envoie du donnée des revenus en format json
app.get("/dashboard/revenue", async function (req, res) {
    try {
        console.log('IDConnexion:', IDConnexion);
        const transaction = await db.collection("transaction").find({ proprietaire_id: IDConnexion }).toArray();
        console.log('Transactions:', transaction[0]);
        res.json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


//chemin vers la page d'ajout de logement
app.get("/ajout-logement", function (req, res) {
    res.render("pages/ajouterlogement", {
        siteTitle: "Nomad",
        pageTitle: "Ajout logement",
        user: req.session.user,
        langue: langue,
    });
});

//code pour ajouter un logement
app.post("/logement/add", async function (req, res) {
    //try {
    const destination = "Canada";
    const geocode = req.body.adresse + ", " + req.body.ville + ", " + req.body.region + ", " + req.body.code_postal;
    const collection = db.collection('logement');
    const logement = {
        adresse: req.body.adresse,
        nom_proprietaire: req.session.user.NomUtilisateur,
        destination: destination,
        geocode: geocode,
        prix: req.body.prix,
        description: req.body.description,
        disponibilite: req.body.disponibilite,
        nombreChambre: req.body.nombreChambre,
        nombrePersonnes: req.body.nombrePersonnes,
        proprietaire_id_client: IDConnexion,
    };

    //verifier si la destination du logement n'exite pas deja
    const collectionDestination = db.collection('destination');
    const destinationExiste = await collectionDestination.findOne({ pays: "Canada" });

    if (!destinationExiste) {
        //si la destination existe pas, elle est ajoutee a la collection destination
        const resultDestination = await collectionDestination.insertOne({ pays: req.body.destination });
        if (resultDestination.insertedCount === 1) {
            console.log("Destination ajoutée avec succès");
        } else {
            console.error("Erreur d'ajout de destination : la destination n'a pas pu être ajoutée!");
            //return res.status(500).send("Internal Server Error");
        }
    }
        const result = await collection.insertOne(logement);
        res.redirect("/dashboard");
        console.log("Logement ajouté avec succès");
    
        //} catch (err) {
        //    console.error("Erreur d'ajout de logement : le logement n'a pas été ajouté!", err);
        //    return res.status(500).send("Internal Server Error");
        //}
    
});


app.get("/logement/delete/:id", async function (req, res) {
    try {
        const id = new ObjectId(req.params.id);

        await db.collection("logement").deleteOne(
            { _id: id },
        );
        res.redirect("/dashboard");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});


//chemin vers la page de transaction
app.get("/transaction/:prixTotal", function (req, res) {
    const prixTotal = parseFloat(req.params.prixTotal);
    const fraisNettoyage = (prixTotal * 5) / 100;
    const fraisService = (prixTotal * 3) / 100;
    const taxes = (prixTotal * 14.975) / 100;
    const totalPaye = prixTotal + fraisNettoyage + fraisService + taxes;
    const logementId = req.query.logementId;

    res.render("pages/transaction", {
        siteTitle: "Nomad",
        pageTitle: "Transaction",
        prixTotal: prixTotal,
        fraisNettoyage: fraisNettoyage,
        fraisService: fraisService,
        taxes: taxes,
        totalPaye: totalPaye,
        user: req.session.user,
        langue: langue,
        logementId: logementId,
    });
});

app.get("/logement/edit/:id", async function (req, res) {

    const id = new ObjectId(req.params.id);

    var logement = await db.collection("logement").findOne(
        { _id: id },
    );
    res.render("pages/logement-edit", {
        siteTitle: "Nomad",
        pageTitle: "Modif logement",
        logement: logement,
        user: req.session.user
    });
});

app.post("/logement/edit/:id", async function (req, res) {
    try {
        const id = new ObjectId(req.params.id);
        const logement = await db.collection("logement");
        var geocode = req.body.adresse + ", " + req.body.ville + ", " + req.body.region + ", " + req.body.code_postal;
        const updateDoc = {
            $set: {
                adresse: req.body.adresse,
                destination: "Canada",
                prix: req.body.prix,
                description: req.body.description,
                disponibilite: req.body.disponibilite,
                nombreChambre: req.body.nombreChambre,
                nombrePersonnes: req.body.nombrePersonnes,
                geocode: geocode,
            }
        };
        const result = await logement.updateOne({ _id: id }, updateDoc);
        console.log("User document modified:", result.modifiedCount);
        res.redirect("/dashboard");
    } catch (err) {
        console.error("Error updating logement document:", err);
        return res.status(500).send("Internal Server Error");
    }

});


//chemin vers la page de transaction
// app.get("/transaction", function (req, res) {
//     res.render("pages/transaction", {
//         siteTitle: "Nomad",
//         pageTitle: "Transaction",
//         user: req.session.user,
//     });
// });


//code relie l'api de paypal
//code pour payer et ouvrir paypal pour le paiement
app.post('/payer', async (req, res) => {
    try {
        const totalPaye = req.body.montantTotal;
        console.log('Total Paye:', totalPaye); // Log totalPaye value
        const url = await createOrder(totalPaye);
        console.log('Order URL:', url); // Log order URL
        const redirectUrl = `${url}&totalPaye=${encodeURIComponent(totalPaye)}`;

        res.redirect(redirectUrl);
    } catch (error) {
        console.error('Error creating order:', error); // Log any errors
        res.send('Error: ' + error);
    }
});
        
//code pour quand la transaction a ete complete
app.get('/complete-order', async (req, res) => {
    try {
        const token = req.query.token;
        const totalPaye = req.query.totalPaye;
        console.log('Complete order token:', token); // Log token received
        console.log('Total Paye:', totalPaye); // Log totalPaye value

        if (!totalPaye) {
            throw new Error("Montant total non fourni");
        }

        const paymentDetails = await capturePayment(token);
        console.log("Réservation faite avec succès!");

        const collection = db.collection('transaction');
        const date = new Date();
        const totalPayeNumber = parseFloat(totalPaye);
        const transaction = {
            revenue : totalPayeNumber,
            date: date.toISOString().split('T')[0],
            proprietaire_id_client: IDConnexion
        };

        //ajouter la transaction a la collection
        const result = await collection.insertOne(transaction);
        console.log("Transaction ajoutée:", result.insertedId);

        //ajouter la transaction dans la liste de l'utilisateur
        const utilisateur = await db.collection("user");
        const updateResult = await utilisateur.updateOne(
            { _id: IDConnexion },
            { $push: { mes_locations: result.insertedId } }
        );
        console.log("Utilisateur mis à jour:", updateResult.modifiedCount);

        // Rediriger vers la page d'information du compte
        res.redirect("/infocompte");
        
    } catch (error) {
        console.error('Error completing order:', error); // Log any errors
        res.send('Error: ' + error);
    }
});


//code pour quand l'utilisateur annule la transaction
app.get('/cancel-order', (req, res) => {
    res.redirect('/logement')
})

//code pour l'api de paypal provenant et basé de https://github.com/manfraio/paypal_with_nodejs 
//code pour generer le lien de paypal
async function generateAccessToken() {
    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + '/v1/oauth2/token',
        method: 'post',
        data: 'grant_type=client_credentials',
        auth: {
            username: process.env.PAYPAL_CLIENT_ID,
            password: process.env.PAYPAL_SECRET
        }
    });
    console.log(response.data);
    return response.data.access_token;
}

//code pour creer un objet de transaction
export async function createOrder(totalPaye) {
    try {
        const accessToken = await generateAccessToken();
        console.log('Access token:', accessToken); // Log access token

        const response = await axios({
            url: process.env.PAYPAL_BASE_URL + '/v2/checkout/orders',
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            data: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        items: [
                            {
                                name: ' ',
                                description: ' ',
                                quantity: 1,
                                unit_amount: {
                                    currency_code: 'CAD',
                                    value: totalPaye
                                }
                            }
                        ],

                        amount: {
                            currency_code: 'CAD',
                            value: totalPaye,
                            breakdown: {
                                item_total: {
                                    currency_code: 'CAD',
                                    value: totalPaye
                                }
                            }
                        }
                    }
                ],

                application_context: {
                    return_url: `${process.env.BASE_URL}/complete-order?totalPaye=${encodeURIComponent(totalPaye)}`,
                    cancel_url: process.env.BASE_URL + '/cancel-order',
                    shipping_preference: 'NO_SHIPPING',
                    user_action: 'PAY_NOW',
                    brand_name: 'Nomad',
                    landing_page: 'LOGIN',
                    locale: 'en-CA'
                }
            })
        });
        console.log('Order creation response:', response.data); // Log order creation response
        return response.data.links.find(link => link.rel === 'approve').href;
    } catch (error) {
        console.error('Error creating order:', error); // Log any errors
        throw error;
    }
}

//code pour creer la transaction
export async function capturePayment(orderId) {
    try {
        const accessToken = await generateAccessToken();
        console.log('Access token:', accessToken); // Log access token

        const response = await axios({
            url: process.env.PAYPAL_BASE_URL + `/v2/checkout/orders/${orderId}/capture`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
        console.log('Capture payment response:', response.data); // Log capture payment response

        return response.data;
    } catch (error) {
        console.error('Error capturing payment:', error); // Log any errors
        throw error;
    }
}

app.post("/infocompte/mdp", async (req, res) => {
    try {
        var mdp = bcrypt.hashSync(req.body.mdp, salt);
        const collection = db.collection("user");
        const updateDoc = {
            $set: {
                mot_de_passe: mdp,
            }
        };

        const result = await collection.updateOne({ _id: IDConnexion }, updateDoc);
        console.log("User document modified:", result.modifiedCount);
        res.redirect("/infocompte");
    } catch (err) {
        console.error("Error updating client document:", err);
        return res.status(500).send("Internal Server Error");
    }
});
