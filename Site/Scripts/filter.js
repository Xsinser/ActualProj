var Filter = (function() {
    return {

        loadDataForPeriod: function () {

            var dates = Filter.setAndDrawPeriods();

            if (Common.isLand() || Common.isOoh() || Common.isIndoor()) {

                loadOverviewAppearanceIsland(dates, 1);

            } else {

                loadOverviewAppearance(dates, 1);
            }
        },
        setAndDrawPeriods: function() {

        var startDate;
        var endDate;
        var startCompareDate;
        var endCompareDate;

        var values_ck = $.cookie("basket-data");


        if (values_ck) {
            //если есть кука, мы используем её, так же здесь проверяем, стоит ли флажок сравнения
            var event = JSON.parse(values_ck);
            startDate = new Date(event.dr1from);
            endDate = new Date(event.dr1to);
            if (event.comparisonEnabled) {
                startCompareDate = new Date(event.dr2from);
                endCompareDate = new Date(event.dr2to);
            }

        }
        else {
            startDate = Filter.getStartDateFilter();
            endDate = Filter.getEndDateFilter();
            startCompareDate = Filter.getStartCompareDateFilter();
            endCompareDate = Filter.getEndCompareDateFilter();
        }


        $(".currentPeriod,.comparePeriod").removeClass('weekend');

        var currentPeriodText = startDate.format("dd.mm.yyyy");
        if (startDate.getDate() != endDate.getDate() || startDate.getMonth() != endDate.getMonth() || startDate.getYear() != endDate.getYear()) {
            currentPeriodText += ' - ' + endDate.format("dd.mm.yyyy");
        } else if (startDate.getDay() == 6 || startDate.getDay() == 0) {
            $(".currentPeriod").addClass('weekend');
        }
        $(".currentPeriod").html(currentPeriodText);
        if (startCompareDate != null) {
            var comparePeriodText = startCompareDate.format("dd.mm.yyyy");
            if (startCompareDate.getDate() != endCompareDate.getDate() || startCompareDate.getMonth() != endCompareDate.getMonth() || startCompareDate.getYear() != endCompareDate.getYear()) {
                comparePeriodText += ' - ' + endCompareDate.format("dd.mm.yyyy");
            } else if (startCompareDate.getDay() == 6 || startCompareDate.getDay() == 0) {
                $(".comparePeriod").addClass('weekend');
            }
            $(".comparePeriod").html(comparePeriodText);
            $(".compareContainer").css('display', '');
            $("#yesterdayLegend").css('display', '');
        } else {
            $(".comparePeriod").html('');
            $(".compareContainer").css('display', 'none');
            $("#yesterdayLegend").css('display', 'none');
        }
            var dates = { startDate: Filter.getStartDateFilterString(), endDate: Filter.getEndDateFilterString(), startCompareDate: Filter.getStartCompareDateFilterString(), endCompareDate: Filter.getEndCompareDateFilterString() };
        return dates;
        },
        setFiltersDates: function(startDate, endDate, startCompareDate, endCompareDate) {
            $('.date-ranges-picker').DatePickerSetDate([startDate, endDate, startCompareDate, endCompareDate], true);
        },
        getYesterdayDateFilter: function () {

            var date = Filter.getTodayDate();

           
            var yesterdayFilterStartDate = new Date(date.todayYear, date.todayMonth, date.todayDay);
            yesterdayFilterStartDate.setDate(yesterdayFilterStartDate.getDate() - 1);
            var yesterdayFilterEndDate = new Date(yesterdayFilterStartDate.getFullYear(), yesterdayFilterStartDate.getMonth(), yesterdayFilterStartDate.getDate(), 23, 59);

            return { Start: yesterdayFilterStartDate, End: yesterdayFilterEndDate };
        },
        getTodayDateFilter: function () {

            var date = Filter.getTodayDate();

            var todayFilterStartDate = new Date(date.todayYear, date.todayMonth, date.todayDay);
            var todayFilterEndDate = new Date(date.todayYear, date.todayMonth, date.todayDay, 23, 59);

            return { Start: todayFilterStartDate, End: todayFilterEndDate };
        },
        getTodayDate: function () {

            var date = new Date(Date.now());

            return {

                todayDay: date.getDate(),
                todayMonth: date.getMonth(),
                todayYear: date.getFullYear()
            };

        },
        getFilter: function (startDate, endDate, chartTypes, step, isCompare) {

            var filter = {
                Start: startDate,
                End: endDate,
                Step: step,
                ChartTypes: chartTypes,
                IsCompare: isCompare
            };
            return filter;
        },
        getFilters: function (startDate, endDate, startCompareDate, endCompareDate, chartTypes, step) {

            var items = [];
            //var yesterdayDateFilter = Filter.getYesterdayDateFilter();
            //var todayDateFilter = Filter.getTodayDateFilter();

            items.push({
                Start: startDate,
                End: endDate,
                Step: step,
                ChartTypes: chartTypes,
                IsCompare: false
            });

            items.push({
                Start: startCompareDate,
                End: endCompareDate,
                Step: step,
                ChartTypes: chartTypes,
                IsCompare: false
            });

            return items;
        },
        getCorrectHour: function(startDate){

            return startDate.getTimezoneOffset() == -240 ? 0 : 0;
        },
        getStartDateFilterString: function (calendar) {

            return Filter.getStartDateFilter(calendar).format(dateFormat.masks.isoDateTime);
        },
        getEndDateFilterString: function (calendar) {

            return Filter.getEndDateFilter(calendar).format(dateFormat.masks.isoDateTime);
        },
        getStartCompareDateFilterString: function (calendar) {

            var date = Filter.getStartCompareDateFilter(calendar);

            return date == null ? null : Filter.getStartCompareDateFilter(calendar).format(dateFormat.masks.isoDateTime);
        },
        getEndCompareDateFilterString: function (calendar) {

            var date = Filter.getEndCompareDateFilter(calendar);

            return date == null ? null : Filter.getEndCompareDateFilter(calendar).format(dateFormat.masks.isoDateTime);
        },
        getStartDateFilter: function(calendar) {
            if (calendar == null || $(calendar + '.pickerContainer.widget:visible:first').length == 0) {
                calendar = 'li.active-item ';
            }

            var t = $(calendar + '.pickerContainer.widget:first').data('DateRangesWidget');
            if (t != null) {
                var startDate = t.options.values.dr1from;
                return new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), Filter.getCorrectHour(startDate), 0, 0);
            }
            return new Date(Date.now());
        },
        getEndDateFilter: function (calendar) {

            if (calendar == null || $(calendar + '.pickerContainer.widget:visible:first').length == 0) {

                calendar = 'li.active-item ';
            }

            var t = $(calendar + '.pickerContainer.widget:first').data('DateRangesWidget');

            if (t != null) {

                var endDate = t.options.values.dr1to;
                return new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 999);
            }
            return new Date(Date.now());
        },
        getStartCompareDateFilter: function (calendar) {

            if (calendar == null || $(calendar + '.pickerContainer.widget:visible:first').length == 0) {
                calendar = 'li.active-item ';
            }
            var values = $(calendar + '.pickerContainer.widget:first').data('DateRangesWidget');

            if (values != null && values.options.values.comparisonEnabled) {

                var startCompare = values.options.values.dr2from;
                return new Date(startCompare.getFullYear(), startCompare.getMonth(), startCompare.getDate(), Filter.getCorrectHour(startCompare), 0, 0);

            } else {

                return null;
            }
        },
        getEndCompareDateFilter: function(calendar) {
            if (calendar == null || $(calendar + '.pickerContainer.widget:visible:first').length == 0) {
                calendar = 'li.active-item ';
            }
            var values = $(calendar + '.pickerContainer.widget:first').data('DateRangesWidget');
            if (values != null && values.options.values.comparisonEnabled) {
                var endCompare = values.options.values.dr2to;
                return new Date(endCompare.getFullYear(), endCompare.getMonth(), endCompare.getDate(), 23, 59, 59, 999);
            } else {
                return null;
            }
        },
        getPeriodText: function (startDateS, endDateS) {

            if (startDateS instanceof Date) {

                startDate = new Date(startDateS);
                endDate = new Date(endDateS);

            } else {

                startDate = Filter.getDateFromString(startDateS);
                endDate = Filter.getDateFromString(endDateS);
            }
            var startDateWithOutTime = startDate.getDate() + '.' + startDate.getMonth() + '.' + startDate.getFullYear();
            var endDateDateWithOutTime = endDate.getDate() + '.' + endDate.getMonth() + '.' + endDate.getFullYear();

            var currentPeriodText = Filter.pad(startDate.getDate()) + '.' + Filter.pad(startDate.getMonth() + 1) + '.' + startDate.getFullYear();
            if (startDateWithOutTime != endDateDateWithOutTime) {
                currentPeriodText += ' - ' + Filter.pad(endDate.getDate()) + '.' + Filter.pad(endDate.getMonth() + 1) + '.' + endDate.getFullYear();
            }

            return currentPeriodText;
        },
        getDateFromHashOrDefault: function(parametrName) {

            var e = $.bbq;
            if (e.getState(parametrName) != null && e.getState(parametrName) != '') {
                return Filter.getDateFromString(e.getState(parametrName));
            }
            return null;
        },
        getDateFromString: function (val) {

            var datePart = val.split('T');
            var dateText = datePart[0].split('-');
            var year = dateText[0] * 1;
            var month = (dateText[1] * 1 - 1);
            var day = dateText[2] * 1;
            return new Date(year, month, day);
        },
        // todo: need to refactor
        parseFloatInDays: function (minutes, separator) {

            if (minutes == null) {

                return 'N/A';
            }
            var intDays = Math.floor(minutes / (60 * 24));
            var daysText = intDays > 0 ? intDays + Code52.Language.Dictionary.DayShortFromat + ' ' : '';

            minutes = minutes - intDays * 60 * 24;

            var intMin = Math.floor(minutes / 60);

            var double = Math.round(minutes - intMin * 60);

            if (separator == null) {

                return daysText + Filter.pad(intMin) + ':' + Filter.pad(double);

            } else {

                return daysText + separator + Filter.pad(intMin) + ':' + Filter.pad(double);
            }

        },
        // todo: need to refactor
        parseFloatMinutes: function (minutes) {

            if (minutes == null) {

                return 'N/A';
            }
            var intMin = Math.floor(minutes);

            var double = ((minutes - intMin) * 60).toFixed(0);
            if (double == 60) {
                double = 0;
                intMin += 1;
            }
            return Filter.pad(intMin) + ':' + Filter.pad(double);
        },
        pad: function (d) {

            return (d < 10) ? '0' + d.toString() : d.toString();
        },
        prepareForExport: function (id) {

            if ($(id).length > 0) {
                var chart = $(id).highcharts();
                if (chart != null) {
                    chart.setSize($(id).parent().width(), $(id).height(), false);
                }
            }

        },
        removeOpacity: function () {

            var nodes = document.querySelectorAll('[fill^="rgba"]');
            for (nodeIter = 0; nodeIter < nodes.length; nodeIter += 1) {

                elem = nodes[nodeIter];
               
                var fill = elem.getAttribute('fill');
                var cleaned = fill.replace('rgba(', '').replace(')', '');
                var arr = cleaned.split(',');
                var color = 'rgb(' + arr[0] + ',' + arr[1] + ',' + arr[2] + ')';
                elem.setAttribute('fill', color);
                elem.setAttribute('opacity', arr[3]);
            }
        }



    };
})();








































var DateDiff = {

    inHours: function (d1, d2) {
        var t2 = new Date(d2).getTime();
        var t1 = new Date(d1).getTime();

        return parseInt((t2 - t1) / (3600 * 1000));
    },
    
    inDays: function (d1, d2) {
        var t2 = new Date(d2).getTime();
        var t1 = new Date(d1).getTime();

        return parseInt((t2 - t1) / (24 * 3600 * 1000));
    },

    inWeeks: function (d1, d2) {
        var t2 = new Date(d2).getTime();
        var t1 = new Date(d1).getTime();

        return parseInt((t2 - t1) / (24 * 3600 * 1000 * 7));
    },

    inMonths: function (d1, d2) {
        var d1Y = new Date(d1).getFullYear();
        var d2Y = new Date(d2).getFullYear();
        var d1M = new Date(d1).getMonth();
        var d2M = new Date(d2).getMonth();

        return (d2M + 12 * d2Y) - (d1M + 12 * d1Y);
    },

    inYears: function (d1, d2) {
        return new Date(d2).getFullYear() - new Date(d1).getFullYear();
    }
}