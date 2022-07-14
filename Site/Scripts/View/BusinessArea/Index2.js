function BusinessArea_Index() { }

BusinessArea_Index.Init = function () {
    $.ajax({
        async: false,
        type: "POST",
        data: { includeCam : false, includeZone : true },
        url: "/Tree/GetTree",
        success: function (result) {
            var treeValues = result.tree;
            var treeOnSelectEvent = TreeManager.onNodeSelected;
            TreeManager.initialize(treeValues, treeOnSelectEvent,'BusinessArea_Index.updateCharts',3);
        }
    });

   
    BusinessArea_Index.bbqInit();
    $(".btn-check").click(function () {
        var gran = $(this).attr("id").replace("option", "");
        $.bbq.pushState({ Granularity: gran });
        BusinessArea_Index.OnOkClick();
    });
}

BusinessArea_Index.bbqInit = function () {
    if ($.bbq.getState('StartDate') == null || $.bbq.getState('StartDate') == undefined) {
        var startDate = new Date(new Date(Date.now()).getTime() - (86400000 * 7));
        startDate = startDate.getFullYear() + '-' + ("0" + (startDate.getMonth() + 1)).slice(-2) + '-' + ("0" + startDate.getDate()).slice(-2);
        $.bbq.pushState({ StartDate: startDate });
    }
    if ($.bbq.getState('EndDate') == null || $.bbq.getState('EndDate') == undefined) {
        var endDate = new Date(new Date(Date.now()).getTime());
        endDate = endDate.getFullYear() + '-' + ("0" + (endDate.getMonth() + 1)).slice(-2) + '-' + ("0" + endDate.getDate()).slice(-2);
        $.bbq.pushState({ EndDate: endDate });
    }
    if ($.bbq.getState('Step') == null || $.bbq.getState('Step') == undefined) {
        $.bbq.pushState({ Step: "Day" });
    }
    if ($.bbq.getState('selectedTreeItems') == null || $.bbq.getState('selectedTreeItems') == undefined) {
        $.bbq.pushState({ selectedTreeItems: "network" });
    }
    if ($.bbq.getState('ChartTypes') == null || $.bbq.getState('ChartTypes') == undefined) {
        $.bbq.pushState({ ChartTypes: "1,2" });
    }
    if ($.bbq.getState('Granularity') == null || $.bbq.getState('Granularity') == undefined) {
        $.bbq.pushState({ Granularity: "2" });
    }

    BusinessArea_Index.bbqFillPageByState('#tree');
}
BusinessArea_Index.bbqFillPageByState = function (treeDiv) {
    if ($.bbq.getState('selectedTreeItems') == "network") {
        $(treeDiv).dynatree("getTree").getNodeByKey('network').select(true);
    }
    else {
        var nodesId = $.bbq.getState("selectedTreeItems").split(',');
        nodesId.forEach((item) => {
            $(treeDiv).dynatree("getTree").getNodeByKey(item).select(true);
        });
    }
    var startDateD = $.bbq.getState('StartDate');
    var endDateD = $.bbq.getState('EndDate');
    var granularity = $.bbq.getState('Granularity');
    var startDateC = null;
    var endDateC = null;
    if ($.bbq.getState('StartCompareDate') != null || $.bbq.getState('StartCompareDate') != undefined) {
        startDateC = $.bbq.getState('StartCompareDate');
    }
    if ($.bbq.getState('EndCompareDate') != null || $.bbq.getState('EndCompareDate') != undefined) {
        endDateC = $.bbq.getState('EndCompareDate');
    } 
    $('.pickerContainer.widget').DateRangesWidget({
        aggregations: [],
        values: {
            dr1from: new Date(startDateD),
            dr1to: new Date(endDateD),
            dr2from: startDateC != null ? new Date(startDateC): null ,
            dr2to: endDateC != null ? new Date(endDateC) : null ,
            daterangePreset: 'custom',
            comparisonPreset: 'previousperiod',
            comparisonEnabled: (startDateC != null && endDateC != null),
            okCallBack: BusinessArea_Index.OnOkClick,
            inline: true
        }
    });

    $('#option' + granularity).attr('checked', true);

    HighchartsManager.createMainHighcharts("/Highcharts/GetMainHighcharts"
        , {
            StartDate: $.bbq.getState('StartDate')
            , EndDate: $.bbq.getState('EndDate')
            , SelectedTreeItems: $.bbq.getState('selectedTreeItems')
            , Granularity: $.bbq.getState('Granularity')
        }, 'highchartsMainContainer', Code52.Language.Dictionary.Visits, '');
}

BusinessArea_Index.OnOkClick = function () {
    HighchartsManager.UpdateMainHighcharts("/Highcharts/GetMainHighcharts"
        , {
            StartDate: $.bbq.getState('StartDate')
            , EndDate: $.bbq.getState('EndDate')
            , SelectedTreeItems: $.bbq.getState('selectedTreeItems')
            , Granularity: $.bbq.getState('Granularity')
        }, 'highchartsMainContainer', Code52.Language.Dictionary.Visits, '');
}

