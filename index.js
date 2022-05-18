var description = document.getElementsByClassName("description")
// console.log(jsonData)

function clickButton(id = "koridor0") {
    var btn = document.getElementById(id)
    var current = document.getElementsByClassName("btn-active")
    var currentId = parseInt(current[0].id.slice(7))
    console.log(id)
    console.log(currentId)
    if(id == "koridor0") {
        for(let i = 1; i <= 13; i++) {
            console.log(("route_").concat(i))
            mouseOverRoute(("route_").concat(i))
        }
        console.log("all")
        loadChart()
    }
    else {
        if(!(currentId == 0)) {mouseOutRoute(event, ("route_").concat(currentId))}
        else {
            for(let i = 1; i <= 13; i++) {
                mouseOutRoute(event, ("route_").concat(i))
            }
        }
        mouseOverRoute(("route_").concat(id.slice(7)))
        loadChart([parseInt(id.substring(7,id.length))])
    }

    current[0].className = current[0].className.replace(" btn-active", "")
    btn.classList.add("btn-active")
}

function clickRoute(id) {
    console.log("TEST")
}

function mouseMoveRoute(e) {
    var x = e.clientX
    var y = e.clientY - 160
    description[0].style.top = y + "px"
    description[0].style.left = x + "px"
    console.log(x, y)
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
        console.log(routeId)
        console.log(data["name"])
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
    routePath.style.opacity = "30%"
    description[0].classList.remove("active")
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
       console.log(actual_JSON);
    });
   }

function numberWithDot(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function loadChart(koridor = []) {
  var chart1 = null
  var chart2 = null
  $.getJSON('data.json', function(data) {
    const n = [null];
    const result = (koridor.length == 0) ? data : data.filter(element => koridor.includes(element['id']));
    var p19 = n.concat(result.map(el => el['penumpang']['2019']));
    var p20 = n.concat(result.map(el => el['penumpang']['2020']));
    var d19 = n.concat(result.map(el => el['pendapatan']['2019']));
    var d20 = n.concat(result.map(el => el['pendapatan']['2020']));
    var kor = result.map(el => el['id']);

    var labels = [null];
    kor.forEach(element => {
      labels.push("Koridor " + element.toString());
    });
    labels.push(null);

    const data1 = {
      labels: labels,
      datasets: [
        {
          label: '2019',
          data: p19,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
        {
          label: '2020',
          data: p20,
          fill: false,
          borderColor: 'rgb(22, 22, 22)',
          tension: 0.1
        },
      ]
    };

    const data2 = {
      labels: labels,
      datasets: [
        {
          label: '2019',
          data: d19,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
        {
          label: '2020',
          data: d20,
          fill: false,
          borderColor: 'rgb(22, 22, 22)',
          tension: 0.1
        },
      ]
    };
  
    const config1 = {
      type: 'line',
      data: data1,
      options: {
        // responsive: true,
        // maintainAspectRatio: false,
        // scales: {
        //     xAxes: [{}],
        //     yAxes: [{
        //         ticks: {
        //             callback: function(value) {
        //                 return value.replace(",000,000", "jt")
        //             }
        //         }
        //     }]
        // }
      }
    };
  
    const config2 = {
      type: 'line',
      data: data2,
      options: {
        // responsive: true,
        // maintainAspectRatio: false
      }
    };

    $("canvas#chart1").remove();
    $("canvas#chart2").remove();
    $("div.chartsContainer").append('<canvas id="chart1"></canvas>');
    $("div.chartsContainer").append('<canvas id="chart2"></canvas>');

    const chart1 = new Chart(
      document.getElementById('chart1'),
      config1
    );

    const chart2 = new Chart(
      document.getElementById('chart2'),
      config2
    );
  });
}