function loadChart(koridor = []) {
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
          backgroundColor: 'rgb(150, 150, 150)',
        },
        {
          label: '2020',
          data: p20,
          backgroundColor: 'rgb(27, 76, 159)',
        },
      ]
    };

    const data2 = {
      labels: labels,
      datasets: [
        {
          label: '2019',
          data: d19,
          backgroundColor: 'rgb(150, 150, 150)',
        },
        {
          label: '2020',
          data: d20,
          backgroundColor: 'rgb(27, 76, 159)',
        },
      ]
    };

    const option = {
      scales: {
        x: {
          display: false
        },
        y: {
          beginAtZero: true,
          afterTickToLabelConversion: axis => {
            for(var i in axis.ticks) {
              console.log(axis.ticks[1])
              axis.ticks[i].label = axis.ticks[i].label.replace(",000,000,000", "M");
            }
          }
        },
      },
      responsive: true,
    }
  
    const config1 = {
      type: 'bar',
      data: data1,
      options: {
        scales: {
          x: {
            display: false
          },
          y: {
            beginAtZero: true,
            afterTickToLabelConversion: axis => {
              for(var i in axis.ticks) {
                let val = axis.ticks[i].value / 1000000;
                let label = (val % 1 == 0) ? val.toFixed() : val.toFixed(1);
                axis.ticks[i].label = label.toString() + "jt";
              }
            }
          },
        },
        responsive: true,
      }
    };
  
    const config2 = {
      type: 'bar',
      data: data2,
      options: {
        scales: {
          x: {
            display: false
          },
          y: {
            beginAtZero: true,
            afterTickToLabelConversion: axis => {
              for(var i in axis.ticks) {
                axis.ticks[i].label = axis.ticks[i].label.replace(",000,000,000", "M");
              }
            }
          },
        },
        responsive: true,
      }
    };

    $("canvas#chart1").remove();
    $("canvas#chart2").remove();
    $("div.chart1Container").append('<canvas id="chart1"></canvas>');
    $("div.chart2Container").append('<canvas id="chart2"></canvas>');

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