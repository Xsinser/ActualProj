function HighchartsManager() {
}

HighchartsManager.RenderChart = function (containerName, titleText, subtitleText, xAxisData, yAxisData, seriesData) {
    Highcharts.chart(containerName, {
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: titleText
        },
        subtitle: {
            text: subtitleText
        },
        xAxis: xAxisData,
        yAxis: yAxisData,
        tooltip: {
            shared: true
        },
        legend: {
            enabled: false
        },
        series: seriesData
    });
}

HighchartsManager.CustomLegendRender = function (container) {

    $('.legendMain').empty();
    if (($.bbq.getState('StartCompareDate') != null || $.bbq.getState('StartCompareDate') != undefined) && ($.bbq.getState('EndCompareDate') != null || $.bbq.getState('EndCompareDate') != undefined)) {

        var adder = "";
        adder += '<div  class="row justify-content-center" >';

        adder += '<div  class="col col-auto" > <p style="text-align:center">' + UrlStateManager.getDateDiapason('StartDate', 'EndDate')+'</p> </div>';

        var chart = $($('div[id^=' + container + ']:visible')).highcharts();
        for (var i = 0; i < chart.series.length; i+=2) {
            if (chart.series[i].userOptions.id == undefined) {
                adder += '<div  class="col col-auto" >';
                adder += ('<span class="legendItem' + 1 + ' col-auto">' + FabricatorOdElements.GetMainReportLegendElement(chart.series[i].color, i, chart.series[i].name, Code52.Language.Dictionary.Trend, true, Code52.Language.Dictionary.Average, container) + '' + '</span>');
                adder += '</div>';
            }
        }
        adder += '</div>';
        adder += '<div  class="row justify-content-center" >';

        adder += '<div  class="col col-auto" > <p style="text-align:center">' + UrlStateManager.getDateDiapason('StartCompareDate', 'EndCompareDate') +'</p> </div>';

        var chart = $($('div[id^=' + container + ']:visible')).highcharts();
        for (var i = 1; i < chart.series.length; i += 2) {
            if (chart.series[i].userOptions.id == undefined) {
                adder += '<div  class="col col-auto" >';
                adder += ('<span class="legendItem' + 1 + ' col-auto">' + FabricatorOdElements.GetMainReportLegendElement(chart.series[i].color, i, chart.series[i].name, Code52.Language.Dictionary.Trend, true, Code52.Language.Dictionary.Average, container) + '' + '</span>');
                adder += '</div>';
            }
        }
        adder += '</div>';
        $('.legendMain').append(adder);
    }
    else {
        var chart = $($('div[id^=' + container + ']:visible')).highcharts();
        for (var i = 0; i < chart.series.length; i++) {
            if (chart.series[i].userOptions.id == undefined) {
                $('.legendMain').append('<span class="legendItem' + 1 + ' col-auto">' + FabricatorOdElements.GetMainReportLegendElement(chart.series[i].color, i, chart.series[i].name, Code52.Language.Dictionary.Trend, true, Code52.Language.Dictionary.Average, container) + '' + '</span>');

            }
        }

    }
}

HighchartsManager.legendClick = function (e) {



    var e = window.event || e;
    var targ = e.target || e.srcElement;

    var initTarget = $(targ);
    var target = initTarget;
    var chartName = $(targ).attr('chartAreaId');
    var type = $(targ).attr('chartType');
    var chartId = $(targ).attr('id');
    var chart_Id = chartName;
    var charts = $('div[id^=' + chart_Id + ']:visible');
    if (target[0].nodeName == 'LABEL') {
        var ee = $('input[charttypeid^=' + chartId + ']:visible');
    }
    else {

        //cs .match(/\d/g).join(""); $('.legendHeader[charttypeid=0]').text()
        if ($('#' + chartId).is(':checked') == true) {
            var chart = $(charts[0]).highcharts();
            var name = $('.legendHeader[charttypeid=' + chartId.match(/\d/g).join("") + ']').text() + ' ' + $('#' + chartId.replace('i', '')).text();
            var newChartId = $('#' + chartId.replace('i', '')).attr('chartType');
            var valueArr = [];
            if ('trend' == type.split(' ')[0]) {
                valueArr = HighchartsManager.GetTrendlineData(chart.series[type.split(' ')[1]].yData);
            }
            if ('avr' == type.split(' ')[0]) {
                valueArr = HighchartsManager.GetAvrData(chart.series[type.split(' ')[1]].yData);
            }
            HighchartsManager.addSeries(chart, newChartId, valueArr,
                name, 'line', 'Dash', chart.series[type.split(' ')[1]].color);
        }
        else {
            var chart = $(charts[0]).highcharts();
            var newChartId = $('#' + chartId.replace('i', '')).attr('chartType');
            HighchartsManager.removeSeriesByUserOptionsId(chart, newChartId);
        }
        //alert($('#' + chartId + ' #' + chartId).val());

        var a = 11;
    }

    if ($('#' + chartId + ' #' + chartId).val() != 'on') {


    }
    if (target[0].control != null) {
        target = $(target[0].control);
    }
    //legendHandler(target);


    return false;
}

