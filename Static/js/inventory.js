//Rest API to connect to back-end//
const inventoryApi ='http://localhost:8080/inventory';
const itemDescriptionsApi='http://localhost:8080/itemDescriptions';

/* ========== Andrea ========== */
const itemDescriptionsByIdApi='http://localhost:8080/types';

//Table itself retrieved from the HTML document//
const inventoryTable = document.getElementById('inventory-table-body')
const dropDownInventory = document.getElementById('type-drop-down')

//Empty array to be filled with the Jason inventory objects//
let inventoryArray;
/* ========== Andrea ========== */
let descriptionArray;


//create table(row by row) using data from items//
function createRow(inventory) {
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
    /*let inputFieldOrderQuantity = document.createElement("input");
    inputFieldOrderQuantity.type = "number"
    inputFieldOrderQuantity.value = 0
    inputFieldOrderQuantity.className = "inventoryTable"
    cell.appendChild(inputFieldOrderQuantity)*/

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


/* ========== Andrea ========== */

/*
const displayOption = async () => {
    const options =await fetchInventory(itemDescriptionsApi);
    for (let i = 0; i < options.length; i++) {
        const newOption = document.createElement("option");
        newOption.id = [i];
        newOption.value = options[i].description;
        newOption.text = options[i].description;
        dropDownInventory.appendChild(newOption);
    }
        console.log(options)
};

 */

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


/*async function main() {
    const response = await fetch(itemDescriptionsApi);
    const data = await response.json();
    descriptions = data.descriptions;

    console.log
}*/

/*async function postFormDataAsJason(url, formData) {
    const inventoryPlainFormData = Object.fromEntries(formData.entries())
    let itemDescription = {
id: inventoryPlainFormData.id,
        description: inventoryPlainFormData.description
    }
    const formDataJsonString = JSON.stringify(itemDescription)

    const fetchOptions = {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: formDataJsonString
    }

    const response = await fetch(url, fetchOptions)

    if (!response.ok) {
        const errorMessage = await response.text()
        throw new Error(errorMessage)
    }

    return response.json()
}*/


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

/* ========== Andrea ========== */
async function filterOption() {
//    let selectedItem = document.getElementById("type-drop-down")
    let selectedItem = dropDownInventory
    await postItemId(itemDescriptionsByIdApi, selectedItem.value).then(response => {
        var table = document.getElementById("inventory-table-body")
        table.innerHTML = ""
        inventoryArray = response
        inventoryArray.forEach(createTable)
    })
    return selectedItem.value
}


/*
async function fetchInventory(url) {
    return fetch(url).then(response => response.json())
}

//Populates an array of inventory and creates a table
async function doFetchInventory(id) {
    //clear()
    id = filterOption()
    inventoryArray = await fetchInventory(itemDescriptionsByIdApi + "/" + id)
    inventoryArray.forEach(createTable)
    console.log(inventoryArray)


    document.getElementById("create-button").onclick =function () {
        location.href='create-inventory.html';
    }
}

 */
