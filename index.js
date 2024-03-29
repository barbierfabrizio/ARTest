let excludedTagIds = [];
let map;


window.onload = () => {
    map = L.map('map').setView([51.214, 4.411], 18);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    const legend = L.control({position: 'bottomleft'})

    legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'info legend');
        div.innerHTML += '<div class="d-flex flex-row">' +
            '<div class="d-flex justify-content-center" style="width: 25px; height: 25px"><img src="https://static.thenounproject.com/png/1141815-200.png" width="25" height="25" alt="You are here" /></div><div class="d-flex align-items-center"> You are here</div></div>';
        div.innerHTML += '<div class="d-flex flex-row"><div class="d-flex justify-content-center" style="width: 25px; height: 25px"><img src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png" width="17" height="25" alt="Interest point" /></div><div class="d-flex align-items-center"> Interest point</div></div>';
        return div;
    };

    legend.addTo(map);

    
    document.getElementById("map-popup").style.display = "none";

    navigator.geolocation.getCurrentPosition(function (position) {
        map.panTo([position.coords.latitude, position.coords.longitude]);
        L.marker(L.latLng(position.coords.latitude, position.coords.longitude), {
            icon: L.icon({
                iconUrl: 'https://static.thenounproject.com/png/1141815-200.png',
                iconSize: [25, 25],
                iconAnchor: [14, 27],
                shadowSize: [0, 0]
            })
        }).addTo(map);
    });



   // let downloaded = false;
    // addOnClickResetButton()
    const settingsPopup = document.getElementById("settings-popup");
    const mapPopup = document.getElementById("map-popup");
    document.getElementById("settings-button").addEventListener("click", function() {
        if (settingsPopup.style.display === "none") {
            mapPopup.style.display = "none";
            settingsPopup.style.display = "block";
        } else {
            settingsPopup.style.display = "none";
            saveSettings()
        }
    });

    document.getElementById("map-button").addEventListener("click", function () {
        if (mapPopup.style.display === "none") {
            settingsPopup.style.display = "none";
            mapPopup.style.display = "block";
        } else {
            mapPopup.style.display = "none";
        }
    });

    // const el = document.querySelector("[gps-new-camera]");


    // el.addEventListener("gps-camera-update-position", async (e) => {
    //     if (!downloaded) {
    //         loadActivityMarkers()
    //     }
    //     downloaded = true;
    // });
    loadActivityMarkers()

    loadTags()
};

AFRAME.registerComponent('clicker', { // click on interest point
    init: function () {
        this.el.addEventListener('click', () => {
            onClickInterestPoint(this.el.id.replace("activity-entity-", ""))  
        });
    }
});

AFRAME.registerComponent('clickgltf', {
    init: function () {
        this.el.addEventListener('click', () => {
            const dist = this.el.components["gps-new-entity-place"].distance;
            alert("distance from model: " + dist)
        });
    }
});
function hideAllInterestPoints() {
    let nodeList = document.querySelectorAll("#actionPoint");
    for (let i = 0; i < nodeList.length; i++) {
        nodeList[i].setAttribute('visible', "false")
    }
}

function showAllInterestPoints() {
    let nodeList = document.querySelectorAll("#actionPoint");
    for (let i = 0; i < nodeList.length; i++) {
        nodeList[i].setAttribute('visible', "true")
    }
}

function addOnClick3DModel(id) {
    document.getElementById("3dModelButton").onclick = function () {
        hideInformationBox()
        loadActivityModels(id)
        showShowInfo()
        addOnClickShowInfoButton(id)
        showResetDiv() // show reset button
    }
}

