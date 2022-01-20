const autoCompleteBox = document.getElementById("autoCompleteBox");

const autoIngredient = async (searchIngredient, inp) => {
  const res = await fetch(`https://api.spoonacular.com/food/ingredients/autocomplete?apiKey=${apiKey}&query=${searchIngredient}&number=20`);
  const ingredientsArr = await res.json();

  let listItems = ingredientsArr.map((e) => {
    let item = `<p>${e.name}</p>`;
    return item;
  });

  //  select from drop down on click
  autoCompleteBox.innerHTML = listItems.join("");
  autoCompleteBox.addEventListener("click", (e) => {
    txtIngredient.value = e.target.innerHTML;
  });

  // TODO: select with arrow keys + enter
  txtIngredient.addEventListener("keydown", (e) => {
    x = document.getElementById("autoCompleteBox");
    console.log(x);
    console.log(e.target);
  });
};

txtIngredient.addEventListener("input", () => {
  autoCompleteBox.style.display = "block";
  autoIngredient(txtIngredient.value);
  if (txtIngredient.value == "") {
    autoCompleteBox.style.display = "none";
    autoCompleteBox.innerHTML = "";
  }
});
