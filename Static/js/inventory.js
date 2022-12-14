//Rest API to connect to back-end//
const inventoryApi ='http://localhost:8080/inventory';
const itemDescriptionsApi='http://localhost:8080/itemDescriptions';
const itemDescriptionsByIdApi='http://localhost:8080/types';
const burgerPredictionApi = 'http://localhost:8080/api/burger-prediction';
const orderProductApi ='http://localhost:8080/orderProduct';

//Table itself retrieved from the HTML document//
const inventoryTable = document.getElementById('inventory-table-body')
const dropDownInventory = document.getElementById('type-drop-down')
const showAllButton = document.getElementById('show-all-type-button')

//Empty array to be filled with the Jason inventory objects//
let inventoryArray;
const dailyPrediction = "";


let today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
let yyyy = today.getFullYear();
today = `${yyyy}-${mm}-${dd}`;


//create table(row by row) using data from items//
async function createRow(inventory) {
    let rowCount = inventoryTable.rows.length;
    let row = inventoryTable.insertRow(rowCount)
    let cellCount = 0

//inserting 1st Column(Name)//
    let cell = row.insertCell(cellCount++)
    cell.innerHTML = inventory.productName

//inserting 2nd Column(Type)//
    cell = row.insertCell(cellCount++)
    cell.innerHTML = inventory.itemDescription.description

//inserting 3rd column(Quantity)//
    cell = row.insertCell(cellCount++)
    let inputFieldUpdate = document.createElement('input')
    inputFieldUpdate.type = "number"
    inputFieldUpdate.value = inventory.productQuantity
    inputFieldUpdate.className = "inventoryTable"
    cell.appendChild(inputFieldUpdate)

    //inserting 4th column(To Order)//
    cell = row.insertCell(cellCount++)
    cell.innerHTML = await calculateOrderProduct(inventory.productName)

    //inserting each cell of 5th column SaveButton for updating quantity//
    cell = row.insertCell(cellCount++)
    let updateButton = document.createElement('button')
    updateButton.innerText = "Save"
    updateButton.className = "inventoryTable"
    cell.appendChild(updateButton);

    //inserting each cell of 5th column DeleteButton//
    let deleteButton = document.createElement('button')
    deleteButton.innerText = "Delete"
    deleteButton.className = "inventoryTable"
    cell.appendChild(deleteButton);

    //Update button from 5th column to update quantity//
    updateButton.addEventListener('click', () => {
        if(inputFieldUpdate.value >= 0) {
            updateInventory(inventory, inputFieldUpdate.value);
        }
    })

    //Delete button from 5th column to delete the raw//
    deleteButton.addEventListener("click", function (evt) {
        deleteRequest(evt, inventory['id'], inventory).then(r => console.log(r));
    });
}

//Creates a table taking data from inventoryArray//
async function createTable(inventory) {
    createRow(inventory)
}

//Update the quantity//
async function updateInventory(inventory, newQuantity) {
    inventory.productQuantity = newQuantity;
    await restUpdateInventory(inventory);
}

//Sends the PUT request with the new info attached in the body//
async function restUpdateInventory(inventory) {
    const url = inventoryApi + "/" + inventory.id;
    const fetchOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: ""
    }
    const jsonString = JSON.stringify(inventory);
    fetchOptions.body = jsonString;
    const response = await fetch(url, fetchOptions)
    //return jsonString;
}

//DELETE//
async function deleteRequest(evt, id) {
    const fetchOptions = {
        method: "DELETE",
        headers: {
            "Content-type": "application/json"
        },
        body: ""
    }
    const response = await fetch(inventoryApi + "/" + id, fetchOptions);

    // Refresh page on reload
    if (response.ok) {
        document.location.reload();
    }
    return response;
}


async function postItemId(url, id) {
    let itemDescription = {
        id: id

    }
    const idData = JSON.stringify(itemDescription);
    const fetchOptions = {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: idData
    }

    const response = await fetch(url + "/" + id, fetchOptions)

    if (!response.ok){
        const errorMessage = await response.text()
        throw new Error(errorMessage)
    }

    return response.json()

}

/*const fetchOptions = {
    method: 'POST',
    headers: {
        "Content-type": "application/json"
    },
    body: ""
}

fetchOptions.body = JSON.stringify(numberOfOrder)

const response = await fetch(orderProductApi, fetchOptions)



if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(errorMessage)
}*/



//Drop-down menu//
const getPost = async  () =>{
    const response = await fetch(itemDescriptionsApi);
    console.log(response)
    const data = response.json();
    return data;
};

const displayOption = async () => {
    const options =await getPost();
    let i = 1;
    for (option of options) {

        const newOption = document.createElement("option");
        console.log(option);
        newOption.id = option.id;
        newOption.value = i;
        i++
        newOption.text = option.description;
        dropDownInventory.appendChild(newOption);
    }
    console.log(options)
};

displayOption();


//Gets the json array objects//
async function fetchInventory(url) {
    return fetch(url).then(response => response.json())
}

//Populates an array of inventory and creates a table//
async function doFetchInventory() {
    //clear()
    inventoryArray = await fetchInventory(inventoryApi)
    inventoryArray.forEach(createTable)
    console.log(inventoryArray)

    document.getElementById("create-button").onclick =function () {
        location.href='create-inventory.html';
    }
}

async function filterOption() {
    let selectedItem = dropDownInventory
    await postItemId(itemDescriptionsByIdApi, selectedItem.value).then(response => {
        var table = document.getElementById("inventory-table-body")
        table.innerHTML = ""
        inventoryArray = response
        inventoryArray.forEach(createTable)
    })
    return selectedItem.value
}

async function showAll() {
    inventoryArray = await fetchInventory(inventoryApi)
    clear()
    inventoryArray.forEach(createTable)
    console.log(inventoryArray)
}

showAllButton.addEventListener('click', showAll)

async function clear() {
    $(".inventory-table").find("tr:not(:first)").remove();
}

async function getBurgerPrediction(burgerPredictionApi) {
    const response = await fetch(burgerPredictionApi);
    const data = await response.json();
    let prediction = ""
    for (let i = 0; i < data.length; i++) {
        if (data[i].date === today) {
            prediction = data[i].prediction
            console.log(prediction)
        }
    }
    return prediction
}

async function getStock(url) {
    const stockResponse = await fetch(url);
    const stockData = await stockResponse.json();
    let stock = []
    for (let i = 0; i < stockData.length; i++) {
        stock.push(stockData[i])
        console.log(stock)
    }
    return stock
}

async function calculateOrderProduct(product) {
    let prediction = await getBurgerPrediction(burgerPredictionApi)
    let stock = await getStock(inventoryApi)
    let numberOfOrder
    for (let i = 0; i < stock.length; i++) {
        if (stock[i].productName.includes(product)) {
            switch (product) {
                default:
                    console.log("default case")
                    break
                case 'tomato':
                    console.log("we're in case tomatoes")
                    numberOfOrder = (prediction * 0.1) - stock[i].productQuantity
                    return numberOfOrder
                case 'onion':
                    console.log(" we're in case onions")
                    numberOfOrder = (prediction * 0.05) - stock[i].productQuantity
                    console.log(product)
                    return numberOfOrder
                case 'pickle':
                    console.log("we're in case pickles")
                    numberOfOrder = (prediction * 0.2) - stock[i].productQuantity
                    console.log(product)
                    return numberOfOrder

                case 'cheese':
                    console.log("we're in case cheese")
                    numberOfOrder = (prediction * 0.4) - stock[i].productQuantity
                    console.log(product)
                    return numberOfOrder
            }
        }
    }
    return numberOfOrder
}