function addOnClickShowInfoButton(id) {
    document.getElementById("showInfoButton").onclick = function () {
        hideShowInfo()
        hideResetDiv()
        removeActivityModels(id)
        loadActivityInformation(id)
        addOnClickLikeButton(id)
        addOnClickShareButton(id)
        addOnClickCommentButton(id)
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

function onClickInterestPoint(id) {
    document.getElementById("settings-button").style.display = "none"
    document.getElementById("settings-popup").style.display = "none"
    document.getElementById("map-button").style.display = "none"
    document.getElementById("map-popup").style.display = "none"
    addOnClickCloseButton()
    addOnClickResetButton(id)
    loadActivityInformation(id) // show information box
    hideAllInterestPoints() // make all interest points invisible
    addOnClick3DModel(id) // add onClick to show 3D Models
    addOnClickLikeButton(id)
    addOnClickShareButton(id)
    addOnClickCommentButton(id)
}

function addOnClickCloseButton(id) {
    document.getElementById("close-info").onclick = function () {
        console.log("close button clicked")
        document.getElementById("settings-button").style.display = "block"
        document.getElementById("map-button").style.display = "block"
        hideResetDiv()
        hideShowInfo()
        hideInformationBox()
        showAllInterestPoints()
    }
}
function addOnClickResetButton(id) {
    document.getElementById("resetButton").onclick = function () {
        document.getElementById("settings-button").style.display = "block"
        document.getElementById("map-button").style.display = "block"
        hideResetDiv()
        hideShowInfo()
        hideInformationBox()
        removeActivityModels(id)
        showAllInterestPoints()
    }
}

function loadActivityMarkers() {
    // fetch(`/api/ActivityApi/GetAllActivityMarkers/`)
    //     .then(response => response.json())
    //     .then(data => loadActionPoints(data))
    //     .catch(error => console.error('Error:', error))

    const data = [
        {
            activityId: "0",
            activityTitle: "Een bankje in het park",
            latLng: "51.218912965, 4.401616741"
        },
        {
            activityId: "1",
            activityTitle: "Een bankje in het park",
            latLng: "51.2190400738, 4.4017077785"
        },
        {
            activityId: "2",
            activityTitle: "Vergroening Groenplaats",
            latLng: "51.219015127, 4.401997959"
        },
        {
            activityId: "3",
            activityTitle: "Voetbalveld Bernarduscentrum",
            latLng: "51.2188832667, 4.4020074426"
        },
        {
            activityId: "4",
            activityTitle: "Vergroening Groenplaats",
            latLng: "51.21893, 4.40184"
        },
        {
            activityId: "5",
            activityTitle: "Extra verlichting Groenplaats",
            latLng: "51.2190994703, 4.4018651970"
        },
        {
            activityId: "6",
            activityTitle: "Basketballen op de Groenplaats",
            latLng: "51.219392, 4.401470"
        },
        {
            activityId: "7",
            activityTitle: "Test Aula",
            latLng: "51.2182811, 4.4009055"
        },
        {
            activityId: "8",
            activityTitle: "Vergroening Groenplaats",
            latLng: "51.219397, 4.401944"
        },
        {
            activityId: "9",
            activityTitle: "Vergroening Groenplaats",
            latLng: "51.219007, 4.401327"
        },
        {
            activityId: "10",
            activityTitle: "Extra Vergroening Groenplaats",
            latLng: "51.2189723617, 4.4018424377"
        },
        {
            activityId: "11",
            activityTitle: "T-Rex",
            latLng: "51.217837260376, 4.403172908406"
        }
    ]

    loadActionPoints(data)
}

function loadActionPoints(places) {
    places.forEach(place => {
        addMarker(place)
        const compoundEntity = document.createElement("a-entity");
        compoundEntity.setAttribute("id", "actionPoint")
        compoundEntity.setAttribute('gps-new-entity-place', {
            latitude: place.latLng.split(',')[0],
            longitude: place.latLng.split(',')[1]
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
        gltfModel.setAttribute("id", "activity-entity-" + place.activityId)
        gltfModel.setAttribute("clicker", "") // onClick
        compoundEntity.appendChild(gltfModel);
        document.querySelector("a-scene").appendChild(compoundEntity);
    });
}

function addMarker(place) {
    const latLng = L.latLng(place.latLng.split(',')[0], place.latLng.split(',')[1]);
    let marker = L.marker(latLng);
    const icon = marker.options.icon;
    icon.options.iconSize = [17, 25];
    icon.options.iconAnchor = [9, 27];
    icon.options.shadowSize = [0, 0];
    marker.setIcon(icon);
    marker.bindPopup(
        `<div>${place.activityTitle}</div>`,
        {offset: [-1, 16]});
    marker.addTo(map);
}


// information box
function loadActivityInformation(activityId) {
    // fetch(`/api/ActivityApi/GetActivityInformation/${activityId}`)
    //     .then(response => response.json())
    //     .then(data => showInformationBox(data))
    //     .catch(error => console.error('Error:', error))
    

    const dataList = [
        {
            activityId: "0",
            activityTitle: "Een bankje in het park",
            activityDescription: "Om op te rusten en te genieten!",
            projectName: "Meerjarenplan Antwerpen",
            activityWriter: "Stad Antwerpen",
            likeCount: 0,
            shareCount: 0,
            commentCount: 0,
            readMoreUrl: "https://www.antwerpen.be/"
        },
        {
            activityId: "1",
            activityTitle: "Een bankje in het park",
            activityDescription: "Om op te rusten en te genieten!",
            projectName: "Meerjarenplan Antwerpen",
            activityWriter: "Stad Antwerpen",
            likeCount: 0,
            shareCount: 0,
            commentCount: 0,
            readMoreUrl: "https://www.antwerpen.be/"
        },
        {
            activityId: "2",
            activityTitle: "Vergroening Groenplaats",
            activityDescription: "Vergroening Groenplaats",
            projectName: "Meerjarenplan Antwerpen",
            activityWriter: "Stad Antwerpen",
            likeCount: 0,
            shareCount: 0,
            commentCount: 0,
            readMoreUrl: "https://www.antwerpen.be/"
        },
        {
            activityId: "3",
            activityTitle: "Voetbalveld Bernarduscentrum",
            activityDescription: "Een sportieve gelegenheid voor de studenten van KdG",
            projectName: "Meerjarenplan Antwerpen",
            activityWriter: "Stad Antwerpen",
            likeCount: 5,
            shareCount: 2,
            commentCount: 0,
            readMoreUrl: "https://www.antwerpen.be/"
        },
        {
            activityId: "4",
            activityTitle: "Vergroening Groenplaats",
            activityDescription: "Extra bomen en banken op de Groenplaats",
            projectName: "Meerjarenplan Antwerpen",
            activityWriter: "Stad Antwerpen",
            likeCount: 10,
            shareCount: 5,
            commentCount: 0,
            readMoreUrl: "https://www.antwerpen.be/"
        },
        {
            activityId: "5",
            activityTitle: "Extra verlichting Groenplaats",
            activityDescription: "Extra lantaarnpalen op de Groenplaats",
            projectName: "Meerjarenplan Antwerpen",
            activityWriter: "Stad Antwerpen",
            likeCount: 2,
            shareCount: 1,
            commentCount: 0,
            readMoreUrl: "https://www.antwerpen.be/"
        },
        {
            activityId: "6",
            activityTitle: "Basketballen op de Groenplaats",
            activityDescription: "Een tijdelijke basketbalring op de Groenplaats",
            projectName: "Meerjarenplan Antwerpen",
            activityWriter: "Stad Antwerpen",
            likeCount: 15,
            shareCount: 1,
            commentCount: 0,
            readMoreUrl: "https://www.antwerpen.be/"
        },
        {
            activityId: "7",
            activityTitle: "T-Rex",
            activityDescription: "T-Rex in de Aula",
            projectName: "Meerjarenplan Antwerpen",
            activityWriter: "Stad Antwerpen",
            likeCount: 15,
            shareCount: 1,
            commentCount: 0,
            readMoreUrl: "https://www.antwerpen.be/"
        },
        {
            activityId: "8",
            activityTitle: "Vergroening Groenplaats",
            activityDescription: "Extra bomen op de Groenplaats",
            projectName: "Meerjarenplan Antwerpen",
            activityWriter: "Stad Antwerpen",
            likeCount: 5,
            shareCount: 5,
            commentCount: 0,
            readMoreUrl: "https://www.antwerpen.be/"
        },
        {
            activityId: "9",
            activityTitle: "Vergroening Groenplaats",
            activityDescription: "Extra bomen op de Groenplaats",
            projectName: "Meerjarenplan Antwerpen",
            activityWriter: "Stad Antwerpen",
            likeCount: 10,
            shareCount: 2,
            commentCount: 0,
            readMoreUrl: "https://www.antwerpen.be/"
        },
        {
            activityId: "10",
            activityTitle: "Vergroening Groenplaats",
            activityDescription: "Extra bomen op de Groenplaats",
            projectName: "Meerjarenplan Antwerpen",
            activityWriter: "Stad Antwerpen",
            likeCount: 10,
            shareCount: 2,
            commentCount: 0,
            readMoreUrl: "https://www.antwerpen.be/"
        },
        {
            activityId: "11",
            activityTitle: "T-Rex",
            activityDescription: "T-Rex in het Bernarduscentrum",
            projectName: "Meerjarenplan Antwerpen",
            activityWriter: "Stad Antwerpen",
            likeCount: 10,
            shareCount: 2,
            commentCount: 0,
            readMoreUrl: "https://www.antwerpen.be/"
        }
    ]

    const data = dataList.find(a => a.activityId === activityId)
    showInformationBox(data)

}

function showInformationBox(data) {
    document.getElementById("informationBox").style.display = "block"
    loadInformationBoxData(data)
}

function hideInformationBox() {
    document.getElementById("informationBox").style.display = "none"
}

function loadInformationBoxData(data) { 
    document.getElementById("actionTitle").innerText = data.activityTitle
    document.getElementById("projectTitle").innerText = data.projectName
    document.getElementById("actionText").innerText = data.activityDescription
    document.getElementById("writer").innerText = data.activityWriter
    document.getElementById("likes").innerText = data.likeCount + " "
    document.getElementById("comments").innerText = data.commentCount + " "
    document.getElementById("shares").innerText = data.shareCount + " "
    document.getElementById("readMoreButton").onclick = function () {
        window.open(data.readMoreUrl, '_blank');
    }
}

// loading of Activity Models

function loadActivityModels(activityId) {
    // fetch(`/api/ActivityApi/GetAllModelsOfActivity/${activityId}`)
    //     .then(response => response.json())
    //     .then(data => showGLTFModels(data))
    //     .catch(error => console.error('Error:', error))

    const dataList = [
        {
            activityId: "0",
            modelId: "0",
            modelSrcUrl: "./assets/wooden_bench.glb",
            latLng: "51.218912965, 4.401616741",
            height: -7,
            rotation: 260,
            scale: 0.030,
            savedFileName: "wooden_bench-20230306224054.glb"
        },
        {
            activityId: "1",
            modelId: "1",
            modelSrcUrl: "./assets/wooden_bench.glb",
            latLng: "51.2190400738, 4.4017077785",
            height: -7,
            rotation: 260,
            scale: 0.030,
            savedFileName: "wooden_bench-20230306224053.glb"
        },
        {
            activityId: "2",
            modelId: "2",
            modelSrcUrl: "./assets/ape_statue.glb",
            latLng: "51.218124135521485, 4.400517940521241",
            height: -7,
            rotation: 260,
            scale: 10,
            savedFileName: "ape_statue-20230306224058.glb"
        },
        {
            activityId: "2",
            modelId: "3",
            modelSrcUrl: "./assets/football_goal_rework.glb",
            latLng: "51.172342, 4.140015",
            height: -3,
            rotation: 180,
            scale: 2,
            savedFileName: "football_goal_rework-20230306224058.glb"
        },
        {
            activityId: "3",
            modelId: "4",
            modelSrcUrl: "./assets/football_goal_rework.glb",
            latLng: "51.217871, 4.402883",
            height: -3,
            rotation: 180,
            scale: 2,
            savedFileName: "football_goal_rework-20230306224058.glb"
        },
        {
            activityId: "3",
            modelId: "5",
            modelSrcUrl: "./assets/football_goal_rework.glb",
            latLng: "51.217698, 4.402844",
            height: -3,
            rotation: 180,
            scale: 2,
            savedFileName: "football_goal_rework-20230306224058.glb"
        },
        {
            activityId: "4",
            modelId: "6",
            modelSrcUrl: "./assets/stylized_tree.glb",
            latLng: "51.218999, 4.401781",
            height: -5,
            rotation: 0,
            scale: 25,
            savedFileName: "stylized_tree-20230306324058.glb"
        },
        {
            activityId: "4",
            modelId: "7",
            modelSrcUrl: "./assets/wooden_bench.glb",
            latLng: "51.218994, 4.401918",
            height: -7,
            rotation: 180,
            scale: 0.030,
            savedFileName: "wooden_bench-20230306224053.glb"
        },
        {
            activityId: "5",
            modelId: "8",
            modelSrcUrl: "./assets/lamppost.glb",
            latLng: "51.218558, 4.401158",
            height: -5,
            rotation: 0,
            scale: 85,
            savedFileName: "lamppost-20230306224153.glb"
        },
        {
            activityId: "6",
            modelId: "9",
            modelSrcUrl: "./assets/basketball_hoop.glb",
            latLng: "51.219430, 4.401469",
            height: -2,
            rotation: 0,
            scale: 2,
            savedFileName: "basketball_hoop-20230307224153.glb"
        },
        {
            activityId: "7",
            modelId: "10",
            modelSrcUrl: "./assets/tyrannosarus_rex_free_model.glb",
            latLng: "51.21825430397, 4.40088559893",
            height: -7,
            rotation: 180,
            scale: 1,
            savedFileName: "tyrannosarus_rex_free_model-20230306225053.glb"
        },
        {
            activityId: "8",
            modelId: "11",
            modelSrcUrl: "./assets/stylized_tree.glb",
            latLng: "51.219397, 4.401944",
            height: -5,
            rotation: 0,
            scale: 25,
            savedFileName: "stylized_tree-20230306324058.glb"
        },
        {
            activityId: "9",
            modelId: "12",
            modelSrcUrl: "./assets/stylized_tree.glb",
            latLng: "51.219007, 4.401327",
            height: -5,
            rotation: 0,
            scale: 25,
            savedFileName: "stylized_tree-20230306324058.glb"
        },
        {
            activityId: "10",
            modelId: "13",
            modelSrcUrl: "./assets/stylized_tree.glb",
            latLng: "51.2191030360, 4.4018064022",
            height: -5,
            rotation: 0,
            scale: 25,
            savedFileName: "stylized_tree-20230306324058.glb"
        },
        {
            activityId: "10",
            modelId: "14",
            modelSrcUrl: "./assets/stylized_tree.glb",
            latLng: "51.219079309, 4.4019562342",
            height: -5,
            rotation: 0,
            scale: 25,
            savedFileName: "stylized_tree-20230316324058.glb"
        },
        {
            activityId: "10",
            modelId: "15",
            modelSrcUrl: "./assets/stylized_tree.glb",
            latLng: "51.218975974, 4.401992269",
            height: -5,
            rotation: 0,
            scale: 25,
            savedFileName: "stylized_tree-20230326324058.glb"
        },
        {
            activityId: "10",
            modelId: "16",
            modelSrcUrl: "./assets/stylized_tree.glb",
            latLng: "51.21889159678, 4.40191071566",
            height: -5,
            rotation: 0,
            scale: 25,
            savedFileName: "stylized_tree-20230336324058.glb"
        },
        {
            activityId: "10",
            modelId: "17",
            modelSrcUrl: "./assets/stylized_tree.glb",
            latLng: "51.21890702227, 4.40173433109",
            height: -5,
            rotation: 0,
            scale: 25,
            savedFileName: "stylized_tree-20230346324058.glb"
        },
        {
            activityId: "10",
            modelId: "18",
            modelSrcUrl: "./assets/stylized_tree.glb",
            latLng: "51.21899847419, 4.401707778584",
            height: -5,
            rotation: 0,
            scale: 25,
            savedFileName: "stylized_tree-20230356324058.glb"
        },
        {
            activityId: "11",
            modelId: "19",
            modelSrcUrl: "./assets/tyrannosarus_rex_free_model.glb",
            latLng: "51.21783726037, 4.403172908406",
            height: -7,
            rotation: 180,
            scale: 1,
            savedFileName: "tyrannosarus_rex_free_model-20230306225053.glb"
        },
    ]
 
    const data = dataList.filter(a => a.activityId === activityId)
    showGLTFModels(data)
}

function removeActivityModels(activityId) {
    // fetch(`/api/ActivityApi/GetAllModelsOfActivity/${activityId}`)
    //     .then(response => response.json())
    //     .then(data => removeGltfModels(data))
    //     .catch(error => console.error('Error:', error))

    const dataList = [
        {
            activityId: "0",
            modelId: "0",
            modelSrcUrl: "./assets/wooden_bench.glb",
            latLng: "51.218912965, 4.401616741",
            height: -7,
            rotation: 260,
            scale: 0.030,
            savedFileName: "wooden_bench-20230306224054.glb"
        },
        {
            activityId: "1",
            modelId: "1",
            modelSrcUrl: "./assets/wooden_bench.glb",
            latLng: "51.2190400738, 4.4017077785",
            height: -7,
            rotation: 260,
            scale: 0.030,
            savedFileName: "wooden_bench-20230306224053.glb"
        },
        {
            activityId: "2",
            modelId: "2",
            modelSrcUrl: "./assets/ape_statue.glb",
            latLng: "51.218124135521485, 4.400517940521241",
            height: -7,
            rotation: 260,
            scale: 10,
            savedFileName: "ape_statue-20230306224058.glb"
        },
        {
            activityId: "2",
            modelId: "3",
            modelSrcUrl: "./assets/football_goal_rework.glb",
            latLng: "51.172342, 4.140015",
            height: -3,
            rotation: 180,
            scale: 2,
            savedFileName: "football_goal_rework-20230306224058.glb"
        },
        {
            activityId: "3",
            modelId: "4",
            modelSrcUrl: "./assets/football_goal_rework.glb",
            latLng: "51.217871, 4.402883",
            height: -3,
            rotation: 180,
            scale: 2,
            savedFileName: "football_goal_rework-20230306224058.glb"
        },
        {
            activityId: "3",
            modelId: "5",
            modelSrcUrl: "./assets/football_goal_rework.glb",
            latLng: "51.217698, 4.402844",
            height: -3,
            rotation: 180,
            scale: 2,
            savedFileName: "football_goal_rework-20230306224058.glb"
        },
        {
            activityId: "4",
            modelId: "6",
            modelSrcUrl: "./assets/stylized_tree.glb",
            latLng: "51.218999, 4.401781",
            height: -5,
            rotation: 0,
            scale: 25,
            savedFileName: "stylized_tree-20230306324058.glb"
        },
        {
            activityId: "4",
            modelId: "7",
            modelSrcUrl: "./assets/wooden_bench.glb",
            latLng: "51.218994, 4.401918",
            height: -7,
            rotation: 180,
            scale: 0.030,
            savedFileName: "wooden_bench-20230306224053.glb"
        },
        {
            activityId: "5",
            modelId: "8",
            modelSrcUrl: "./assets/lamppost.glb",
            latLng: "51.218558, 4.401158",
            height: -5,
            rotation: 0,
            scale: 85,
            savedFileName: "lamppost-20230306224153.glb"
        },
        {
            activityId: "6",
            modelId: "9",
            modelSrcUrl: "./assets/basketball_hoop.glb",
            latLng: "51.219430, 4.401469",
            height: -2,
            rotation: 0,
            scale: 2,
            savedFileName: "basketball_hoop-20230307224153.glb"
        },
        {
            activityId: "7",
            modelId: "10",
            modelSrcUrl: "./assets/tyrannosarus_rex_free_model.glb",
            latLng: "51.21808381, 4.40072983",
            height: -7,
            rotation: 180,
            scale: 1,
            savedFileName: "tyrannosarus_rex_free_model-20230306225053.glb"
        },
        {
            activityId: "8",
            modelId: "11",
            modelSrcUrl: "./assets/stylized_tree.glb",
            latLng: "51.219397, 4.401944",
            height: -5,
            rotation: 0,
            scale: 25,
            savedFileName: "stylized_tree-20230306324058.glb"
        },
        {
            activityId: "9",
            modelId: "12",
            modelSrcUrl: "./assets/stylized_tree.glb",
            latLng: "51.219007, 4.401327",
            height: -5,
            rotation: 0,
            scale: 25,
            savedFileName: "stylized_tree-20230306324058.glb"
        },
        {
            activityId: "10",
            modelId: "13",
            modelSrcUrl: "./assets/stylized_tree.glb",
            latLng: "51.2191030360, 4.4018064022",
            height: -5,
            rotation: 0,
            scale: 25,
            savedFileName: "stylized_tree-20230306324058.glb"
        },
        {
            activityId: "10",
            modelId: "14",
            modelSrcUrl: "./assets/stylized_tree.glb",
            latLng: "51.219079309, 4.4019562342",
            height: -5,
            rotation: 0,
            scale: 25,
            savedFileName: "stylized_tree-20230316324058.glb"
        },
        {
            activityId: "10",
            modelId: "15",
            modelSrcUrl: "./assets/stylized_tree.glb",
            latLng: "51.218975974, 4.401992269",
            height: -5,
            rotation: 0,
            scale: 25,
            savedFileName: "stylized_tree-20230326324058.glb"
        },
        {
            activityId: "10",
            modelId: "16",
            modelSrcUrl: "./assets/stylized_tree.glb",
            latLng: "51.21889159678, 4.40191071566",
            height: -5,
            rotation: 0,
            scale: 25,
            savedFileName: "stylized_tree-20230336324058.glb"
        },
        {
            activityId: "10",
            modelId: "17",
            modelSrcUrl: "./assets/stylized_tree.glb",
            latLng: "51.21890702227, 4.40173433109",
            height: -5,
            rotation: 0,
            scale: 25,
            savedFileName: "stylized_tree-20230346324058.glb"
        },
        {
            activityId: "10",
            modelId: "18",
            modelSrcUrl: "./assets/stylized_tree.glb",
            latLng: "51.21899847419, 4.401707778584",
            height: -5,
            rotation: 0,
            scale: 25,
            savedFileName: "stylized_tree-20230356324058.glb"
        },
        {
            activityId: "11",
            modelId: "19",
            modelSrcUrl: "./assets/tyrannosarus_rex_free_model.glb",
            latLng: "51.21783726037, 4.403172908406",
            height: -7,
            rotation: 180,
            scale: 1,
            savedFileName: "tyrannosarus_rex_free_model-20230306225053.glb"
        },
    ]

    const data = dataList.filter(a => a.activityId === activityId)
    removeGltfModels(data)
}

function addGltfModelToAAssets(model) {
    const assetItem = document.createElement("a-asset-item")
    assetItem.setAttribute("id", model.savedFileName)
    assetItem.setAttribute("src", model.modelSrcUrl)
    document.querySelector("a-assets").appendChild(assetItem);
}

function removeGltfModels(data) {
    data.forEach(model => {
        document.getElementById(model.savedFileName).remove()
        document.getElementById(model.savedFileName + "Model").remove()  
    })
}

function showGLTFModels(models) {
    models.forEach(model => {
        addGltfModelToAAssets(model)
        const gltfModel = document.createElement("a-entity");
        gltfModel.setAttribute('gps-new-entity-place', {
            latitude: model.latLng.split(',')[0],
            longitude: model.latLng.split(',')[1]
        });
        gltfModel.setAttribute("scale", {
            x: model.scale,
            y: model.scale,
            z: model.scale
        });
        gltfModel.setAttribute('gltf-model', '#' + model.savedFileName);
        gltfModel.setAttribute('id', model.savedFileName + 'Model');
        gltfModel.setAttribute("position", {
            x: 0,
            y: model.height, // set height
            z: 0
        });
        gltfModel.setAttribute("rotation", {
            x: 0,
            y: model.rotation,
            z: 0
        });
        gltfModel.setAttribute("clickgltf", "") // onClick
        document.querySelector("a-scene").appendChild(gltfModel);  
    })
}

// like activity
function addOnClickLikeButton(id) {
    const likeButton = document.getElementById("likeButton")
    likeButton.onclick = function () {
        likeActivity(id)
        document.getElementById("likes").innerText = (Number(document.getElementById("likes").innerText) + 1).toString()
        likeButton.style.color = 'green'
        likeButton.style.pointerEvents = 'none'
    }
}

function likeActivity(activityId) {
    // fetch(`/api/ActivityApi/LikeActivity/${activityId}`, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // })
    //     .catch(error => console.error('Error:', error));
    console.log("liked: " + activityId)
}

// share activity
function addOnClickShareButton(id) {
    const shareButton = document.getElementById("shareButton")
    shareButton.onclick = function () {
        shareActivity(id)
        document.getElementById("shares").innerText = (Number(document.getElementById("shares").innerText) + 1).toString()
        shareButton.style.color = 'blue'
        shareButton.style.pointerEvents = 'none'
    }
}

function shareActivity(activityId) {
    // fetch(`/api/ActivityApi/ShareActivity/${activityId}`, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // })
    //     .catch(error => console.error('Error:', error));
    console.log("shared: " + activityId)
}

// tags
function loadTags() {
    // fetch('/api/TagApi/All') 
    //     .then(response => response.json())
    //     .then(data => showTags(data))
    //     .catch(error => console.error(error))
    const dataList = [
        {
            tagId: "0",
            tagContent: "urban development"
        },
        {
            tagId: "1",
            tagContent: "public safety"
        },
    ]

    showTags(dataList)
}

function showTags(tags) {
    const tagsDiv = document.getElementById("tags-div");
    tagsDiv.textContent = "";
    tags.forEach(tag => {
        const rowDiv = document.createElement("div");
        rowDiv.setAttribute("class", "row mb-2");
        const tagDiv = document.createElement("div");
        tagDiv.setAttribute("class", "col-8");
        tagDiv.setAttribute("id", "tag-div-" + tag.tagId);
        tagDiv.innerText = tag.tagContent;
        const switchDiv = document.createElement("div");
        switchDiv.setAttribute("class", "col-4 form-check form-switch");
        const switchInput = document.createElement("input");
        switchInput.setAttribute("type", "checkbox");
        switchInput.setAttribute("class", "form-check-input");
        switchInput.setAttribute("id", "tag-switch-" + tag.tagId);
        const switchLabel = document.createElement("label");
        switchLabel.setAttribute("class", "form-check-label");
        switchLabel.setAttribute("for", "tag-switch-" + tag.tagId);
        switchLabel.innerText = "Hide";
        switchDiv.appendChild(switchInput);
        switchDiv.appendChild(switchLabel);
        rowDiv.appendChild(tagDiv);
        rowDiv.appendChild(switchDiv);
        tagsDiv.appendChild(rowDiv);
    });
}

// filter activities
function saveSettings() {
    excludedTagIds = [];
    const tagsDiv = document.getElementById("tags-div");
    const checkboxes = tagsDiv.querySelectorAll('input[type=checkbox]:checked');
    checkboxes.forEach(checkbox => {
        excludedTagIds.push(checkbox.id.replace("tag-switch-", ""));
    });
    console.log("saved settings");
    
    // fetch activityTags
    loadActivityTags();
}

function loadActivityTags() {
    // fetch('/api/ActivityApi/ActivityTags') 
    //     .then(response => response.json())
    //     .then(data => hideActivitiesWithExcludedTags(data))
    //     .catch(error => console.error(error))

    const dataList = [
        {
            activityId: "0",
            tagId: "0"
        },
        {
            activityId: "1",
            tagId: "1"
        },
        {
            activityId: "2",
            tagId: "1"
        },
        {
            activityId: "3",
            tagId: "1"
        },
        {
            activityId: "4",
            tagId: "1"
        },
        {
            activityId: "5",
            tagId: "1"
        },
        {
            activityId: "6",
            tagId: "0"
        },
        {
            activityId: "7",
            tagId: "0"
        },
        {
            activityId: "8",
            tagId: "0"
        },
        {
            activityId: "9",
            tagId: "0"
        },
        {
            activityId: "10",
            tagId: "0"
        },
        {
            activityId: "11",
            tagId: "1"
        },
    ]

    hideActivitiesWithExcludedTags(dataList)

}

function hideActivitiesWithExcludedTags(activityTags) {
    activityTags.forEach(activityTag => {
        const activity = document.getElementById("activity-entity-" + activityTag.activityId);
        if (excludedTagIds.includes(activityTag.tagId)) {
            activity.setAttribute('visible', "false");
        } else {
            activity.setAttribute('visible', "true");
        }
    });
}

// comments
function addOnClickCommentButton(id) {
    document.getElementById("commentButton").onclick = function () {
        hideInformationBox()
        showCommentBox()
        addOnClickSubmitComment(id)
        loadCommentsOfAction(id)
        addOnClickHideComments()
    }
}

function addOnClickHideComments() {
    document.getElementById("closeReactions").onclick = function () {
        hideCommentBox()
        removeAllComments()
        document.getElementById("informationBox").style.display = "block"
    }
}

function addOnClickSubmitComment(id) {
    document.getElementById("submitComment").onclick = function () {
        const commentContentText = document.getElementById("commentContentText").value
        postComment(id, commentContentText) 
        document.getElementById("commentContentText").value = ''
        document.getElementById("comments").innerText = Number(document.getElementById("comments").innerText) + 1
    }
}

function postComment(activityId, commentContentText) {
    // fetch(`/api/ActivityApi/PostComment/${activityId}`, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         "reactionContent": commentContentText
    //     })
    // }) .then(response => response.json())
    //     .then(data => showCommentHtml(data))
    //     .catch(error => console.error('Error:', error));
    const comment = {
        reactionContent: commentContentText,
        commentWriter: "Anonymous",
        datePlaced: "2023-03-22"
    }

    showCommentHtml(comment)
}

function showCommentBox() {
    document.getElementById("commentBox").style.display = "block"
}

function hideCommentBox() {
    document.getElementById("commentBox").style.display = "none"
}

function loadCommentsOfAction(activityId) {
    // fetch(`/api/ActivityApi/GetAllCommentsOfAction/${activityId}`)
    //     .then(response => response.json())
    //     .then(data => showAllComments(data))
    //     .catch(error => console.error('Error:', error))

    const dataList = [
        {
            activityId: "0",
            reactionContent: "Super!",
            commentWriter: "Anonymous",
            datePlaced: "2023-03-11"
        },
        {
            activityId: "1",
            reactionContent: "Geen goed idee.",
            commentWriter: "Anonymous",
            datePlaced: "2023-03-10"
        },
    ]

    const data = dataList.filter(a => a.activityId === activityId)
    showAllComments(data)
}

function showAllComments(data) {
    data.forEach(comment => {
        showCommentHtml(comment)
    })
}

function removeAllComments() {
    let comments = document.querySelector("#commentList")
    comments.innerText = ""
}

function showCommentHtml(comment) {
    const commentDiv = document.createElement("div")
    commentDiv.setAttribute("class", "comment mb-1")
    const commentH4 = document.createElement("h4")
    commentH4.innerText = comment.commentWriter + " - "
    const commentSpan = document.createElement("span")
    commentSpan.setAttribute("class", "text-muted")
    commentSpan.innerText = comment.datePlaced.toString()
    const commentBr = document.createElement("br")
    const commentP = document.createElement("p")
    commentP.innerText = comment.reactionContent
    
    commentDiv.appendChild(commentH4)
    commentDiv.appendChild(commentSpan)
    commentDiv.appendChild(commentBr)
    commentDiv.appendChild(commentP)
    commentList.appendChild(commentDiv)
}