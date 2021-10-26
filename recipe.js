const input = document.getElementById("search-recipes");
const buscar_receta = document.getElementById("search-recipe");
const fila_entrada = document.getElementById("myFileInput");
const actual = document.getElementById("current");
const clase_Actual = document.getElementsByClassName("current")[0];
const publicar_receta_btn = document.getElementById("publish-recipe");
const ver_tarjeta_receta = document.getElementsByClassName("view-recipe-card")[0];
const my_recipe_cards = document.getElementsByClassName("my-recipe-cards")[0];
const saved_recipe_cards = document.getElementsByClassName("saved-recipe-cards")[0];
const search_recipe_cards = document.getElementsByClassName("search-recipe-cards")[0];
const dot = document.getElementById("dot");
const myname = document.getElementById("myname");
let cargar_imgen = '';
let colorWell;
let ver_receta_array = sessionStorage.getItem('viewRecipe') ? JSON.parse(sessionStorage.getItem('viewRecipe')) : [];
let mis_rcts_array = localStorage.getItem('myRecipes') ? JSON.parse(localStorage.getItem('myRecipes')) : [];
let savedRecipesArray = localStorage.getItem('recipes') ? JSON.parse(localStorage.getItem('recipes')) : [];
let buscar_recetasArray = sessionStorage.getItem('search') ? JSON.parse(sessionStorage.getItem('search')) : [];
let color_defecto = sessionStorage.getItem('color') ? JSON.parse(sessionStorage.getItem('color')) : "#20b2aa";

// Change the color of widgets to default color at window load------// Cambia el color de los widgets al color predeterminado al cargar la ventana
cargar_color_defecto = () => {
  if(actual)
    actual.style.backgroundColor = color_defecto;
  if(clase_Actual)
    clase_Actual.style.color = color_defecto;
  if(dot)
    dot.style.color = color_defecto;
  if(myname)
    myname.style.color = color_defecto;
  if(ver_tarjeta_receta)
    ver_tarjeta_receta.style.color = color_defecto;
  if(publicar_receta_btn)
    publicar_receta_btn.style.backgroundColor = color_defecto;
  if(my_recipe_cards)
    my_recipe_cards.style.color = color_defecto;
  if(saved_recipe_cards)
    saved_recipe_cards.style.color = color_defecto;
  if(search_recipe_cards)
    search_recipe_cards.style.color = color_defecto;
}

window.addEventListener("load", cargar_color_defecto);

// Enable the use of color selection
startup = () => {
  colorWell = document.querySelector("#colorWell");
  colorWell.value = color_defecto;
  colorWell.addEventListener("input", updateFirst, false);
  colorWell.select();
}

window.addEventListener("load", startup);

// Change the default color of widgets in real time
updateFirst = (event) => {
  if(actual)
    actual.style.backgroundColor = event.target.value;
  if(clase_Actual)
    clase_Actual.style.color = event.target.value;
  if(dot)
    dot.style.color = event.target.value;
  if(myname)
    myname.style.color = event.target.value;
  if(ver_tarjeta_receta)
    ver_tarjeta_receta.style.color = event.target.value;
  if(publicar_receta_btn)
    publicar_receta_btn.style.backgroundColor = event.target.value;
  if(my_recipe_cards)
    my_recipe_cards.style.color = event.target.value;
  if(saved_recipe_cards)
    saved_recipe_cards.style.color = event.target.value;
  if(search_recipe_cards)
    search_recipe_cards.style.color = event.target.value;
  
  color_defecto = event.target.value;
  sessionStorage.setItem('color', JSON.stringify(color_defecto));
}

// Create recipe cards ( as needed for each html page )
ver_receta_array.forEach(viewRecipeCardMaker);
mis_rcts_array.forEach(myRecipeCardMaker);
savedRecipesArray.forEach(savedRecipeCardMaker);
buscar_recetasArray.forEach(buscar_recetaCardMaker);

// Allow the user to click the enter key on input box
if(input){
  input.addEventListener('keydown', (event) => {
    if(event.key == "Enter"){
      request();
    }
  });
};

// Convert the user uploaded image into a data URL. This will allow us to save it in local storage
if(fila_entrada){
  fila_entrada.addEventListener('change', function(){
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      cargar_imgen = reader.result;
    });
    reader.readAsDataURL(this.files[0]);
  });
}

// Call publish_recipe function when clicking publish recipe button
// JQUERY
// if($("#publish-recipe")){
//   $("#publish-recipe").on("click", publish_recipe);
// }
// NO JQUERY
if(publicar_receta_btn){
  publicar_receta_btn.addEventListener("click", () => {
    publish_recipe();
  });
}

