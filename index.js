var description = document.getElementsByClassName("description")

function selectAll() {
  for(let i = 1; i <= 13; i++) {
    mouseOverRoute(("route_").concat(i))
  }
}

function deselectAll() {
  for(let i = 1; i <= 13; i++) {
    mouseOutRoute(event, ("route_").concat(i))
  }
}

function clickButton(id) {
    var btn = document.getElementById(id)
    var current = document.getElementsByClassName("btn-active")
    var currentId = parseInt(current[0].id.slice(7))
    if(id == "koridor0") {
        selectAll()
        loadChart()
    }
    else {
        if(currentId == 0) {
          deselectAll()
        }
        else {
            console.log(currentId)
            mouseOutRoute(event, ("route_").concat(currentId))
            console.log(("route_").concat(currentId))

        }
        mouseOverRoute(("route_").concat(id.slice(7)))
        loadChart([parseInt(id.substring(7,id.length))])
    }

    current[0].className = current[0].className.replace(" btn-active", "")
    btn.classList.add("btn-active")
}

function clickRoute(id) {
    clickButton("koridor" + id.slice(6))
}

function mouseMoveRoute(e) {
    var x = e.clientX
    var y = e.clientY - 160
    description[0].style.top = y + "px"
    description[0].style.left = x + "px"
}

function mouseOverRoute(id) {
    var routePath = document.getElementById(id)
    routePath.style.opacity = "80%"
    description[0].classList.add("active")
    loadJSON(function(response) {
        // Parse JSON string into object
        var actual_JSON = JSON.parse(response);
        var routeId = parseInt(id.slice(6));
        var data = actual_JSON[routeId - 1]
        var name = data["name"]
        var penumpang = data["penumpang"]
        var pendapatan = data["pendapatan"]
        description[0].innerHTML = 
        '<span style="font-weight:bold;font-size: 12px;">' + name + '</span>' + "<br><br>"
        + "Penumpang <br>"
        + '<span style="color:green; text-align:left"> 2019: ' + numberWithDot(penumpang[2019]) + ' orang</span>' + "<br>"
        + '<span style="color:red; text-align:left"> 2020: ' + numberWithDot(penumpang[2020]) + ' orang</span>' + "<br>"
        + "Pendapatan <br>"
        + '<span style="color:green; text-align:left"> 2019: Rp. ' + numberWithDot(pendapatan[2019]) + '</span>' + "<br>"
        + '<span style="color:red; text-align:left"> 2020: Rp. ' + numberWithDot(pendapatan[2020]) + '</span>' + "<br>"
    });
    
    
}

function mouseOutRoute(e, id) {
    var routePath = document.getElementById(id)
    var routeId = parseInt(id.slice(6))
    var activeBtn = document.getElementsByClassName("btn-active")
    var activeBtnId = parseInt(activeBtn[0].id.slice(7))
    console.log(!(routeId === activeBtnId))
    if (!(routeId === activeBtnId)) {
      routePath.style.opacity = "30%"
      description[0].classList.remove("active")
    }
    routePath.style.opacity = "30%"
}

function loadJSON(callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'data.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }

 function init() {
    loadJSON(function(response) {
     // Parse JSON string into object
       var actual_JSON = JSON.parse(response);
    });
   }

function numberWithDot(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}