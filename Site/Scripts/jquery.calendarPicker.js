function CalendarModel() {

    var startDate = null;
    var endDate = null;
    /// <summary>
    /// The class for an aggreation tree object which is represented by the jquery.dynatree.js file.
    /// </summary>
}

jQuery.fn.calendarPicker = function (options) {
    // --------------------------  start default option values --------------------------
    if (!options.date || options.date == null) {
        options.date = new Date();
    }
    if (!options.endDate || options.endDate == null) {
        options.endDate = new Date(options.date);
        options.endDate.setDate(options.date.getDate() + 6);
    }
    if (typeof (options.years) == "undefined")
        options.years = 1;

    if (typeof (options.months) == "undefined")
        options.months = 3;

    if (typeof (options.days) == "undefined")
        options.days = 4;

    if (typeof (options.showDayArrows) == "undefined")
        options.showDayArrows = true;

    if (typeof (options.useWheel) == "undefined")
        options.useWheel = true;

    if (typeof (options.callbackDelay) == "undefined")
        options.callbackDelay = 50;

    if (typeof (options.monthNames) == "undefined")
        options.monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    monthsShort:
    if (typeof (options.dayNames) == "undefined")
        options.dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];


    // --------------------------  end default option values --------------------------

    var calendar = { currentDate: options.date, endDate: options.endDate };
    calendar.options = options;

    //build the calendar on the first element in the set of matched elements.
    var theDiv = this.eq(0);//$(this);
    theDiv.addClass("calBox");

    //empty the div
    theDiv.empty();


    var divYears = $("<div>").addClass("calYear");
    var divQuarters = $("<div>").addClass("calQuarter");
    var divMonths = $("<div>").addClass("calMonth");
    var divDays = $("<div>").addClass("calDay");


    theDiv.append(divYears).append(divQuarters).append(divMonths).append(divDays);

    calendar.changeDate = function (date, endDate) {
        var deferredCallBack = function () {
            if (typeof (options.callback) == "function") {
                if (calendar.timer)
                    clearTimeout(calendar.timer);

                calendar.timer = setTimeout(function () {
                    options.callback(calendar);
                }, options.callbackDelay);
            }
        };

        date = date.getFullYear() >= 2013 ? date : new Date('2013-01-01');

        calendar.currentDate = date;
        calendar.endDate = endDate;

        deferredCallBack();

        var fillYears = function (date) {
            var year = date.getFullYear() > 2015 ? date.getFullYear() : 2015;
            divYears.empty();
            var nc = options.years * 2 + 1;
            var w = parseInt((theDiv.width() - 4 - (nc) * 4) / nc) + "px";
            for (var i = year - options.years; i <= year + options.years; i++) {
                var d = new Date(i, 0, 1);
                var de = new Date(d.getFullYear(), 11, 31);
                var span = $("<span>").addClass("calElement").attr("millis", d.getTime()).attr("endMillis", de.getTime()).html(i).css("width", w);
                if (d.getYear() == calendar.currentDate.getYear())
                    span.addClass("selected");
                divYears.append(span);
            }
        };

        var fillQuarters = function (date) {
            var year = date.getFullYear() >= 2013 ? date.getFullYear() : 2015;
            divQuarters.empty();
            var w = parseInt((theDiv.width() - 4 - (4) * 4) / 4) + "px";
            for (var i = 0; i < 4; i++) {
                var d = new Date(year, i * 3, 1);
                var de = new Date(d.getFullYear(), d.getMonth() + 3, 0);
                var span = $("<span>").addClass("calElement").attr("millis", d.getTime()).attr("endMillis", de.getTime()).html(i + 1).css("width", w);
                if (Math.floor(d.getMonth() / 3) == Math.floor(calendar.currentDate.getMonth() / 3) && DateDiff.inDays(date, endDate) >= 1 && DateDiff.inDays(date, endDate) <= 92)
                    span.addClass("selected");
                divQuarters.append(span);
            }
        };

        var fillMonths = function (date) {
            var validDate = date.getFullYear() == 2013 && date.getMonth() <= 5 ? new Date('2013-05-01') : date;
            var month = validDate.getMonth();
            divMonths.empty();
            var nc = options.months * 2 + 1;
            var w = parseInt((theDiv.width() - 4 - (nc) * 4) / nc) + "px";
            for (var i = -options.months; i <= options.months; i++) {
                var d = new Date(date.getFullYear(), month + i, 1);

                var de = new Date(d.getFullYear(), d.getMonth() + 1, 0);
                var span = $("<span>").addClass("calElement").attr("millis", d.getTime()).attr("endMillis", de.getTime()).html(options.monthNames[d.getMonth()]).css("width", w);
                if (d.getYear() == calendar.currentDate.getYear() && d.getMonth() == calendar.currentDate.getMonth() && DateDiff.inDays(date, endDate) >= 1 && DateDiff.inDays(date, endDate) <= 31)
                    span.addClass("selected");
                divMonths.append(span);
            }
        };

        var fillDays = function (date) {
            var dates = getWeekDates(date);

            var maxDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
            var averageWeekStartDate = date.getDate();
            if (DateDiff.inDays(date, endDate) > 6 || DateDiff.inDays(date, endDate) <= 4) {
                averageWeekStartDate = date.getDate() > (maxDays / 2) ? date.getDate() : maxDays / 2;
            }

            if (date.getFullYear() != dates.WeekStartDate.getFullYear() || date.getMonth() != dates.WeekStartDate.getMonth() || date.getDate() != dates.WeekStartDate.getDate()) {
                /*calendar.currentDate = dates.WeekStartDate;
                calendar.endDate = dates.WeekEndDate;*/
            }

            var weekStartDateDay = date.getDate();
            var averageDateInMonth = new Date(date.getFullYear(), date.getMonth(), averageWeekStartDate);
            if (date.getFullYear() == 2013 && date.getMonth() == 0) {
                var avergaeDayForDefaultDate = 14; //middle date for January 2013
                averageDateInMonth = new Date(date.getFullYear(), date.getMonth(), weekStartDateDay > avergaeDayForDefaultDate ? weekStartDateDay : avergaeDayForDefaultDate);
            } else {
                averageDateInMonth = new Date(date.getFullYear(), date.getMonth(), averageWeekStartDate);
            }

            var weekstart = averageDateInMonth.getDate() - (averageDateInMonth.getDay() == 0 ? 6 : averageDateInMonth.getDay() - 1);
            averageDateInMonth = new Date(averageDateInMonth.setDate(weekstart));

            var day = averageDateInMonth.getDate();
            divDays.empty();
            var nc = options.days * 2 + 1;
            var w = parseInt((theDiv.width() - 4 - (options.showDayArrows ? 12 : 0) - (nc) * 4) / (nc - (options.showDayArrows ? 2 : 0))) + "px";
            for (var i = -options.days * 7; i <= options.days * 7; i += 7) {
                var d = new Date(averageDateInMonth);
                d.setDate(day + i);
                var de = new Date(d);
                de.setDate(d.getDate() + 6);
                var span = $("<span>").addClass("calElement").attr("millis", d.getTime()).attr("endMillis", de.getTime())
                if (i == -options.days && options.showDayArrows) {
                    span.addClass("prev");
                } else if (i == options.days && options.showDayArrows) {
                    span.addClass("next");
                } else {
                    span.html("<span class=dayNumber>" + d.getDate() + "<span style='font-size:10px;'>" + options.monthNames[d.getMonth()] + "</span>-" + de.getDate() + "<span style='font-size:10px;'>" + options.monthNames[de.getMonth()] + "</span>" + "</span>").css("width", w);
                    if (d.getYear() == dates.WeekStartDate.getYear() && d.getMonth() == dates.WeekStartDate.getMonth() && d.getDate() == dates.WeekStartDate.getDate() && DateDiff.inDays(dates.WeekStartDate, dates.WeekEndDate) <= 6)
                        span.addClass("selected");
                }
                divDays.append(span);

            }
        }

        var getWeekDates = function (date) {
            var weekStartDate = date;
            var weekStartDateDay = weekStartDate.getDate();
            weekStartDate = new Date(weekStartDate.getFullYear(), weekStartDate.getMonth(), weekStartDateDay);
            var weekstart = weekStartDate.getDate() - (weekStartDate.getDay() == 0 ? 6 : weekStartDate.getDay() - 1);
            weekStartDate = new Date(weekStartDate.setDate(weekstart));

            var datediff = DateDiff.inDays(date, weekStartDate);
            var weekEndDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
            weekEndDate.setDate(weekEndDate.getDate() + datediff);

            return {
                WeekStartDate: weekStartDate,
                WeekEndDate: weekEndDate,
            };
        };

        fillYears(date);
        fillQuarters(date);
        fillMonths(date);
        fillDays(date);
    };

    theDiv.click(function (ev) {
        var el = $(ev.target).closest(".calElement");
        if (el.hasClass("calElement")) {
            calendar.changeDate(new Date(parseInt(el.attr("millis"))), new Date(parseInt(el.attr("endMillis"))));
        }
    });

    calendar.changeDate(options.date, options.endDate);
    $('.calDay .calElement.selected').click();

    return calendar;
};