// Save the data of the recipe you created in the "Add recipe" page ( in local storage )
publish_recipe = () => {
  const recipeName = document.getElementById("name");
  const description = document.getElementById("description");
  const ingredients = document.getElementById("ingredients");
  const instructions = document.getElementById("instructions");
  if(recipeName.value != '' && description.value != '' && ingredients.value != '' && instructions.value != ''){
    let recipe_info = {
      'img'  : cargar_imgen,
      'name' : recipeName.value,
      'description' : description.value,
      'ingredients' : ingredients.value,
      'instructions' : instructions.value
    }
    mis_rcts_array.push(recipe_info);
    localStorage.setItem('myRecipes', JSON.stringify(mis_rcts_array));
    document.querySelector('#myFileInput').value = '';
    recipeName.value = '';
    description.value = '';
    ingredients.value = '';
    instructions.value = '';
  }
  else{
    alert("Please complete the fields");
  }
}

// Use the data you saved in the publish_recipe function to create recipe cards for the "My recipes" page
function myRecipeCardMaker(text) {
  if(my_recipe_cards){
    let card = document.createElement('div');
    let delBtn = document.createElement('div');
    let i = document.createElement('i');

    delBtn.className = "del-btn";
    i.className = "fas fa-trash";

    card.className = 'card';
    card.innerHTML = '<div class="images" style="background-image: url('+text.img+');"></div>' +
    '<div class="name">' +
      '<h1>'+text.name+'</h1>' +
    '</div>' +
    '<div class="other">' +
      '<p><span>Description: </span><br>'+text.description+'</p>' +
      '<p><span>Ingredients: </span><br>'+text.ingredients+'</p>' +
      '<p><span>Instructions: </span><br>'+text.instructions+'</p>' +
      '<a href="view-recipe.html" style="color:blue;cursor:pointer;" onclick="view_recipe(\'' +text.img+ '\' , \''+text.name+'\' , \'' +text.description+ '\' , \''+text.ingredients+'\' , \''+text.instructions+'\')">View more</a>' +
    '</div>';

    delBtn.appendChild(i);
    card.appendChild(delBtn);
    my_recipe_cards.appendChild(card); 

    delBtn.addEventListener("click", () => {
      delMyRecipe(text.img, text.name, text.description, text.ingredients, text.instructions);
    });
  }   
}

// Delete a recipe from the "My recipes" page ( by clicking the trash button )
delMyRecipe = (img, name, description, ingredients, instructions) => {
  let index = mis_rcts_array.findIndex(x => x.img === img && x.name === name && x.description === description && x.ingredients === ingredients && x.instructions === instructions);
  mis_rcts_array.splice(index, 1);
  localStorage.setItem('myRecipes', JSON.stringify(mis_rcts_array));
  location.reload();
}

// Save the recipe data for the "View recipe" page in session storage ( by clicking on the "view more" hyperlink)
view_recipe = (img, name, description, ingredients, instructions) => {
  let recipe_info = {
  'img'  : img,
  'name' : name,
  'description' : description,
  'ingredients' : ingredients,
  'instructions' : instructions
  }
  ver_receta_array = [];
  sessionStorage.setItem('viewRecipe', JSON.stringify(ver_receta_array))
  ver_receta_array.push(recipe_info);
  sessionStorage.setItem('viewRecipe', JSON.stringify(ver_receta_array))
}

// Use the saved data from the view_recipe function to create a "big" recipe card for the "View recipe" page
function viewRecipeCardMaker(text){
  if(ver_tarjeta_receta){
    let card = document.createElement('div');
    card.className = 'big-card';
    card.innerHTML = '<div class="big-image" style="background-image: url('+text.img+');"></div>' +
    '<div class="name">' +
      '<h1>'+text.name+'</h1>' +
    '</div>' +
    '<div class="view-other">' +
      '<p><span>Description: </span><br>'+text.description+'</p>' +
      '<p><span>Ingredients: </span><br>'+text.ingredients+'</p>' +
      '<p><span>Instructions: </span><br>'+text.instructions+'</p>' +
    '</div>';
    ver_tarjeta_receta.appendChild(card);
  } 
}

// Use the recipe API to search for recipes ( in the "Search recipes" page)
request = () => {
  fetch("https://edamam-recipe-search.p.rapidapi.com/search?q="+input.value+"", {
	"method": "GET",
	"headers": {
    //GO TO RAPIDAPI.COM AND LOOK FOR THE EDAMAN RECIPE SEARCH AND DIET API TO GET YOUR API KEY. COPY AND PASTE IT BELOW!
		"x-rapidapi-key": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
		"x-rapidapi-host": "edamam-recipe-search.p.rapidapi.com"
	  }
  })

  .then(response => {
    if(response.ok)
      return response.json();
    else
      alert("Error :" + response.status);
  })

  .then(data => {
    recipe_card(data);
  });
}

