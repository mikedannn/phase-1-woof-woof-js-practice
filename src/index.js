// VARIABLES
let dogsArray = []
let filtering = false




//DOM Elements
const dogBar = document.querySelector("#dog-bar")
const detailDiv = document.querySelector("#dog-info")    
const filterButton = document.querySelector("#good-dog-filter")   
    
    
//Event listeners    
// user clicks a dog in bar
// find the closest stable parent of element
// Event Listeners
filterButton.addEventListener("click", () => {
    filtering = !filtering
    filterButton.textContent = `Filter good dogs: ${filtering ? "ON" : "OFF"}`
    dogBar.innerHTML = ""
    if (filtering) {
        // only show good dogs
        const goodDogsOnly = dogsArray.filter(dog => dog.isGoodDog)
        renderAllDogs(goodDogsOnly)
    } else {
        renderAllDogs(dogsArray)
    }
})

dogBar.addEventListener("click", e => {
    if (e.target.tagName === "SPAN") {
        // show details of that dog 
        const dogId = parseInt(e.target.dataset.id)
        const foundDog = dogsArray.find(dog => dog.id === dogId)
        renderDogDetail(foundDog)
    }
})

detailDiv.addEventListener("click", e => {
    if (e.target.tagName === "BUTTON") {
        const dogId = parseInt(e.target.dataset.id)
        const foundDog = dogsArray.find(dog => dog.id === dogId)
        foundDog.isGoodDog = !foundDog.isGoodDog
        renderDogDetail(foundDog)

        fetch(`http://localhost:3000/pups/${dogId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ isGoodDog: foundDog.isGoodDog })
        })
    }
})

// Render Helpers
function renderDogDetail(dog) {
    const status = dog.isGoodDog ? "Good" : "Bad"
    detailDiv.innerHTML = `
        <img src=${dog.image} />
        <h2>${dog.name}</h2>
        <button data-id=${dog.id}> ${status} Dog!</button>
        `
}

function renderAllDogs(dogs) {
    dogs.forEach(renderDogSpan)
}

function renderDogSpan(dog) {
    const dogSpan = document.createElement("span")
    dogSpan.textContent = dog.name
    dogSpan.dataset.id = dog.id

    dogBar.append(dogSpan)
}




//Initial fetch / render

fetch("http://localhost:3000/pups") 
    .then(r => r.json())
    .then(actualDogs => {
        dogsArray = actualDogs
        renderAllDogs(dogsArray)
    })