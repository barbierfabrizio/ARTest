AFRAME.registerComponent('clicker', { // click on intrest point
    init: function () {
        this.el.addEventListener('click', e => {
            onClickIntrestPoint(this.el.parentEl.components["gps-new-entity-place"].attrValue.latitude + 0.001, this.el.parentEl.components["gps-new-entity-place"].attrValue.longitude, this.el.id)  // get from db later
        });
    }
});

// get from db later
function loadPlaces() { // actions
    return [
        {
            lat: 51.172332507322935,
            lon: 4.140010936583743,
            id: "0",
        },
        {
            lat: 51.17191571343433,
            lon: 4.139128065474563,
            id: "1",
        },
    ]
}

function loadGltfModelsOfAction() { // get from db later
    return [
        {
            lat: 51.17232121053396,
            lon: 4.140005246759172,
            height: -150,
            assetName: "bench.gltf",
            name: "bench",
            id: "0",
            actionId: "0",
            scale: 0.5,
            yRotation: 0
        },
        {
            lat: 51.171925226603605,
            lon: 4.139067374012707,
            height: -150,
            assetName: "bench.gltf",
            name: "bench2",
            id: "0",
            actionId: "0",
            scale: 0.5,
            yRotation: 0
        },
    ]
}

function showInformationBox() {
    document.getElementById("informationBox").style.display = "block"
    loadInformationBoxData()
}

function hideInformationBox() {
    document.getElementById("informationBox").style.display = "none"
}

function loadInformationBoxData() { // get from db later
    document.getElementById("actionTitle").innerText = "Een bankje in het park"
    document.getElementById("actionText").innerText = "Om op te rusten en te genieten!"
}

function hideAllIntrestPoints() {
    let nodeList = document.querySelectorAll("#actionPoint");
    for (let i = 0; i < nodeList.length; i++) {
        nodeList[i].setAttribute('visible', false)
    }
}

function showAllIntrestPoints() {
    let nodeList = document.querySelectorAll("#actionPoint");
    for (let i = 0; i < nodeList.length; i++) {
        nodeList[i].setAttribute('visible', true)
    }
}

function addOnClick3DModel(lat, lon, id) {
    document.getElementById("3dModelButton").onclick = function () {
        hideInformationBox()
        addGltfModelToAAssets(id)
        showGLTFModel(lat, lon, id)
        showShowInfo()
        addOnClickShowInfoButton(id)
        showResetDiv() // show reset button
    }
}

function addOnClickShowInfoButton(id) {
    document.getElementById("showInfoButton").onclick = function () {
        hideShowInfo()
        hideResetDiv()
        removeGltfModels(id)
        showInformationBox()
    }
}

function showShowInfo() {
    document.getElementById("showInfoDiv").style.display = "block"
}

function hideShowInfo() {
    document.getElementById("showInfoDiv").style.display = "none"
}

function showResetDiv() {
    document.getElementById("resetDiv").style.display = "block"
}

function hideResetDiv() {
    document.getElementById("resetDiv").style.display = "none"
}

function onClickIntrestPoint(lat, lon, id) {
    addOnClickResetButton(id)
    showInformationBox() // show information box
    hideAllIntrestPoints() // make all intrest points invisible
    addOnClick3DModel(lat, lon, id) // add onClick to show 3D Models
}

function addGltfModelToAAssets(id) {
        var model = loadGltfModelsOfAction().find(m => m.actionId === id)
            const assetItem = document.createElement("a-asset-item")
            assetItem.setAttribute("id", model.name)
            assetItem.setAttribute("src", "./assets/" + model.assetName)
            document.querySelector("a-assets").appendChild(assetItem);
}

function showGLTFModel(lat, lon, id) {
    var model = loadGltfModelsOfAction().find(m => m.actionId === id)
    const compoundEntity = document.createElement("a-entity");
    compoundEntity.setAttribute('gps-new-entity-place', {
        latitude: model.lat, // change to lat of gltf model later
        longitude: model.lon // change to lon of gltf model later
    });
    const gltfModel = document.createElement("a-entity");
    gltfModel.setAttribute("scale", {
        x: model.scale,
        y: model.scale,
        z: model.scale
    });
    gltfModel.setAttribute('gltf-model', '#' + model.name);
    gltfModel.setAttribute('id', model.name + 'Model');
    gltfModel.setAttribute('look-at', '[gps-new-camera]');
    gltfModel.setAttribute("position", {
        x: 0,
        y: model.height, // set height
        z: 180
    });
    gltfModel.setAttribute("rotation", {
        x: 0,
        y: model.yRotation,
        z: 0
    });
    compoundEntity.appendChild(gltfModel);
    document.querySelector("a-scene").appendChild(compoundEntity);
}

function addOnClickResetButton(id) {
    document.getElementById("resetButton").onclick = function () {
        // hide buttons and information box
        hideResetDiv()
        hideShowInfo()
        hideInformationBox()
        // remove gltf model 
        removeGltfModels(id)
        // show actions points again
        showAllIntrestPoints()
    }
}

function removeGltfModels(id) {
    // remove hardcoded later
    var model = loadGltfModelsOfAction().find(m => m.actionId === id)
    document.getElementById(model.name).remove()
    document.getElementById(model.name + "Model").remove()
}

window.onload = () => {
    let downloaded = false;

    // addOnClickResetButton()

    const el = document.querySelector("[gps-new-camera]");

    el.addEventListener("gps-camera-update-position", async (e) => {
        if (!downloaded) {
            loadActionPoints()
        }
        downloaded = true;
    });
};


function loadActionPoints() {
    const places = loadPlaces()

    places.forEach(place => {
        const compoundEntity = document.createElement("a-entity");
        compoundEntity.setAttribute("id", "actionPoint")
        compoundEntity.setAttribute('gps-new-entity-place', {
            latitude: place.lat,
            longitude: place.lon
        });
        const gltfModel = document.createElement("a-entity");
        gltfModel.setAttribute("scale", {
            x: 0.5,
            y: 0.5,
            z: 0.5
        });
        gltfModel.setAttribute('gltf-model', '#test');
        gltfModel.setAttribute('id', 'testModel');
        gltfModel.setAttribute('look-at', '[gps-new-camera]');
        gltfModel.setAttribute("position", {
            x: 0,
            y: 0, // set height
            z: 5
        });
        gltfModel.setAttribute("id", place.id)
        gltfModel.setAttribute("clicker", "") // onClick
        compoundEntity.appendChild(gltfModel);
        document.querySelector("a-scene").appendChild(compoundEntity);
    });
}