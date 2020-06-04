/*
    The terms 'cars' and 'vehicles' are used almost interchangeably. Meaning doesn't matter
*/

// Constructor for car object
function Car(source, name, price, categories){
    this.url = source;
    this.name = name;
    this.price = '$ ' + price + 'K';
    this.categories = categories;
}

// cars :)
// *********** REQUIRED VARIABLES *******************
let bmw = new Car('./images/store/bmw-i8.jpg', "BMW i8", "400", ['sports', 'electric']);
let challenger = new Car('./images/store/challenger.jpg', "SRT Challenger", "35", ['oil', 'muscle']);
let electric = new Car('./images/store/electric-car.jpg', "Renault Electric", "30", ['electric']);
let excavator = new Car('./images/store/excavator.jpg', "Doosan Excavator", "225", ['oil']) ;
let lamborghini = new Car('./images/store/lamborghini.jpg', "Lamborghini Huracan", "240", ['sports', 'oil']);
let mercedes = new Car('./images/store/mercedes-amg.jpg', "Mercedes AMG", "60", ['sports', 'oil']);
let tesla = new Car('./images/store/tesla.jpg', "Tesla Model S", "55", ['electric', 'sports']);
let toyota = new Car('./images/store/toyota-suv.jpg', "Toyota SUV", "90", ['oil']);
let vin1 = new Car('./images/store/vintage-1.jpg', "Vintage Caddy", "35", ['oil', 'vintage']);
let vin2 = new Car('./images/store/vintage-2.jpg', "Vintage Beetle", "40",['oil', 'vintage']);
let vin3 = new Car('./images/store/vintage-3.jpg', "Vintage Alpine", "45",['oil', 'vintage']);
let vin4 = new Car('./images/store/vintage-4.jpg', "Vintage Muscle", "50",['oil', 'vintage', 'muscle']);

// array containing all of them
let vehicles = [
    bmw,
    challenger,
    electric,
    excavator,
    lamborghini,
    mercedes,
    tesla,
    toyota,
    vin1,
    vin2,
    vin3,
    vin4
]
for (vehicle of vehicles){
    vehicle.categories.push('all');
}

// categories
// card container
// "card" refers to flashcard like structure in which cars are contained
let categories = document.querySelectorAll('.categories li a');
let garage = document.querySelector('.garage-items');
let noResultMessage = document.querySelector('.no-results');

// ***********STORAGE SECTION***************
/*
    This map stores (Vehicle car, document.flashCard.car) 
    ie. key = Vehicle object returns corresponding 'garage-item' in the document
*/
let records = new Map();

function makeCard(vehicle){
    // main garage item
    let flashCard = document.createElement('div');
    flashCard.classList.add('garage-item');

    // img-container, wrapper
    let container = document.createElement('div');
    container.classList.add('img-container');
    container.classList.add('img-wrapper');

    let photo = document.createElement('img');
    photo.src = vehicle.url;
    container.appendChild(photo);

    flashCard.appendChild(container);

    // details
    let detail = document.createElement('div');
    detail.classList.add('item-detail');

    let name = document.createElement('p');
    name.classList.add("name");
    name.textContent = vehicle.name;
    detail.appendChild(name);

    let price = document.createElement('p');
    price.classList.add('price');
    price.textContent = vehicle.price;
    detail.appendChild(price);


    flashCard.appendChild(detail);
    records.set(vehicle, flashCard);

    return flashCard;
}

// ***********EVENT HANDLING*************

// helper function for the function below this
function isPresent(array, substring){
    for (string of array){
        if (string.indexOf(substring) > -1){
            return true;
        }
    }
    return false;
}

// Event handling for categories section
categories.forEach(category=> {
    category.onclick  = () =>{
        // remove background color from all other siblings and make it's background color black
        let grandParent = category.parentElement.parentElement;
        let list_items = grandParent.children;
        for (item of list_items){
            item.style.backgroundColor = "#fff";
            item.style.color = "#000";
            item.style.cursor = "pointer";
        }
        let parent = category.parentElement;
        // style it properly
        parent.style.backgroundColor = "#000";
        parent.style.color = "#0084ff";
        parent.style.borderRadius = "5px";


        // check for each flashcard if its category matches current category
        // display: none if not
        for (car of vehicles){
            // if the car does not have category attribute of current category
            let correspondingCard = records.get(car);
            if (!isPresent(car.categories, category.textContent.toLowerCase())){
                correspondingCard.style.display = "none";
            }
            else{
                correspondingCard.style.display = "block";
                noResultMessage.style.display = "none";
            }
        }
    };
});

// handling search of input
let inputElement = document.querySelector('.search-bar input');
let searchButton = document.querySelector('.search-bar .magnify');

searchButton.onclick = () =>{
    // unstyle the categories section
    for (item of categories){
        let parentLi = item.parentElement;
        parentLi.style.backgroundColor = "#fff";
        parentLi.style.color = "#000";
    }
    // do required stuff
    let searchText = inputElement.value.toLowerCase();

    let searchResults = 0;
    for (car of vehicles){
        let pseudoArray = [car.name.toLowerCase(),];
        if (isPresent(pseudoArray, searchText)){
            records.get(car).style.display = "block";
            searchResults += 1;
        }
        else{
            records.get(car).style.display = "none";
        }
    }

    if (!searchResults){
        // if no search results
        noResultMessage.style.display = "block";
    }
    else{
        noResultMessage.style.display = "none";
    }
}

// In the beginning: Show all items after page loads
// ************** INITIALIZER *************
function showAll(){
    for (car of vehicles){
        garage.appendChild(makeCard(car));
    }
    inputElement.value = '';
}

showAll();