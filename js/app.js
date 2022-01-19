const apiKey = "88d877514e7d458aac097379c5a5ed83";
const urlRecipe = "https://api.spoonacular.com/recipes/";
//fields
const divRecipes = document.getElementById("divRecipes");
const txtIngredient = document.getElementById("txtAddIngredient");
//buttons
const btnAddIngredient = document.getElementById("btnAddIngredient");
const btnFindRecipe = document.getElementById("btnFindRecipes");
const ulIngredients = document.getElementById("ulIngredients");
const ingredientContainer = document.querySelector("#ingredientContainer");
// const divRecipes = document.querySelector("#divRecipes");
const btnCookAtHome = document.getElementById("btnCookAtHome");
const sldFilterRange = document.getElementById("rngFilter");
const lblRangeFilter = document.getElementById("lblRangeFilter");
//variables
const ingredientsArr = [];
const lettersOnly = /^[a-zA-Z]/g;

/*
 example GET for find by ingredients
 https://api.spoonacular.com/recipes/findByIngredients?ingredients=apples,+flour,+sugar&number=2
 separate ingredients by commas and plus sign ',+'
 separate parameters with a '&' e.g. ingredients= and number=
 gets 5 basic recipes that includes the ingredients chicken, cheese and cord
 use recipe id from the recipe to get the detailed recipe information
*/

// Fetching Ingredient ID
async function getRecipeIDs(ingredients, number) {
  let url = `${urlRecipe}findByIngredients?apiKey=${apiKey}&ingredients=${ingredients}&number=${number}`;
  console.log("ids url" + url);
  const response = await fetch(url);
  console.log("response= " + response);
  const recipeIDs = await response.json();
  return recipeIDs;
}

// Fetching Recipes of ID
async function getRecipeFromID(recipeID) {
  let url = `${urlRecipe}${recipeID}/information?apiKey=${apiKey}`;
  console.log(`Recipe from id link is: ${url}`);
  const response = await fetch(url);
  const recipes = await response.json();
  return recipes;
}

// Displaying Full recipe in separate div (need to make it as a Modal)
async function displayFullRecipe(id) {
  let fullRecipeObj = await getRecipeFromID(id);
  let allIngredientsList = fullRecipeObj.extendedIngredients.map((e) => {
    return `<li class="recipeIngredientsList">${e.original}</li>`;
  });
  console.log("allIngredientsList = " + allIngredientsList);
  divRecipes.innerHTML = `
    <img src="${fullRecipeObj.image}" alt="${fullRecipeObj}"/>
    <h2>${fullRecipeObj.title}</h2>
    <ul>${allIngredientsList.join("")}</ul>
    <p class="readyInMinutes">Cook Time: ${fullRecipeObj.readyInMinutes} </p>
    <p class='instructions'>${fullRecipeObj.instructions}</p>
    <p class='summary'>${fullRecipeObj.summary}</p>
  `;
  console.log(fullRecipeObj);
}

// Display Title and Picture of ID Recipe
function displayRecipesFromSearch(recipes) {
  console.log("logging recipes search");
  console.log(recipes);
  divRecipes.innerHTML = "";
  recipes.forEach((recipe) => {
    let recipeContainer = `
        <ul style="listOfTitles">&times;
            <li>${recipe.title}</li>
            <li><img src=${recipe.image} alt='image of '${recipe.title}/></li>
            <li>${recipe.likes} likes</li>
            <li>missing ${recipe.missedIngredientCount} ingredients</li>
            <li>uses ${recipe.usedIngredientCount} of our ingredients</li>
            <button id="btnDisplayRecipe" onclick = "displayFullRecipe('${recipe.id}')">Show More</button>
        </ul>
        `;
    divRecipes.insertAdjacentHTML("beforeend", recipeContainer);
  });
}

// Display list of ingredients
function displayIngredient(ingredient) {
  if (!ingredient.match(lettersOnly)) {
    console.log("matching - false");
    txtIngredient.className = txtIngredient.className + " error";
    return;
  }
  txtIngredient.classList.remove("error");
  console.log("matching true");
  let newIngredientLi = `
    <li class="liIngredient" id="${ingredient}">
        ${ingredient}
        <img src="images/x_mark.png" class="removeImage" onclick = "removeIngredient('${ingredient}')" 
            alt="remove ingredient clickable image button"/>
    </li>`;

  ingredientsArr.push(removeSpaces(ingredient));
  ulIngredients.insertAdjacentHTML("beforeend", newIngredientLi);
}

//removing item from ingredients list
function removeIngredient(item) {
  console.log(`removed: ${item}`);
  ulIngredients.removeChild(document.querySelector(`#${item}`));
  let i = ingredientsArr.indexOf(item);
  ingredientsArr.splice(i, 1);

  console.log(ingredientsArr);
}

// grabs input from text box
function getInputIngredient() {
  let ingredient = txtIngredient.value;
  console.log("input= " + ingredient);
  txtIngredient.value = "";
  return ingredient;
}

// converting arr of Ingredients to string
function stringToSearch() {
  console.log("ingredientsArr: " + ingredientsArr.join(",+"));
  return ingredientsArr.join(",+");
}

// trim and replace spaces in input of more than 1 word
function removeSpaces(val) {
  let noSpaces = val.trim(); //extra step if space needed to be replaced (not just removed)
  return noSpaces.split(" ").join("+");
}

// Ingredients Input on Click
btnAddIngredient.addEventListener("click", () => {
  displayIngredient(getInputIngredient());
  console.log(ingredientsArr);
});

// Ingredients Input on Enter Key
txtIngredient.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    btnAddIngredient.click();
  }
});

//Search recipes with given ingredients
btnFindRecipe.addEventListener("click", async () => {
  if (ingredientsArr == "") {
    console.log("empty");
    return;
  }
  let number = sldFilterRange.value;
  console.log("sending number = " + number);
  let recipes = await getRecipeIDs(stringToSearch(), number);
  if (recipes !== "") {
    console.log("recipes=" + recipes);
    divRecipes.style.display = "block";
    displayRecipesFromSearch(recipes);
  } else {
    console.log("empty arr");
  }
});

// Cook at home shows ingredient div ( hides main button div )
btnCookAtHome.addEventListener("click", () => {
  //   let divButton = document.getElementById("divButtons");
  //   divButton.style.display = "none";
  let divIngredients = document.getElementById("divIngredients");
  divIngredients.style.display = "block";
});

// update label with slider value for number of recipes to return in search
sldFilterRange.addEventListener("input", function () {
  lblRangeFilter.innerHTML = this.value;
  console.log(this.value);
});
