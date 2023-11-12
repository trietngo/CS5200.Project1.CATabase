let express = require('express');
let router = express.Router();

const { getCats, getShelters, getUsers, getCatById, updateCat, createCat, deleteCatById, getShelterById, updateShelter, createShelter, deleteShelterById, getUserById, updateUser, createUser, deleteUserById, getAdoptions } = require("../db/dbConnector_Sqlite.js");

/* GET home page. */
router.get('/', async function(req, res, next) {

  const cats = await getCats();
  console.log("route / called - catdata.length", cats.length);
  res.render('index', { title: 'CATabase: A Feline Database Management System'});
});

/* GET All Cats */
router.get('/cats', async function(req, res, next) {

  const cats = await getCats();
  res.render('cats', { title: 'All Available Cats', cats });
});

/* GET Individual Cats */
router.get('/cats/:catID', async function(req, res, next) {
  console.log("Cat ID:", req.params.catID);
  const catID = req.params.catID
  const indCat = await getCatById(catID);
  console.log(indCat[0]);
  res.render('indCat', { title: 'Cat ID: ' + req.params.catID, indCat });
});

/* Create a new cat */
router.get('/create', async function(req, res, next) {

  res.render('createCat', { title: 'Add a New Cat' });
});

router.post('/create/new', async function(req, res, next) { 

  console.log(req.body);
  
  const catName = req.body.catName;
  const catBirthday = req.body.catBirthday;
  const catBreed = req.body.catBreed;
  const catPersonality = req.body.catPersonality;
  const catWeightLbs = req.body.catWeightLbs;
  const catShelter = req.body.catShelter;

  console.log("Name: ", catName);
  console.log("Weight: ", catWeightLbs);

  await createCat(catName, catBirthday, catWeightLbs, catBreed, catPersonality, catShelter);

  res.redirect('/cats');
});

/* Update Individual Cats */
router.post('/cats/:catID', async function(req, res, next) {  
  
  const catID = req.body.catID;
  const catName = req.body.catName;
  const catWeightLbs = req.body.catWeightLbs

  console.log("ID: ", catID);
  console.log("Name: ", catName);
  console.log("Weight: ", catWeightLbs);

  await updateCat(catID, catName, catWeightLbs);

  const indCat = await getCatById(catID);

  res.redirect('/cats');
});

/* Delete a cat */
router.get('/cats/:catID/delete', async function(req, res, next) {

  const catID = req.params.catID;

  await deleteCatById(catID);
  res.redirect('/cats');
});

/* GET Shelters */
router.get('/shelters', async function(req, res, next) {

  const shelters = await getShelters();
  res.render('shelters', { title: 'All Shelters', shelters });
});

/* GET Individual Shelter */
router.get('/shelters/:shelterID', async function(req, res, next) {
  console.log("Shelter ID:", req.params.shelterID);
  const shelterID = req.params.shelterID
  const indShelter = await getShelterById(shelterID);
  console.log(indShelter[0]);
  res.render('indShelter', { title: 'Shelter ID: ' + req.params.shelterID, indShelter });
});

/* Update Individual Shelters */
router.post('/shelters/:shelterID', async function(req, res, next) {  
  
  const shelterID = req.body.shelterID;
  const shelterName = req.body.shelterName;
  const shelterLocation = req.body.shelterLocation;
  const shelterEmail = req.body.shelterEmail;
  const shelterPhone = req.body.shelterPhone;

  await updateShelter(shelterID, shelterName, shelterLocation, shelterEmail, shelterPhone);

  const indShelter = await getShelterById(shelterID);

  res.redirect('/shelters');
});

/* Create a new shelter */
router.get('/createShelter', async function(req, res, next) {

  res.render('createShelter', { title: 'Add a New Shelter' });
});

router.post('/createShelter/new', async function(req, res, next) { 

  console.log(req.body);
  
  const shelterName = req.body.shelterName;
  const shelterLocation = req.body.shelterLocation;
  const shelterEmail = req.body.shelterEmail;
  const shelterPhone = req.body.shelterPhone;

  await createShelter(shelterName, shelterLocation, shelterEmail, shelterPhone);

  res.redirect('/shelters');
});

/* Delete a shelter */
router.get('/shelters/:shelterID/delete', async function(req, res, next) {

  const shelterID = req.params.shelterID;

  await deleteShelterById(shelterID);
  res.redirect('/shelters');
});

/* GET Users */
router.get('/users', async function(req, res, next) {

  const users = await getUsers();
  res.render('users', { title: 'All Users', users });
});

/* GET Individual User */
router.get('/users/:userID', async function(req, res, next) {
  console.log("User ID:", req.params.userID);
  const userID = req.params.userID
  const indUser = await getUserById(userID);
  console.log(indUser[0]);
  res.render('indUser', { title: 'User ID: ' + req.params.userID, indUser });
});

/* Update Individual Users */
router.post('/users/:userID', async function(req, res, next) {  
  
  const userID = req.body.userID;
  const userFirstName = req.body.userFirstName;
  const userLastName = req.body.userLastName;
  const userAddress = req.body.userAddress;
  const userEmail = req.body.userEmail;
  const userPhone = req.body.userPhone;

  await updateUser(userID, userFirstName, userLastName, userAddress, userEmail, userPhone);

  const indUser = await getUserById(userID);

  res.redirect('/users');
});

/* Create a new user */
router.get('/createUser', async function(req, res, next) {

  res.render('createUser', { title: 'Add a New User' });
});

router.post('/createUser/new', async function(req, res, next) { 

  console.log(req.body);
  
  const userFirstName = req.body.userFirstName;
  const userLastName = req.body.userLastName;
  const userAddress = req.body.userAddress;
  const userEmail = req.body.userEmail;
  const userPhone = req.body.userPhone;

  await createUser(userFirstName, userLastName, userAddress, userEmail, userPhone);

  res.redirect('/users');
});

/* Delete a user */
router.get('/users/:userID/delete', async function(req, res, next) {

  const userID = req.params.userID;

  await deleteUserById(userID);
  res.redirect('/users');
});

/* GET Adoptions */
router.get('/adoptions', async function(req, res, next) {

  const adoptions = await getAdoptions();
  res.render('adoptions', { title: 'All Adoptions', adoptions });
});

module.exports = router;