// Save the recipe data returned by the recipe API in session storage
recipe_card = (data) => {
  buscar_recetasArray = [];
  search_recipe_cards.innerHTML = '';
  sessionStorage.setItem('search', JSON.stringify(buscar_recetasArray));
  for(let i = 0;i < 9;i++){
    let recipe_info = {
      'img'  : data.hits[i].recipe.image,
      'name' : data.hits[i].recipe.label,
      'calories' : data.hits[i].recipe.calories,
      'cautions' : data.hits[i].recipe.cautions,
      'dietLabels' : data.hits[i].recipe.dietLabels,
      'healthLabels' : data.hits[i].recipe.healthLabels,
      'ingredients' : data.hits[i].recipe.ingredientLines,
      'url'  : data.hits[i].recipe.shareAs
    }
    buscar_recetasArray.push(recipe_info);
    sessionStorage.setItem('search', JSON.stringify(buscar_recetasArray));
    buscar_recetaCardMaker(buscar_recetasArray[buscar_recetasArray.length - 1]);
  }
  input.value = '';
}

// use the data you saved in the recipe_card() function to create recipe cards for the "Search recipes" page
function buscar_recetaCardMaker(text){
  if(search_recipe_cards){
    let card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = '<div class="images" style="background-image: url('+text.img+');"></div>' +
    '<div class="name">' +
      '<h1>'+text.name+'</h1>' +
    '</div>' +
    '<div class="other">' +
      '<p><span>Calories: </span>'+text.calories.toFixed(0)+'</p>' +
      '<p><span>Cautions: </span>'+text.cautions+'</p>' +
      '<p><span>Diet Labels: </span>'+text.dietLabels+'</p>' +
      '<p><span>Health Labels: </span><br>'+text.healthLabels+'</p>' +
      '<p><span>Ingredients: </span><br>'+text.ingredients+'</p>' +
      '<a href='+text.url+' target="_blank">Instructions</a>' +
    '</div>' +
    '<div class="save-btn">' +
      '<i class="fas fa-save" onclick="save_recipe(\'' +text.img+ '\' , \''+text.name+'\' , \'' +text.calories.toFixed(0)+ '\' , \''+text.cautions+'\' , \''+text.dietLabels+'\' , \''+text.healthLabels+'\' , \''+text.ingredients+'\' , \''+text.url+'\')"></i>' +
    '</div>';
    search_recipe_cards.appendChild(card);
  }
}

// Save the data of a recipe from the search you made in local storage ( by clicking the save button )
save_recipe = (img, name, calories, cautions, dietLabels, healthLabels, ingredients, url) => {
  let recipe_info = {
    'img'  : img,
    'name' : name,
    'calories' : calories,
    'cautions' : cautions,
    'dietLabels' : dietLabels,
    'healthLabels' : healthLabels,
    'ingredients' : ingredients,
    'url'  : url
  }
  savedRecipesArray.push(recipe_info);
  localStorage.setItem('recipes', JSON.stringify(savedRecipesArray));
}

// Use the data you saved in the save_recipe() function to create a recipe card in the "Saved recipes" page
function savedRecipeCardMaker(text){
  if(saved_recipe_cards){
    let card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = '<div class="images" style="background-image: url('+text.img+');"></div>' +
    '<div class="name">' +
      '<h1>'+text.name+'</h1>' +
    '</div>' +
    '<div class="other">' +
      '<p><span>Calories: </span>'+text.calories+'</p>' +
      '<p><span>Cautions: </span>'+text.cautions+'</p>' +
      '<p><span>Diet Labels: </span>'+text.dietLabels+'</p>' +
      '<p><span>Health Labels: </span><br>'+text.healthLabels+'</p>' +
      '<p><span>Ingredients: </span><br>'+text.ingredients+'</p>' +
      '<a href='+text.url+' target="_blank">Instructions</a>' +
    '</div>' +
    '<div class="del-btn">' +
      '<i class="fas fa-trash" onclick="delSavedRecipe(\'' +text.img+ '\' , \''+text.name+'\' , \'' +text.calories+ '\' , \''+text.cautions+'\' , \''+text.dietLabels+'\' , \''+text.healthLabels+'\' , \''+text.ingredients+'\' , \''+text.url+'\')"></i>' +
    '</div>';
    saved_recipe_cards.appendChild(card);    
  }
}

// delete a recipe card from the "Saved recipes" page ( by clicking the trash button )
delSavedRecipe = (img, name, calories, cautions, dietLabels, healthLabels, ingredients, url) => {
  let index = savedRecipesArray.findIndex(x => x.img === img && x.name === name && x.calories === calories && x.cautions === cautions && x.dietLabels === dietLabels && x.url === url);
  savedRecipesArray.splice(index, 1);
  localStorage.setItem('recipes', JSON.stringify(savedRecipesArray));
  location.reload();
}