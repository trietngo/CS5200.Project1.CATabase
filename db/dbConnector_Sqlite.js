const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

async function connect() {
    return open({
        filename: "./db/catabase.db",
        driver: sqlite3.Database,
    })
}

/* CATS */

async function getCats() {
    const db = await connect();
    const cats = await db.all(`
        SELECT Cats.*, Breeds.breed_name AS cat_breed, Personalities.personality_name AS cat_personality, Shelters.shelter_name AS cat_shelter
        FROM Cats, CatPersonality, Personalities, CatBreed, Breeds, Houses, Shelters
        WHERE Cats.cat_id = CatPersonality.cat_id
        AND CatPersonality.personality_id = Personalities.personality_id
        AND Cats.cat_id = CatBreed.cat_id
        AND CatBreed.breed_id = Breeds.breed_id
        AND Cats.cat_id = Houses.cat_id
        AND Shelters.shelter_id = Houses.shelter_id
    `);

    return cats;
}

async function getCatById(catId) {
    const db = await connect();
    const indCat = await db.all(`
        SELECT Cats.*, Breeds.breed_name AS cat_breed, Personalities.personality_name AS cat_personality, Shelters.shelter_name AS cat_shelter
        FROM Cats, CatPersonality, Personalities, CatBreed, Breeds, Houses, Shelters
        WHERE Cats.cat_id = CatPersonality.cat_id
        AND CatPersonality.personality_id = Personalities.personality_id
        AND Cats.cat_id = CatBreed.cat_id
        AND CatBreed.breed_id = Breeds.breed_id
        AND Cats.cat_id = Houses.cat_id
        AND Shelters.shelter_id = Houses.shelter_id
        AND Cats.cat_id = ${catId}
    `)

    console.log("CatID", catId);

    db.close();

    return indCat;
}

async function createCat(catName, catBirthday, catWeightLbs, catBreed, catPersonality, catShelter) {
    const db = await connect();
    const newCat = await db.exec(`

        INSERT INTO Cats (cat_name, cat_birthday, cat_weight_lb)
        VALUES ("${catName}", "${catBirthday}", ${catWeightLbs});
        
        INSERT INTO CatBreed
        VALUES ((
            SELECT Cats.cat_id
            FROM Cats
            ORDER BY Cats.cat_id DESC
            LIMIT 1
            ), 
            (
            SELECT Breeds.breed_id
            FROM Breeds
            WHERE Breeds.breed_name = "${catBreed}"
            )
        );

        INSERT INTO CatPersonality
        VALUES ((
            SELECT Cats.cat_id
            FROM Cats
            ORDER BY Cats.cat_id DESC
            LIMIT 1
            ), 
            (
            SELECT Personalities.personality_id
            FROM Personalities
            WHERE Personalities.personality_name = "${catPersonality}"
            )
        );
        
        INSERT INTO Houses
        VALUES ((
            SELECT Cats.cat_id
            FROM Cats
            ORDER BY Cats.cat_id DESC
            LIMIT 1
            ), 
            (
            SELECT Shelters.shelter_id
            FROM Shelters
            WHERE Shelters.shelter_name = "${catShelter}"
            )
        );
    `)

    return newCat;
}

async function deleteCatById(catId) {
    const db = await connect();
    const deletedCat = await db.exec(`

        DELETE FROM Cats
        WHERE Cats.cat_id = ${catId};

        DELETE FROM CatBreed
        WHERE CatBreed.cat_id = ${catId};

        DELETE FROM CatPersonality
        WHERE CatPersonality.cat_id = ${catId};

        DELETE FROM Houses
        WHERE Houses.cat_id = ${catId};
    `)

    return deletedCat;
}

async function updateCat(catId, catName, catWeight) {
    const db = await connect();
    const updatedCat = await db.all(`
        UPDATE Cats
        SET cat_name = "${catName}",
            cat_weight_lb = ${catWeight}
        WHERE Cats.cat_id = ${catId};
    `)

    return updatedCat;
}

/* SHELTERS */

