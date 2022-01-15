const apiKey = "a77214948c1b41d6a431b3f28497a02b";
const urlRecipe = "https://api.spoonacular.com/recipes/";
//fields
const mainContainer = document.querySelector("#mainContainer");
const inputIngredient = document.querySelector("#inputIngredient");
//buttons
const btnAddIngredient = document.querySelector("#btnAddIngredient");
const btnFindRecipe = document.querySelector("#btnFindRecipe");
const ingrContainer = document.querySelector("#ingrContainer");
//variables
const ingredientsArr = [];
const lettersOnly = /^[a-zA-Z]+$/g;
/*
 example GET for find by ingredients
 https://api.spoonacular.com/recipes/findByIngredients?ingredients=apples,+flour,+sugar&number=2
 separate ingredients by commas and plus sign ',+'
 separate parameters with a '&' e.g. ingredients= and number=
 gets 5 basic recipes that includes the ingredients chicken, cheese and cord
 use recipe id from the recipe to get the detailed recipe information
*/

async function getRecipeIDs(ingredients) {
  const response = await fetch(`${urlRecipe}findByIngredients?apiKey=${apiKey}&ingredients=${ingredients}`);
  console.log("response= " + response);
  const recipeIDs = await response.json();
  console.log("recipeIDs= " + recipeIDs);
  return recipeIDs;
}

async function getRecipeFromID(recipeID) {
  const response = await fetch(`${urlRecipe}${recipeID}/information?apiKey=${apiKey}`);
  const recipes = await response.json();
  console.log("recipes" + recipes);
  return recipes;
}

function displayRecipesFromSearch(recipes) {
  console.log("logging recipes search");
  console.log(recipes);

  recipes.forEach((recipe) => {
    let recipeContainer = `
        <ul style="list-style-type: none">
            <li>${recipe.title}</li>
            <li><img src=${recipe.image} alt='image of '${recipe.title}/></li>
            <li>${recipe.likes} likes</li>
            <li>missing ${recipe.missedIngredientCount} ingredients
            <li>uses ${recipe.usedIngredientCount} of our ingredients
        </ul>
        `;
    mainContainer.insertAdjacentHTML("beforeend", recipeContainer);
  });
}

function displayIngredient(ingredient) {
  if (ingredient.match(lettersOnly)) {
    console.log("matching true");
    inputIngredient.className = inputIngredient.classList.remove("error");
    itemContainer = `
    <li class="ingredient">${ingredient}</li>
    `;
    ingredientsArr.push(ingredient);
    ingrContainer.insertAdjacentHTML("beforebegin", itemContainer);
  } else {
    console.log("matching - false");
    inputIngredient.className = inputIngredient.className + " error";
  }
}

function getInputIngredient() {
  let ingredient = inputIngredient.value;
  console.log("input= " + ingredient);
  inputIngredient.value = "";

  return ingredient;
}

function stringToSearch() {
  console.log("ingredientsArr" + ingredientsArr.join(",+"));
  return ingredientsArr.join(",+");
}

// Ingredients Input
btnAddIngredient.addEventListener("click", () => {
  displayIngredient(getInputIngredient());
  console.log(ingredientsArr);
});

//Search recipes with given ingredients
btnFindRecipe.addEventListener("click", async () => {
  let recipes = await getRecipeIDs(stringToSearch());
  if (recipes != "") {
    console.log(recipes);
    displayRecipesFromSearch(recipes);
  }
});
