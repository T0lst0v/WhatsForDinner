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
const fullRecipeContainer = document.querySelector("#fullRecipeContainer");
const btnCookAtHome = document.getElementById("btnCookAtHome");
const sldFilterRange = document.getElementById("rngFilter");
const lblRangeFilter = document.getElementById("lblRangeFilter");
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
    const response = await fetch(`${urlRecipe}findByIngredients?apiKey=${apiKey}&ingredients=${ingredients}&number=10`);
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

// Displaying Full recipe in separate div (need to make it as a Modal)
async function displayFullRecipe(id) {
    let fullRecipeObj = await getRecipeFromID(id);
    let allIngredientsList = fullRecipeObj.extendedIngredients.map((e) => {
        return `<li class="recipeIngredientsList">${e.name}</li>`;
    });
    console.log("allIngredientsList = " + allIngredientsList);
    fullRecipeContainer.innerHTML = `
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
        divRecipes.insertAdjacentHTML("beforeend", recipeContainer);
    });
}

/// Display list of ingredients
function displayIngredient(ingredient) {
<<<<<<< HEAD
  if (!ingredient.match(lettersOnly)) {
    console.log("matching - false");
    inputIngredient.className = inputIngredient.className + " error";
    return;
  }
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
=======
    if (!ingredient.match(lettersOnly)) {
        console.log("matching - false");
        txtIngredient.className = txtIngredient.className + " error";
        return;
    }

    console.log("matching true");
    let newIngredientLi = `
    <li class="liIngredient" id="${ingredient}">
        ${ingredient}
        <img src="../images/x_mark.png" class="removeImage" onclick = "removeIngredient('${ingredient}')" 
            alt="remove ingredient clickable image button"/>
    </li>`;
    ingredientsArr.push(ingredient);
    ulIngredients.insertAdjacentHTML("beforeend", newIngredientLi);
}

//removing item from ingredients list
function removeIngredient(item) {
    console.log(`removed: ${item}`);
    ulIngredients.removeChild(document.querySelector(`#${item}`));
    let i = ingredientsArr.indexOf(item);
    ingredientsArr.splice(i, 1);

    console.log(ingredientsArr);
>>>>>>> a01ceedeead7fafd72defd5437b26ed31d20db88
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

// Ingredients Input on Click
btnAddIngredient.addEventListener("click", () => {
    displayIngredient(getInputIngredient());
    console.log(ingredientsArr);
});

// Ingredients Input on Enter Key
txtIngredient.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        btnAddIngredient.click();
    }
});

//Search recipes with given ingredients
btnFindRecipe.addEventListener("click", async () => {
    let recipes = await getRecipeIDs(stringToSearch());
    if (recipes !== "") {
        console.log(recipes);
        divRecipes.style.display = 'block'
        displayRecipesFromSearch(recipes);
    }
});

// Cook at home, hides main button div and shows ingredient div
btnCookAtHome.addEventListener('click', () => {
    let divButton = document.getElementById("divButtons");
    divButton.style.display = 'none';
    let divIngredients = document.getElementById("divIngredients");
    divIngredients.style.display = 'block';
})

// update label with slider value for number of recipes to return in search
sldFilterRange.addEventListener('input', function() {
    lblRangeFilter.innerHTML = this.value;
})