const autoCompleteBox = document.getElementById("autoCompleteBox");

const autoIngredient = async (searchIngredient, inp) => {
  const res = await fetch(`https://api.spoonacular.com/food/ingredients/autocomplete?apiKey=${apiKey}&query=${searchIngredient}`);
  const ingredientsArr = await res.json();

  let listItems = ingredientsArr.map((e) => {
    let item = `<p>${e.name}</p>`;
    return item;
  });
  autoCompleteBox.innerHTML = listItems.join("");
  autoCompleteBox.addEventListener("click", (e) => {
    // let o = e.target;
    // console.log(e.target);
    txtIngredient.value = e.target.innerHTML;
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