HighchartsManager.legendHeaderClick = function (e) {

    var e = window.event || e;
    var header = e.target || e.srcElement;
    var chartId = $(header).attr('chartAreaId');
    var charttypeId = $(header).attr('charttypeid') * 1;
    //get id div with chart -> chartAreaName.__browserLink_sourceMapping.selectorData.selector
    var charts = $('div[id^=' + chartId + ']:visible');
    if (charts.length == 0) {
        return;
    }
    var chart = $(charts[0]).highcharts();

    chart.series[charttypeId].setVisible(!chart.series[charttypeId].visible, true);
    if (chart.series[charttypeId].visible)
        return true;
    else
        return false;
}

HighchartsManager.addSeries = function (chart, id, seriesData, seriesName, seriesType = 'line', seriesDashstyle = 'Solid', color) {
    chart.addSeries({ data: seriesData, id: id, name: seriesName, type: seriesType, color: color, dashStyle: seriesDashstyle }, false);
    chart.redraw();
}
HighchartsManager.removeSeriesByUserOptionsId = function (chart, id) {
    for (var i = 0; i < chart.series.length; i++) {
        if (chart.series[i].userOptions.id == id) {
            chart.series[i].remove(true);
        }
    }
    chart.redraw();
}
HighchartsManager.GetTrendlineData = function (data) {
    var a = 0;
    var b = 0;
    var sumXY = 0;
    var sumX = 0;
    var sumY = 0;
    var avX = 0;
    var avY = 0;
    var sumSqrX = 0;
    var res = [];
    for (let i = 0; i < data.length; i++) {
        sumX += (i + 1);
        sumY += data[i];
        sumXY += (i + 1) * data[i];
        sumSqrX += (i + 1) * (i + 1);
    }
    avX = sumX / 12;
    avY = sumY / 12;
    b = (sumXY - data.length * avX * avY) / (sumSqrX - data.length * (avX * avX));
    a = avY - b * avX;
    for (let i = 0; i < data.length; i++) {
        res.push(a + b * (i + 1));
    }
    return res;
}

HighchartsManager.GetAvrData = function (data) {
    var sum = 0;
    var count = 0;
    var res = [];
    for (let i = 0; i < data.length; i++) {
        count++;
        sum+= data[i];
    }
    var avrVal = sum / count; 
    for (let i = 0; i < data.length; i++) {
        res.push(avrVal);
    }
    return res;
}

HighchartsManager.createXAxsisData = function (values) {
    var result =
        [{
            categories: values,
            crosshair: true
        }];
    return result;
}
HighchartsManager.createYAxsisData = function (values) {
    var result = [];
    if (values != null) {
        for (var i = 0; i < values.length; i++) {
            result.push({
                labels: {
                    format: '{value}',
                    style: {
                        color: Highcharts.getOptions().colors[i]
                    }
                },
                title: {
                    text: values[i],
                    style: {
                        color: Highcharts.getOptions().colors[i]
                    }
                },
                opposite: (i % 2 == 0) ? true : false
            });
        }
    }
    return result;
}




HighchartsManager.createSeriesData = function (values) {
    var result = [];
    if (values.YAxsisData != null && values.SeriesData != null) {
        for (var i = 0; i < values.YAxsisData.length; i++) {
            result.push({
                name: values.YAxsisData[i],
                type: 'column',
                yAxis: i,
                data: values.SeriesData[i],
                tooltip: {
                    valueSuffix: ''
                }
            });
        }
    }
    return result;
}
HighchartsManager.UpdateMainHighcharts = function (url, data, container, title, subtitle) {
    $.ajax({
        async: false,
        type: "POST",
        data: data,
        url: url,
        success: function (ajaxResult) {
            var result = {
                XAxsisData: HighchartsManager.createXAxsisData(ajaxResult.XAxsisData),
                YAxsisData: HighchartsManager.createYAxsisData(ajaxResult.YAxsisData),
                SeriesData: HighchartsManager.createSeriesData(ajaxResult)
            }
            if ($('div#' + container + ':visible').highcharts() != null)
                $('div#' + container + ':visible').highcharts().destroy();

            HighchartsManager.RenderChart(container, title, subtitle, result.XAxsisData, result.YAxsisData, result.SeriesData);
            HighchartsManager.CustomLegendRender(container);
            return result;
        }
    });
}
HighchartsManager.createMainHighcharts = function (url, data, container, title, subtitle) {
    $.ajax({
        async: false,
        type: "POST",
        data: data,
        url: url,
        success: function (ajaxResult) {
            var result = {
                XAxsisData: HighchartsManager.createXAxsisData(ajaxResult.XAxsisData),
                YAxsisData: HighchartsManager.createYAxsisData(ajaxResult.YAxsisData),
                SeriesData: HighchartsManager.createSeriesData(ajaxResult)
            }
            HighchartsManager.RenderChart(container, title, subtitle, result.XAxsisData, result.YAxsisData, result.SeriesData);
            HighchartsManager.CustomLegendRender(container);
            return result;
        }
    });
}