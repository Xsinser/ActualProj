function BusinessArea_ElementReport() { }

BusinessArea_ElementReport.Init = function () {

    $.ajax({
        async: false,
        type: "POST",
        url: "/Tree/GetTreeOnlyCams",
        success: function (result) {
            var treeValues = result.tree;
            var treeOnSelectEvent = TreeManager.onNodeSelected;
            TreeManager.initialize(treeValues, treeOnSelectEvent, 'BusinessArea_ElementReport.onClickButtonLoadImages', 1);
        }
    });


    BusinessArea_ElementReport.bbqInit();

}

BusinessArea_ElementReport.bbqInit = function () {
    if ($.bbq.getState('Date') == null || $.bbq.getState('Date') == "undefined") {
        var date = new Date();
        date = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2);
        $.bbq.pushState({ Date: date });
    }

    if ($.bbq.getState('StartTime') == null || $.bbq.getState('StartTime') == "undefined") {
        var dt = new Date();

        $.bbq.pushState({ StartTime: dt.getHours() + "-" + "00" });
    }

    if ($.bbq.getState('Position') == null || $.bbq.getState('Position') == "undefined") {


        $.bbq.pushState({ Position: 0 });
    }

    if ($.bbq.getState('EndTime') == null || $.bbq.getState('EndTime') == "undefined") {
        var dt = new Date();
        $.bbq.pushState({ EndTime: dt.getHours() + "-" + "59" });
    }
    var endTime = $.bbq.getState('EndTime');
    var startTime = $.bbq.getState('StartTime');


    if (Number(endTime.split('-')[0]) < Number(startTime.split('-')[0])) {

        $.bbq.pushState({ EndTime: Number(startTime.split('-')[0]) + "-59" });
    }


    if ($.bbq.getState('selectedTreeItems') == null || $.bbq.getState('selectedTreeItems') == "undefined") {
        $.bbq.pushState({ selectedTreeItems: "network" });
    }


    BusinessArea_ElementReport.bbqFillPageByState('#tree', '#startDateD', '#endDateD', '#startDateC', '#endDateC');
}


BusinessArea_ElementReport.bbqFillPageByState = function (treeDiv, startDateD, endDateD, startDateC, endDateC) {
    if ($.bbq.getState('selectedTreeItems') == "network") {
        $(treeDiv).dynatree("getTree").getNodeByKey('network').select(true);
    }
    else {
        var nodesId = $.bbq.getState("selectedTreeItems").split(',');
        nodesId.forEach((item) => {
            $(treeDiv).dynatree("getTree").getNodeByKey(item).select(true);
        });
    }

    if ($.bbq.getState('Date') != new Date()) {
        var date = new Date();
        date = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2);
        $.bbq.pushState({ Date: date });
    }

    var startDateD = $.bbq.getState('Date');



    $('#from').datetimepicker({
        inline: true,
        dateFormat: '',
        lang: 'ru',
        datepicker: false,
        defaultTime: $.bbq.getState('StartTime'),
        timeFormat: 'hh:mm tt',
        onChangeDateTime: function (dp, $input) {
            var dt = new Date($input.val());
            $.bbq.pushState({ StartTime: (dt.getHours() < 10 ? "0" + dt.getHours() : dt.getHours()) + "-00" });
            var endTime = $.bbq.getState('EndTime');
            if (Number(endTime.split('-')[0]) < dt.getHours()) {
                $('#to').datetimepicker('setOptions', { defaultTime: dt.getHours() + ':59' });
                $('#to').datetimepicker('reset');
                $.bbq.pushState({ EndTime: (dt.getHours() < 10 ? "0" + dt.getHours() : dt.getHours()) + "-59" });
            }
        }
    });
    var allowTimes = [];
    for (i = 0; i < 24; i++) {
        allowTimes.push(i + ":59");
    }
    $('#to').datetimepicker({
        lang: "ru", inline: true,
        datepicker: false,
        dateFormat: '',
        defaultTime: $.bbq.getState('EndTime'),
        timeFormat: 'hh:mm tt',
        allowTimes: allowTimes,
        onChangeDateTime: function (dp, $input) {
            var dt = new Date($input.val());
            $.bbq.pushState({ EndTime: (dt.getHours() < 10 ? "0" + dt.getHours() : dt.getHours()) + "-59" });
            var startTime = $.bbq.getState('StartTime');
            if (Number(startTime.split('-')[0]) > dt.getHours()) {
                $('#from').datetimepicker('setOptions', { defaultTime: +dt.getHours() + ':00' });
                $('#from').datetimepicker('reset');
                $.bbq.pushState({ StartTime: (dt.getHours() < 10 ? "0" + dt.getHours() : dt.getHours()) + "-00" });
            }
        }
    });
    $('#datetimepicker').datetimepicker({
        inline: true,
        lang: 'ru',
        minDate: '1970/01/1',
        maxDate: (new Date()),
        timepicker: false,
        dayOfWeekStart: 1,
        defaultDate: startDateD,
        onSelectDate: function (dp, $input) {
            var date = new Date($input.val().split(" ")[0]);
            date = (date.getYear() + 1900) + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2);
            $.bbq.pushState({ Date: date });
        }
    });
    $('#MenuIndex').attr('checked', false);
    $('#MenuElementReportLabel').addClass('active'); 
}

BusinessArea_ElementReport.refreshPage = function () {

}

BusinessArea_ElementReport.onClickButtonLoadImages = function () {
    $.bbq.pushState({ Position: 0 });
    $.ajax({
        async: false,
        type: "POST",
        data: {
            Date: $.bbq.getState('Date'), StartTime: $.bbq.getState('StartTime'), EndTime: $.bbq.getState('EndTime'),
            treeArgs: $.bbq.getState('selectedTreeItems'), Position: $.bbq.getState('Position')
        },
        url: "/BusinessArea/EndlessFeed",
        success: function (result) {
            $('#endlessFeedMarker').empty();
            $('#endlessFeedMarker').append(result.htmlCode);
            $.bbq.pushState({ Position: result.Position });
            $("#isImagesLoadedFirstTime").val(1);

        }
    });
}
function showDefaultImage(img) {
    $(img).attr('src', 'https://svgshare.com/i/7bo.svg');
    $(img).off("error");
}
  
BusinessArea_ElementReport.onClickButtonCheckImagesCount = function () {
    $.ajax({
        async: false,
        type: "POST",
        data: {
            Date: $.bbq.getState('Date'), StartTime: $.bbq.getState('StartTime'), EndTime: $.bbq.getState('EndTime'),
            treeArgs: $.bbq.getState('selectedTreeItems')
        },
        url: "/BusinessArea/ElementReportCountImpages",
        success: function (result) {
            $("#countImagesAlert").css('visibility', 'visible');
            $("#countImagesAlert").html('Найдено ' + result.count + ' фото');
        }
    });

}