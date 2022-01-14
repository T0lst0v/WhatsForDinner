// TEST FILE DELETE BEFORE DEPLOYMENT

const apiKey = '88d877514e7d458aac097379c5a5ed83'
const exampleDiv = document.getElementById("recipeExampleDiv")
const urlFindByIngredients =  'https://api.spoonacular.com/recipes/findByIngredients?'

/*
 example GET for find by ingredients
 https://api.spoonacular.com/recipes/findByIngredients?ingredients=apples,+flour,+sugar&number=2
 separate ingredients by commas and plus sign ',+'
 separate parameters with a '&' e.g. ingredients= and number=
 gets 5 basic recipes that includes the ingredients chicken, cheese and cord
 use recipe id from the recipe to get the detailed recipe information
*/
// UNCOMMENT BELOW TO RUN TEST
//ingredientTest()
function ingredientTest() {
    fetch(`${urlFindByIngredients}apiKey=${apiKey}&ingredients=chicken,+cheese, +corn&number=5`)
        .then(response => response.json())
        .then(result => displayRecipesFromSearch(result))
}

// display some basic recipe info returned from our ingredient search
function displayRecipesFromSearch(recipes) {
    console.log("logging recipes search");
    console.log(recipes)
    exampleDiv.innerHTML += recipes.map(recipe =>
        `<ul style="list-style-type: none">
        <li>${recipe.title}</li>
        <li><img src=${recipe.image} alt='image of '${recipe.title}/></li>
        <li>${recipe.likes} likes</li>        
        <li>missing ${recipe.missedIngredientCount} ingredients
        <li>uses ${recipe.usedIngredientCount} of our ingredients
    </ul>`).join('')
}


/*
 example GET for detailed recipe information
https://api.spoonacular.com/recipes/716429/information?includeNutrition=false
 get recipe '636411' and displays some data
*/
// UNCOMMENT BELOW TO RUN TEST
//getRecipeFromID(636411)
function getRecipeFromID(recipeID){
    let urlFindRecipeFromID = `https://api.spoonacular.com/recipes/${recipeID}/information?apiKey=${apiKey}`
    fetch(`${urlFindRecipeFromID}`)
        .then(response => response.json())
        .then(result => displayRecipeFromID(result))
        //.then(result => console.log(result))
}

// display some data from the detailed recipe
function displayRecipeFromID(recipe){
    console.log("logging detailed recipe");
    console.log(recipe)
    exampleDiv.innerHTML +=
        `<ul style="list-style-type: none">
        <li><a href=${recipe.sourceUrl}>link to recipe</a></li>      
        <li>prep time: ${recipe.preparationMinutes}</li>  
        <li>cook time: ${recipe.cookingMinutes}</li>               
        <li>${recipe.summary}</li>
        <li>${recipe.instructions}</li>
    </ul>`
}