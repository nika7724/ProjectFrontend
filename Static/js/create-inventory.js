//Rest API to connect to back-end
const inventoryApi ='http://localhost:8080/inventory';
const saveInventory = document.getElementById('save-button')
const cancelInventory = document.getElementById('cancel-button')
const name = document.getElementById('product-name')
const type = document.getElementById('product-type')
const quantity = document.getElementById('product-quantity')


let newInventory =  {
    "productName": name.value,
    "productQuantity": quantity.value
}

let descriptionId

getAll("itemDescription").then(data => {
    console.log(data)
    data.forEach(itemDescription => {
        const option = document.createElement("option")
        option.setAttribute("value", itemDescription.id + "")
        option.innerText=itemDescription.description
        type.append(option)
    })
}).then(() => {
    const itemDescriptionPageId = new URLSearchParams(window.location.search).get('id')
    if(itemDescriptionPageId != null) {
        for(let i=0; i<type.options.length; i++) {
            let option = type.options[i]
            if(option.value==itemDescriptionPageId) {
                option.setAttribute('selected', 'selected')
            }
            option.setAttribute('disabled', 'disabled')
        }
    }
})


saveInventory.addEventListener('click', () =>{
    descriptionId = type.value
    newInventory.productName = name.value
    newInventory.productQuantity = quantity.value
    create(newInventory, "inventory").then(() =>
        createWithParam(newInventory, "inventory", ["id", descriptionId]).then(() => window.location.href = "inventory.html")
    )
})


async function getAll(resource) {
    return  fetch( inventoryApi+ '/')
        .then(response => response.json())
}

async function create(body,resource){
    return fetch(inventoryApi +'/', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(response => {
            if(response.status===200){
                return  response.json()
            }
            return response.status
        })
        .catch(err => console.log(err))

}

async function createWithParam(body,resource,[parameterName, parameterValue]){
    console.log(inventoryApi +'/' + "?" + parameterName + "=" + parameterValue)
    return fetch(inventoryApi + '/'+ "?" + parameterName + "=" + parameterValue, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(response => {
            if(response.status===201){
                return response.body
            }
        })
        .catch(err => console.log(err))
}
