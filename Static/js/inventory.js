//Rest API to connect to back-end
const inventoryApi ='http://localhost:8080/inventory';

//Table itself retrieved from the HTML document
const inventoryTable = document.getElementById('inventory-table-body')

const filteringType = document.getElementById('type-drop-down')

//Empty array to be filled with the Jason inventory objects
let inventoryArray;

//creates a table taking data from inventoryArray
async function createTable(inventory) {
    if (filteringType.value === "All") {
        createRow(inventory)
    }
    else if(inventory.itemDescription === filteringType.value)
    {
        createRow(inventory)
    }
}

//create table(row by row) using data from items
function createRow(inventory) {
    let rowCount = inventoryTable.rows.alength;
    let row = inventoryTable.insertRow(rowCount)
    let cellCount = 0

//inserting each cell of the 1st Column(Name)
    let cell = row.insertCell(cellCount++)
    cell.innerHTML = inventory.productName

//inserting each cell of the 2nd Column(Type)
    cell = row.insertCell(cellCount++)
    cell.innerHTML = inventory.itemDescription.description

//inserting each cell of 3rd column(Quantity)
    cell = row.insertCell(cellCount++)
    let inputFieldUpdate = document.createElement('input')
    inputFieldUpdate.type = "number"
    inputFieldUpdate.value = inventory.productQuantity
    inputFieldUpdate.className = "inventoryTable"
    cell.appendChild(inputFieldUpdate)

    //inserting each cell of 4th column(To Order)
    cell = row.insertCell(cellCount++)
    /*let inputFieldOrderQuantity = document.createElement("input");
    inputFieldOrderQuantity.type = "number"
    inputFieldOrderQuantity.value = 0
    inputFieldOrderQuantity.className = "inventoryTable"
    cell.appendChild(inputFieldOrderQuantity)*/

    //inserting each cell of 5th column a save button to update the quantity
    cell = row.insertCell(cellCount)
    let updateButton = document.createElement('button')
    updateButton.innerText = "Save"
    updateButton.className = "inventoryTable"
    cell.appendChild(updateButton);

    // update button from 5th column to update quantity
    updateButton.addEventListener('click', () => {
        if(inputFieldUpdate.value < inventory.itemDescription.description) {
            updateInventory(inventory, inputFieldUpdate.value);
        }
    })
//delete button
    let deleteButton = document.createElement('button')
    deleteButton.innerText = "Delete"
    deleteButton.className = "inventoryTable"
    cell.appendChild(deleteButton);

    deleteButton.addEventListener("click", function (evt) {
        deleteRequest(evt, inventory['id'], inventory).then(r => console.log(r));
    });

}

function showByType() {
    var value = filteringType.options[filteringType.selectedIndex].value;
    console.log(value);
    let typeValue = "?itemDescription.description" + value;
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: inventoryApi + typeValue,
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (data) {
            console.log(data);
            // clear();
        },
        error: function (e) {
            console.log(e);
        }
    });
}



//update the quantity.
async function updateInventory(inventory, newQuantity) {
    inventory.productQuantity = newQuantity;
    await restUpdateInventory(inventory);
}

//sends the PUT request with the new info attached in the body
async function restUpdateInventory(inventory) {
    const url = inventoryApi + "/" + inventory.itemDescription.id;
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



//===== gets the json array objects =====
async function fetchInventory(url) {
    return fetch(url).then(response => response.json())
}

//=====populates an array of inventory and creates a table=====
async function doFetchInventory() {
    //clear()
    inventoryArray = await fetchInventory(inventoryApi)
    inventoryArray.forEach(createTable)

    document.getElementById("create-button").onclick =function () {
        location.href='create-inventory.html';
    }

    filteringType.addEventListener('change', doFetchInventory)

}