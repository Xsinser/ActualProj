function GetFirstPartical() {
    $.get("/Home/FirstReport", { Date: $('#maindatapicker').text()}, function (result) {
        $("#fcp").html(result);
    })
}
//function GetFirstChart() {
//    Chart.defaults.global.defaultFontColor = "#255783";
//    var popCanvas = document.getElementById("popChart").getContext("2d");
//    var data = { Date: $('#maindatapicker').text() };
//    var ajaxResult;
//    var time = performance.now();
//    $.ajax({
//        async: false,
//        type: "POST",
//        url: "/Home/GetData",
//        data: { data },
//        success: function (result) {
//            ajaxResult = result;
//        }
//    });
//    var barChart = new Chart(popCanvas, {
//        type: 'bar',
//        data: {
//            labels: ajaxResult.Names,
//            datasets: [{
//                label: "Скорость нажатия",
//                data: ajaxResult.Values,
//                backgroundColor: '#72A0CA'
//            }]

//        }
//        , options: {
//            legend: {
//                position: 'bottom'
//            }
//        }
//    });
//    time = performance.now() - time;
//    console.log('Время выполнения = ', time);
//}

function GetChartWithTwoColumn(element, Url, firstDescription, secondDescription) {
    Chart.defaults.global.defaultFontColor = "#255783";
    if (document.getElementById(element) != null) {
        var popCanvas = document.getElementById(element).getContext("2d");
        var data = { Id: 1,  Date: $('#maindatapicker').text()};
        var ajaxResult;
        var time = performance.now();
        $.ajax({
            async: false,
            type: "POST",
            url: Url,
            data: { data },
            success: function (result) {
                ajaxResult = result;
            }
        });
        var barChart = new Chart(popCanvas, {
            type: 'bar',
            data: {
                labels: ajaxResult.Names,
                datasets: [{
                    label: firstDescription,
                    data: ajaxResult.FirstColumn,
                    backgroundColor: '#72A0CA',
                    yAxisID: "first"
                },
                {
                    label: secondDescription,
                    data: ajaxResult.SecondColumn,
                    backgroundColor: '#A6522C',
                    yAxisID: "second"
                }]

            },
            options: {
                legend: {
                    position: 'bottom'
                },
                scales: {
                    yAxes: [{
                        id: "first",
                        position: "left",
                        ticks: {
                            beginAtZero: true
                        }
                    },
                    {
                        id: "second",
                        position: "right",
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    } 
}
//function GetFourthChartWithOutProcent() {
//    Chart.defaults.global.defaultFontColor = "#255783";
//    var popCanvas = document.getElementById("tpocpChart").getContext("2d");
//    var data = { Id: 1 };
//    var ajaxResult;
//    var time = performance.now();
//    $.ajax({
//        async: false,
//        type: "POST",
//        url: "/Home/GetDataByGet",
//        data: { data },
//        success: function (result) {
//            ajaxResult = result;
//        }
//    });
//    var barChart = new Chart(popCanvas, {
//        type: 'bar',
//        data: {
//            labels: ajaxResult.Names,
//            datasets: [{
//                label: "Беру Клиента",
//                data: ajaxResult.Values,
//                backgroundColor: '#72A0CA'
//            }]

//        }
//        , options: {
//            legend: {
//                position: 'bottom'
//            }
//        }
//    });
//    time = performance.now() - time;
//    console.log('Время выполнения = ', time);
//}
function GetPieChart(element, dates,labels, description) {
    var popCanvas = document.getElementById(element).getContext("2d");
 
    var barChart = new Chart(popCanvas, {
        type: 'pie',
 
        data: {
            labels: labels,
            datasets: [{ 
                data: dates,
                backgroundColor: ['#8B0000', '#808000', '#20B2AA', '#696969', '#483D8B', '#800080', '#778899']
            }]

        }
        , options: {
            legend: {
                position: 'bottom'
            },
            title: {
                display: true,
                text: description
            }
        }
    }); 
}
function GetBarChartOnColumn(element, Url, description) {
    Chart.defaults.global.defaultFontColor = "#255783";
    if (document.getElementById(element) != null) {
        var popCanvas = document.getElementById(element).getContext("2d");
        var data = { Date: $('#maindatapicker').text() };
        var ajaxResult;
        var time = performance.now();
        $.ajax({
            async: false,
            type: "POST",
            url: Url,
            data: { data },
            success: function (result) {
                ajaxResult = result;
            }
        });
        var barChart = new Chart(popCanvas, {
            type: 'bar',
            data: {
                labels: ajaxResult.Names,
                datasets: [{
                    label: description,
                    data: ajaxResult.Values,
                    backgroundColor: '#72A0CA'
                }]

            }
            , options: {
                legend: {
                    position: 'bottom'
                }
            }
        });
    }
}

function FirstReport() {
    $("#FirstReport").show();
    //GetFirstPartical();
   // GetFirstChart();
}
//function GetSecondPartOnePartical() {
//    $.get("/Home/SecondReportPartOne", "text", function (result) {
//        $("#srpo").html(result).promise().done(function () {
//            //alert("Done");
//            GetBarChartOnColumn("srpoChart", "/Home/SecondReportPartOneChart", "Размечено");
//        });
//    })
//}
function SecondReport() {
    $("#SecondReport").show();
    //GetSecondPartOnePartical();
}
function ThirdReport() {
    $("#ThirdReport").show();
    //GetSecondPartOnePartical();
}
function FourthReport() {
    $("#FourthReport").show();
    //GetSecondPartOnePartical();
}

/*
//function GetThirdPartical() {
//    $.get("/Home/ThirdReport", "text", function (result) {
//        $("#tcp").html(result);
//    })
//}
//function GetForthPartical() {
//    $.get("/Home/FourthReportByGet", "text", function (result) {
//        $("#tpocp").html(result);
//    });
//    GetFourthChartWithOutProcent();
//    $.get("/Home/FourthReportByInterested", "text", function (result) {
//        $("#tptwcp").html(result);
//    });
//    GetFourthChartWithProcent("tptwcpChart", "/Home/GetDataByInterested", "Интерес есть, контакт взял", "Интерес есть, контакт взял, %");
//    $.get("/Home/FourthReportByCantsSearch", "text", function (result) {
//        $("#tpthcp").html(result);
//    });
//    GetFourthChartWithProcent("tpthcpChart", "/Home/GetDataByCantsSearch", "Не нашёл в зале", "Не нашёл в зале, %");

//}
//function ThirdReport() {
//    $("#ThirdReport").show();
//    GetThirdPartical();
//}
//function FourthReport() {
//    $("#FourthReport").show();
//    GetForthPartical();
//}
//function FifthReport() {
//    $("#FifthReport").show();
//    GetFifthPartical();
//}
//function GetFifthPartical() {
//    $.get("/Home/FifthReport", "text", function (result) {
//        $("#ficp").html(result);
//    })
//}
*/