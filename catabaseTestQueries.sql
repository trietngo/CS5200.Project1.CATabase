--Query 1: Joins 3 tables: Select all cats born before 2008 and weighing less than 10lbs alongside their breeds and personalities
SELECT Cats.*, Breeds.breed_name AS Breed, Personalities.personality_name AS Personality
FROM Breeds, Personalities, Cats JOIN CatBreed ON Cats.cat_id = CatBreed.cat_id
		   JOIN CatPersonality ON Cats.cat_id = CatPersonality.cat_id
WHERE Breeds.breed_id = CatBreed.breed_id
AND Personalities.personality_id = CatPersonality.personality_id
AND Cats.cat_birthday < DATE('2008-01-01', 'start of month')
AND Cats.cat_weight_lb < 10

--Query 2: Contains a sub-query: List all cats weighing below average
SELECT Cats.cat_id, Cats.cat_name, Cats.cat_weight_lb
FROM Cats
WHERE Cats.cat_weight_lb < (
	SELECT avg(cats.cat_weight_lb)
	FROM cats
)

--Query 3: Contains GROUP BY with a HAVING CLAUSE: List all shelters containing more than 10 cats
SELECT Shelters.shelter_id, Shelters.shelter_name, COUNT(Houses.shelter_id) AS "Shelter_Population"
FROM Shelters, Houses
WHERE Shelters.shelter_id = Houses.shelter_id
GROUP BY Shelters.shelter_id
HAVING "Shelter_Population" > 20

--Query 4: Contains logical connectors: Select all Russian Blue cats that are also Optimistic

SELECT Cats.cat_id, Cats.cat_name
FROM Breeds, Cats JOIN CatBreed ON Cats.cat_id = CatBreed.cat_id
WHERE Breeds.breed_id = CatBreed.breed_id
AND Breeds.breed_name = 'Russian Blue'

INTERSECT

SELECT Cats.cat_id, Cats.cat_name
FROM Personalities, Cats JOIN CatPersonality ON Cats.cat_id = CatPersonality.cat_id
WHERE Personalities.personality_id = CatPersonality.personality_id
AND Personalities.personality_name = 'Optimistic'

--Query 5: Find top 5 highest rated shelter
SELECT Ratings.shelter_id, Shelters.shelter_name
FROM Ratings, Shelters
WHERE Ratings.shelter_id = Shelters.shelter_id
GROUP BY Ratings.shelter_id
ORDER BY avg(Ratings.rating_score) DESC
LIMIT 5

--Query 6: Find average weight by cat breed
DROP VIEW IF EXISTS [AvgWeightByBreed];
CREATE VIEW [AvgWeightByBreed] AS
SELECT Breeds.breed_id, Breeds.breed_name,
		avg(Cats.cat_weight_lb) OVER (PARTITION BY Breeds.breed_id) AS avg_weight
FROM Breeds JOIN Cats ON Breeds.breed_id = CatBreed.breed_id
			 JOIN CatBreed ON Cats.cat_id = CatBreed.cat_id;
SELECT *
FROM AvgWeightByBreed
GROUP BY AvgWeightByBreed.breed_id