async function getShelters() {
    const db = await connect();
    const shelters = await db.all(`
        SELECT *
        FROM Shelters
    `);

    return shelters;
}

async function getShelterById(shelter_id) {
    const db = await connect();
    const indShelter = await db.all(`
        SELECT Shelters.*
        FROM Shelters
        WHERE Shelters.shelter_id = ${shelter_id}
    `)

    console.log("ShelterId", shelter_id);

    db.close();

    return indShelter;
}

async function updateShelter(shelterId, shelterName, shelterLocation, shelterEmail, shelterPhone) {
    const db = await connect();
    const updatedShelter = await db.all(`
        UPDATE Shelters
        SET shelter_name = "${shelterName}",
            shelter_location = "${shelterLocation}",
            shelter_email = "${shelterEmail}",
            shelter_phone = "${shelterPhone}"
        WHERE Shelters.shelter_id = ${shelterId};
    `)

    return updatedShelter;
}

async function createShelter(shelterName, shelterLocation, shelterEmail, shelterPhone) {
    const db = await connect();
    const newShelter = await db.exec(`

        INSERT INTO Shelters (shelter_name, shelter_location, shelter_email, shelter_phone)
        VALUES ("${shelterName}", "${shelterLocation}", "${shelterEmail}", "${shelterPhone}");
    `)

    return newShelter;
}

async function deleteShelterById(shelterId) {
    const db = await connect();
    const deletedShelter = await db.exec(`

        DELETE FROM Shelters
        WHERE Shelters.shelter_id = ${shelterId};

        DELETE FROM Ratings
        WHERE Ratings.shelter_id = ${shelterId};
    `)

    return deletedShelter;
}

/* USERS */

async function getUsers() {
    const db = await connect();
    const users = await db.all(`
        SELECT *
        FROM Users
    `);

    return users;
}

async function getUserById(user_id) {
    const db = await connect();
    const indUser = await db.all(`
        SELECT Users.*
        FROM Users
        WHERE Users.user_id = ${user_id}
    `)

    console.log("UserID", user_id);

    db.close();

    return indUser;
}

async function updateUser(userId, userFirstName, userLastName, userAddress, userEmail, userPhone) {
    const db = await connect();
    const updatedUser = await db.all(`
        UPDATE Users
        SET user_first_name = "${userFirstName}",
            user_last_name = "${userLastName}",
            user_address = "${userAddress}",
            user_email = "${userEmail}",
            user_phone = "${userPhone}"
        WHERE Users.user_id = ${userId};
    `)

    return updatedUser;
}

async function createUser(userFirstName, userLastName, userAddress, userEmail, userPhone) {
    const db = await connect();
    const newUser = await db.exec(`

        INSERT INTO Users (user_first_name, user_last_name, user_address, user_email, user_phone)
        VALUES ("${userFirstName}", "${userLastName}", "${userAddress}", "${userEmail}", "${userPhone}");
    `)

    return newUser;
}

async function deleteUserById(userId) {
    const db = await connect();
    const deletedUser = await db.exec(`

        DELETE FROM Users
        WHERE Users.user_id = ${userId};

        DELETE FROM Adopts
        WHERE Adopts.user_id = ${userId};

        DELETE FROM Ratings
        WHERE Ratings.user_id = ${userId};
    `)

    return deletedUser;
}

/* ADOPTIONS */
async function getAdoptions() {
    const db = await connect();
    const adoptions = await db.all(`
        SELECT Users.user_first_name || ' ' || Users.user_last_name AS user_name, Cats.cat_name, Adopts.adoption_date
        FROM Adopts, Users, Cats
        WHERE Adopts.user_id = Users.user_id
        AND Adopts.cat_id = Cats.cat_id
    `);

    return adoptions;
}

module.exports = {
    getCats,
    getCatById,
    updateCat,
    createCat,
    deleteCatById,

    getShelters,
    getShelterById,
    updateShelter,
    createShelter,
    deleteShelterById,

    getUsers,
    getUserById,
    updateUser,
    createUser,
    deleteUserById,

    getAdoptions,
};