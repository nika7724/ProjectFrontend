//Rest API to connect to back-end
const inventoryApi ='http://localhost:8080/inventory';
const itemDescriptionsApi='http://localhost:8080/itemDescriptions';

const inventoryTable = document.getElementById('inventory-table-body')
const dropDownInventory = document.getElementById('type-drop-down')

//Empty array to be filled with the Jason inventory objects
let inventoryArray;

//Create table
async function createTable(inventory) {
          createRow(inventory)
}

//Create table(row by row)
function createRow(inventory) {
    let rowCount = inventoryTable.rows.length;
    let row = inventoryTable.insertRow(rowCount)
    let cellCount = 0

//1st Column(Name)
    let cell = row.insertCell(cellCount++)
    cell.innerHTML = inventory.productName

//2nd Column(Type)
    cell = row.insertCell(cellCount++)
    cell.innerHTML = inventory.itemDescription.description

//3rd column(Quantity)
    cell = row.insertCell(cellCount++)
    let inputFieldUpdate = document.createElement('input')
    inputFieldUpdate.type = "number"
    inputFieldUpdate.value = inventory.productQuantity
    inputFieldUpdate.className = "inventoryTable"
    cell.appendChild(inputFieldUpdate)

    //4th column(To Order)
    cell = row.insertCell(cellCount++)
    /*let inputFieldOrderQuantity = document.createElement("input");
    inputFieldOrderQuantity.type = "number"
    inputFieldOrderQuantity.value = 0
    inputFieldOrderQuantity.className = "inventoryTable"
    cell.appendChild(inputFieldOrderQuantity)*/

    //5th column SaveButton
    cell = row.insertCell(cellCount++)
    let updateButton = document.createElement('button')
    updateButton.innerText = "Save"
    updateButton.className = "inventoryTable"
    cell.appendChild(updateButton);

    //5th column Update quantity: SaveButton
    updateButton.addEventListener('click', () => {
        if(inputFieldUpdate.value < inventory.productQuantity) {
            updateInventory(inventory, inputFieldUpdate.value);
        }
    })

//5th column DeleteButton
    let deleteButton = document.createElement('button')
    deleteButton.innerText = "Delete"
    deleteButton.className = "inventoryTable"
    cell.appendChild(deleteButton);

    //5th column Delete the raw DeleteButton
    deleteButton.addEventListener("click", function (evt) {
        deleteRequest(evt, inventory['id'], inventory).then(r => console.log(r));
    });
}

//Update the quantity
async function updateInventory(inventory, newQuantity) {
    inventory.productQuantity = newQuantity;
    await restUpdateInventory(inventory);
}

//PUT
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

//DELETE
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

/*const getPost = async  () =>{
    const response = await fetch(itemDescriptionsApi);
    console.log(response)
    const data = response.json();
    return data;
};*/
//Drop-down menu
const displayOption = async () => {
    const options =await fetchInventory(itemDescriptionsApi);
    for (option of options) {

        const newOption = document.createElement("option");
        console.log(option);
        newOption.id = option.description;
        newOption.value = option.description;
        newOption.text = option.description;
dropDownInventory.appendChild(newOption);
    }
};
displayOption();

/*function showByType() {
    var value = filteringType.options[filteringType.selectedIndex].value;
    console.log(value);
    let typeValue = "?itemDescription.description=" + value;
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
}*/

//Get Json array objects
async function fetchInventory(url) {
    return fetch(url).then(response => response.json())
}

//Populates an array of inventory and creates a table
async function doFetchInventory() {
    //clear()
    inventoryArray = await fetchInventory(inventoryApi)
    inventoryArray.forEach(createTable)
    console.log(inventoryArray)


    document.getElementById("create-button").onclick =function () {
        location.href='create-inventory.html';
    }
}