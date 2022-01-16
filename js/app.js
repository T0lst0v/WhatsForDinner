const apiKey = "a77214948c1b41d6a431b3f28497a02b";
const urlRecipe = "https://api.spoonacular.com/recipes/";
//fields
const mainContainer = document.querySelector("#mainContainer");
const inputIngredient = document.querySelector("#inputIngredient");
//buttons
const btnAddIngredient = document.querySelector("#btnAddIngredient");
const btnFindRecipe = document.querySelector("#btnFindRecipe");
const ingredientContainer = document.querySelector("#ingredientContainer");
const fullRecipeContainer = document.querySelector("#fullRecipeContainer");

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

// Fetching Ingredient ID
async function getRecipeIDs(ingredients) {
  const response = await fetch(`${urlRecipe}findByIngredients?apiKey=${apiKey}&ingredients=${ingredients}`);
  console.log("response= " + response);
  const recipeIDs = await response.json();
  console.log("recipeIDs= " + recipeIDs);
  return recipeIDs;
}

// Fetching Recipes of ID
async function getRecipeFromID(recipeID) {
  const response = await fetch(`${urlRecipe}${recipeID}/information?apiKey=${apiKey}`);
  console.log(`link is: ${urlRecipe}${recipeID}/information?apiKey=${apiKey}`);
  const recipes = await response.json();
  console.log("recipes: " + recipes);
  return recipes;
}

// Display Title and Picture of ID Recipe
function displayRecipesFromSearch(recipes) {
  console.log("logging recipes search");
  console.log(recipes);

  recipes.forEach((recipe) => {
    let recipeContainer = `
        <ul style="listOfTitles">
            <li>${recipe.title}</li>
            <li><img src=${recipe.image} alt='image of '${recipe.title}/></li>
            <li>${recipe.likes} likes</li>
            <li>missing ${recipe.missedIngredientCount} ingredients</li>
            <li>uses ${recipe.usedIngredientCount} of our ingredients</li>
            <button id="btnDisplayRecipe" onclick = "displayFullRecipe('${recipe.id}')">Show More</button>
        </ul>
        `;
    mainContainer.insertAdjacentHTML("beforeend", recipeContainer);
  });
}

// Display list of ingredients
function displayIngredient(ingredient) {
  if (ingredient.match(lettersOnly)) {
    console.log("matching true");
    inputIngredient.className = inputIngredient.classList.remove("error");
    let itemContainer = `
    <li class="ingredientLi" id="${ingredient}">
        <button class="ingredientInfo">&#8505;</button>
        <label class="ingredientText">${ingredient}</label>
        <button onclick = "removeIngredient('${ingredient}')">&times;</button>
    </li>
    `;
    ingredientsArr.push(ingredient);
    ingredientContainer.insertAdjacentHTML("beforeend", itemContainer);
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

// converting arr of Ingredients to string
function stringToSearch() {
  console.log("ingredientsArr: " + ingredientsArr.join(",+"));
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

//removing item from ingredients list
function removeIngredient(item) {
  ingredientContainer.removeChild(document.querySelector(`#${item}`));
  let i = ingredientsArr.indexOf(item);
  ingredientsArr.splice(i, 1);

  console.log(ingredientsArr);
}

async function displayFullRecipe(id) {
  let fullRecipeObj = await getRecipeFromID(id);

  let allIngredientsList = fullRecipeObj.extendedIngredients.map((e) => {
    return `<li class="recipeIngredientsList">${e.name}</li>`;
  });
  console.log("allIngredientsList = " + allIngredientsList);
  let fullRecipe = `
    <img src="${fullRecipeObj.image}"/>
    <h2>${fullRecipeObj.title}</h2>
    <ul>${allIngredientsList.join("")}</ul>
    <p class="readyInMinutes">Cook Time: ${fullRecipeObj.readyInMinutes} </p>
    <p class='instructions'>${fullRecipeObj.instructions}</p>
    <p class='summary'>${fullRecipeObj.summary}</p>
  `;
  fullRecipeContainer.innerHTML = fullRecipe;
  console.log(fullRecipeObj);
}
