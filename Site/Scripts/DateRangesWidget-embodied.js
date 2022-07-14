/**
 * DateRange class represents date range and allows to change dateFrom and
 * dateTo via presets such as lastDays, lastWeeks, lastMonths, lastYears etc.
 */

function DateRange(date) {

    var referenceDate = date;
    var from = null;
    var to = null
    var firstDayOfWeek = 1;

    /**
	 * lastDays
	 */


    this.lastDays = function (days) {
        from = new Date();
        to = new Date();

        var ref = referenceDate;

        from = new Date(ref);
        from.setUTCDate(ref.getUTCDate() - days);

        to = new Date(ref);
        to.setUTCDate(ref.getDate() - 1);

        this.adjustUTCHours();

        return this;
    }

    this.lastDaysInclCurrent = function (days) {
        referenceDate.setUTCDate(referenceDate.getUTCDate() + 1);
        this.lastDays(days);

        return this;
    }

    /**
	 * lastWeeks
	 */
    this.lastWeeks = function (weeks) {
        from = this.getBeginningOfWeek();
        from.setUTCDate(from.getUTCDate() - (7 * weeks));

        to = new Date(from);
        to.setUTCDate(to.getUTCDate() + 6 + (7 * (weeks - 1)));

        this.adjustUTCHours();

        return this;
    }

    this.lastWeeksInclCurrent = function (weeks) {
        referenceDate.setUTCDate(referenceDate.getUTCDate() + 7);
        this.lastWeeks(weeks);

        return this;
    }

    this.lastWeeksWTY = function (weeks) {
        this.lastWeeks(weeks);
        this.setToYesterday();
        return this;
    }

    /**
	 * lastMonths
	 */
    this.lastMonths = function (months) {
        to = new Date(referenceDate);
        to.setUTCDate(0);

        from = new Date(to);
        from.setUTCDate(1);
        from.setUTCMonth(from.getMonth() - months + 1);

        this.adjustUTCHours();

        return this;
    }

    this.lastMonthsInclCurrent = function (months) {
        referenceDate.setUTCDate(1);
        referenceDate.setUTCMonth(referenceDate.getUTCMonth() + 1);
        this.lastMonths(months);

        return this;
    }

    this.lastMonthsMTY = function (months) {
        this.lastMonths(months);
        this.setToYesterday();
        return this;
    }

    /**
	 * lastQuarters
	 */
    this.lastQuarters = function (quarters) {
        to = new Date(referenceDate);
        to.setUTCDate(1);

        from = new Date(to);
        var quarter = Math.floor(to.getMonth() / 3) - 1;
        var from_mth = quarter * 3 - (quarters - 1) * 3;
        var to_mth = from_mth + 2 + (quarters - 1) * 3;

        from.setUTCMonth(from_mth);
        from.setUTCDate(1);

        to.setUTCMonth(to_mth + 1)
        to.setUTCDate(0);

        this.adjustUTCHours();

        return this;
    }

    this.lastQuartersInclCurrent = function (quarters) {
        this.lastQuarters(quarters);
        from.setUTCMonth(from.getUTCMonth() + 3);
        to.setUTCDate(1);
        to.setUTCMonth(to.getUTCMonth() + 4);
        to.setUTCDate(0);

        return this;
    }

    this.lastQuartersQTY = function (quarters) {
        this.lastQuarters(quarters);
        this.setToYesterday();
        return this;
    }

    /**
	 * lastYears
	 */
    this.lastYears = function (years) {
        var lastOfYear = new Date(referenceDate);
        lastOfYear.setUTCMonth(0);
        lastOfYear.setUTCDate(1);
        lastOfYear.setUTCDate(0);

        var firstOfYear = new Date(lastOfYear);
        firstOfYear.setUTCDate(1);
        firstOfYear.setUTCMonth(-12 * (years - 1));
        from = firstOfYear;
        to = lastOfYear;

        this.adjustUTCHours();

        return this;
    }

    this.lastYearsInclCurrent = function (years) {
        referenceDate.setUTCFullYear(referenceDate.getUTCFullYear() + 1);
        this.lastYears(years);

        return this;
    }

    this.lastYearsYTY = function (years) {
        this.lastYears(years);
        this.setToYesterday();
        return this;
    }

    /**
	 * Adjusts UTC time:
	 *  - date from to 00:00:00
	 *  - date to to 23:59:59
	 */
    this.adjustUTCHours = function () {
        from.setUTCHours(0, 0, 0, 0);
        to.setUTCHours(23, 59, 59, 0);
    }

    this.setToYesterday = function () {
        to = new Date(referenceDate);
        to.setUTCDate(to.getUTCDate() - 1);
        to.setUTCHours(23, 59, 59, 0);
    }

    /**
	 * Returns Date which is in the beginning of the week (according to
	 * firstDayOfWeek).
	 */
    this.getBeginningOfWeek = function () {
        var ref = new Date(referenceDate);
        var day = ref.getUTCDay();
        var diff;
        switch (firstDayOfWeek) {
            case 0:
                diff = day;
                break;
            case 1:
                diff = day - (day == 0 ? -6 : 1); // adjust when day is sunday
                break;
            default:
                throw new Exception('Unsupported firstDayOfWeek');
        }
        ref.setUTCDate(ref.getUTCDate() - diff);
        ref.setUTCHours(0, 0, 0, 0);
        return ref;
    }

    /**
	 * Getters and setters
	 */

    /**
	 * Return "date from" of DateRange.
	 */
    this.getFrom = function () {
        return from;
    }

    /**
	 * Return "date to" of DateRange.
	 */
    this.getTo = function () {
        return to;
    }

    /**
	 * Gets firstDayOfWeek which is used for week presets.
	 * 
	 * Note: Sunday is 0, Monday is 1, and so on.
	 */
    this.getFirstDayOfWeek = function () {
        return firstDayOfWeek;
    }

    /**
	 * Sets firstDayOfWeek which is used for week presets.
	 * 
	 * Note: Sunday is 0, Monday is 1, and so on.
	 */
    this.setFirstDayOfWeek = function (day) {
        firstDayOfWeek = day;
        return this;
    }

}


(function ($) {
    var $current_target;
    var $dropdown;

    // form elements
    var $datepicker;
    var $parameters;
    var $daterangePreset;
    var $parameter1;
    var $aggregation;
    var $aggregationWrap;
    var $enableComparison;
    var $comparisonPreset;

    var default_options = {

        aggregations: ['-', 'daily', 'weekly', 'monthly', 'yearly'],
        values: {}

    };

    var default_aggregation = 'daily';

    var db = {

        aggregations: {
            '-': {
                title: "Inherit",
                presets: []
            },
            'hourly': {
                title: "Hourly",
                presets: ['custom', 'lastdays']
            },
            'daily': {
                title: "Daily",
                presets: ['custom', 'lastdays', 'yesterday', 'today']
            },
            'weekly': {
                title: "Weekly",
                presets: ['custom', 'lastweeks']
            },
            'monthly': {
                title: "Monthly",
                presets: ['custom', 'lastmonths']
            },
            'quarterly': {
                title: "Quarterly",
                presets: ['custom', 'lastquarters']
            },
            'yearly': {
                title: "Yearly",
                presets: ['custom', 'lastyears']
            },
            'whole': {
                title: "Whole period",
                presets: ['custom', 'lastdays', 'lastweeks', 'lastmonths', 'lastquarters', 'lastyears']
            }
        },

        date_presets: {
            'custom': {
                title: Code52.Language.Dictionary.SelectDate,
                dates: function () { return null; }
            },
            'today': {
                title: Code52.Language.Dictionary.Today,
                dates: function () {
                    var dates = [];
                    dates[0] = ((new Date()).setHours(0, 0, 0, 0)).valueOf();
                    dates[1] = new Date(dates[0]).setHours(23, 59, 59, 0).valueOf();
                    return dates;
                }
            },
            'yesterday': {
                title: Code52.Language.Dictionary.Yesterday,
                dates: function () {
                    var dates = [];
                    dates[0] = ((new Date()).setHours(0, 0, 0, 0)).valueOf() - 24 * 3600 * 1000;
                    dates[1] = new Date(dates[0]).setHours(23, 59, 59, 0).valueOf();
                    return dates;
                }
            },
            'lastdays': {
                title: Code52.Language.Dictionary.LastDays,
                parameters: true,
                defaults: {
                    parameter1: 7
                },
                dates: function () {
                    var days = internal.getParameter1();
                    var dates = [];
                    var today = new Date();
                    today.setHours(0, 0, 0, 0);
                    dates[0] = new Date(today).setDate(today.getDate() - days).valueOf();
                    dates[1] = new Date(today);
                    dates[1].setDate(today.getDate() - 1);
                    dates[1].setHours(23, 59, 59, 0).valueOf();

                    return dates;
                }
            },
            'lastweeks': {
                title: Code52.Language.Dictionary.LastWeeks,
                parameters: true,
                defaults: {
                    parameter1: 2
                },
                dates: function () {
                    var dates = [];
                    var weeks = internal.getParameter1();
                    var monday = internal.getMonday(new Date());
                    monday.setDate(monday.getDate() - (7 * weeks));
                    dates[0] = monday.valueOf();
                    var sunday = new Date(monday);
                    sunday.setDate(sunday.getDate() + 6 + (7 * (weeks - 1)));
                    sunday.setHours(23, 59, 59, 0);
                    dates[1] = sunday.valueOf();

                    return dates;
                }
            },
            'lastmonths': {
                title: Code52.Language.Dictionary.LastMonths,
                parameters: true,
                defaults: {
                    parameter1: 3
                },
                dates: function () {
                    var months = internal.getParameter1();
                    var dates = [];
                    var lastOfMonth = new Date().setDate(0);
                    var firstOfMonth = new Date(lastOfMonth);
                    firstOfMonth.setDate(1);
                    firstOfMonth.setMonth(firstOfMonth.getMonth() - months + 1);
                    dates[0] = firstOfMonth.valueOf();
                    dates[1] = lastOfMonth.valueOf();

                    return dates;
                }
            },
            'lastquarters': {
                title: Code52.Language.Dictionary.LastQuarters,
                parameters: true,
                defaults: {
                    parameter1: 2
                },
                dates: function () {
                    // TODO: fix -- works as months now
                    var months = internal.getParameter1() * 3;
                    var dates = [];
                    var lastOfMonth = new Date().setDate(0);
                    var firstOfMonth = new Date(lastOfMonth);
                    firstOfMonth.setDate(1);
                    firstOfMonth.setMonth(firstOfMonth.getMonth() - months + 1);
                    dates[0] = firstOfMonth.valueOf();
                    dates[1] = lastOfMonth.valueOf();

                    return dates;
                }
            },
            'lastyears': {
                title: Code52.Language.Dictionary.LastYears,
                parameters: true,
                defaults: {
                    parameter1: 1
                },
                dates: function () {
                    var years = internal.getParameter1();
                    var dates = [];
                    var lastOfYear = new Date();
                    lastOfYear.setDate(0);
                    lastOfYear.setMonth(11);
                    var firstOfYear = new Date(lastOfYear);
                    firstOfYear.setDate(1);
                    firstOfYear.setMonth(-12 * (years - 1));
                    dates[0] = firstOfYear.valueOf();
                    dates[1] = lastOfYear.valueOf();

                    return dates;
                }
            }
        }
    };

    var methods = {
        init: function (options) {
            return this.each(function () {
                var $this = $(this);
                var data = $this.data('DateRangesWidget');
                $this.data('test', internal);

                // initialize data in dom element
                if (!data) {

                    var effective_options = $.extend({}, default_options, options);

                    $this.data('DateRangesWidget', {
                        options: effective_options
                    });

                }
                internal.createElements($this);
                internal.updateDateField($this);
            });
        },

        updateFields: function () {
            return this.each(function () {
                var $this = $(this);
                internal.updateDateField($this);
            });
        }
    };

    var internal = {

        refreshForm: function () {
            var lastSel = $datepicker.DatePickerGetLastSel();

            if ($('.comparison-preset', $dropdown).val() != 'custom') {
                lastSel = lastSel % 2;
                $datepicker.DatePickerSetLastSel(lastSel);
            }
            $('.dr', $dropdown).removeClass('error');
            $('.dr', $dropdown).removeClass('active');
            $('.dr[lastSel=' + lastSel + ']', $dropdown).addClass('active');


            var values_ck = $.cookie('basket-data') + '' == 'undefined' ? null : $.cookie("basket-data");
            var event = JSON.parse(values_ck);
            if (values_ck) {
                var dr1from_ck = new Date(event.dr1from);
                var dr1to_ck = new Date(event.dr1to);

                var dr2from_ck = new Date(event.dr2from);
                var dr2to_ck = new Date(event.dr2to);


                var dr1from_millis_ck = new Date(event.dr1from_millis);
                var dr1to_millis_ck = new Date(event.dr1to_millis);
            }

            var dates = $datepicker.DatePickerGetDate()[0];
            var newFrom = Filter.pad(dates[0].getDate()) + '.' + Filter.pad(dates[0].getMonth() + 1) + '.' + dates[0].getFullYear();
            var newTo = Filter.pad(dates[1].getDate()) + '.' + Filter.pad(dates[1].getMonth() + 1) + '.' + dates[1].getFullYear();
            var oldFrom = $('.dr1.from', $dropdown).val();
            var oldTo = $('.dr1.to', $dropdown).val();

            if (newFrom != oldFrom || newTo != oldTo) {
                $('.dr1.from', $dropdown).val(newFrom);
                $('.dr1.to', $dropdown).val(newTo);
            }

            $('.dr1.from_millis', $dropdown).val(dates[0].getTime());
            $('.dr1.to_millis', $dropdown).val(dates[1].getTime());

            if (dates[2]) {
                $('.dr2.from', $dropdown).val(Filter.pad(dates[2].getDate()) + '.' + Filter.pad(dates[2].getMonth() + 1) + '.' + dates[2].getFullYear());
                $('.dr2.from_millis', $dropdown).val(dates[2].getTime());
            }

            if (dates[3]) {
                $('.dr2.to', $dropdown).val(Filter.pad(dates[3].getDate()) + '.' + Filter.pad(dates[3].getMonth() + 1) + '.' + dates[3].getFullYear());
                $('.dr2.to_millis', $dropdown).val(dates[3].getTime());
            }
        },

        setMillis: function (millis) {
            $('.dr1.from_millis', $dropdown).val(millis[0].getTime());
            $('.dr1.to_millis', $dropdown).val(millis[1].getTime());

            if (millis[2]) {
                $('.dr2.from_millis', $dropdown).val(millis[2].getTime());
            }
            if (millis[3]) {
                $('.dr2.to_millis', $dropdown).val(millis[3].getTime());
            }
        },
        createElements: function ($target) {
            // modify div to act like a dropdown
            //$target.html(
            //    '<div class="date-range-field">' +
            //        '<span class="aggregation"></span>' +
            //        '<div class="dates">' +
            //            '<span class="mainD"></span>' +
            //            '<span class="comparison" id="compareLabel"></span></div>' +
            //        '</div>'
            //);
            $target.html(
                '<div class="row">' +
                    '<div class="col">' +
                        '<div class= "btn-group" role = "group" aria-label="Basic radio toggle button group">' +
                            '<input type="radio" class="btn-check" name="btnradio" id="option0" autocomplete="off">' +
                            '<label class="btn btn-outline-primary" for="option0">' + Code52.Language.Dictionary.Hour +'</label>' +
                            '<input type="radio" class="btn-check" name="btnradio" id="option2" autocomplete="off" checked="">' +
                            '<label class="btn btn-outline-primary" for="option2">' + Code52.Language.Dictionary.Day +'</label>' +
                            '<input type="radio" class="btn-check" name="btnradio" id="option3" autocomplete="off">' +
                            '<label class="btn btn-outline-primary" for="option3">' + Code52.Language.Dictionary.Week +'</label>' +
                            '<input type="radio" class="btn-check" name="btnradio" id="option4" autocomplete="off">' +
                            '<label class="btn btn-outline-primary" for="option4">' + Code52.Language.Dictionary.Month +'</label>' +
                        '</div>' +
                    '</div>' +
                    '<div class="col-sm"></div>' +
                    '<div class="col-sm d-flex justify-content-end">' +
                        '<div class= "btn-group" role = "group" aria - label="Button group with nested dropdown">' +
                            '<div class="btn-group" role="group">' + 
                                '<button id="btnGroupDrop1" type="button" class="btn btn-secondary dropdown-toggle " data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                                    '<span class="mainD">12.01.2022 - 19.01.2022</span>' +
                                '</button>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<br>' 
            );

            // only one dropdown exists even though multiple widgets may be on the page
            if (!$dropdown) {
                $dropdown = $(
                    '<div class="row" id="datepicker-dropdown" style="display:none">' +
                    '<div class="col-md-8 date-ranges-picker"></div>' +
                        '<div class="col-md-4">' +
                            '<div class="date-ranges-picker1">' +
                                '<div class="date-ranges-form">' +
                                        '<div class="aggregation-wrap" style="display:none">' +
                                        'Aggregation:' +
                                        '<select class="aggregation">' +
                                        '</select>' +
                                '</div>' +
                                '<div class="main-daterange">' +
                                '<div><span class="dText">' + Code52.Language.Dictionary.DateRange +
                                    ':</span>' +
                                    '<select class="daterange-preset">' +
                                    '</select>' +
                                    '<span class="parameters">' +
                                    '<input type="number" class="daterange-preset-parameter1"  min="1"/>' +
                                    '</span>' +
                                '</div>' +
                                '<input type="text" class="dr dr1 from" lastSel="0" /> - <input type="text" class="dr dr1 to" lastSel="1" />' +
                                '<input type="hidden" class="dr dr1 from_millis" lastSel="2" /><input type="hidden" class="dr dr1 to_millis" lastSel="3" />' +
                            '</div>' +
                            '<div class="comparison">' +
                                '<label class="dText"><input type="checkbox" checked="checked" class="enable-comparison" /> ' + Code52.Language.Dictionary.CompareTo + ':</label>' +
                                '<select class="comparison-preset">' +
                                    '<option value="custom">' + Code52.Language.Dictionary.CalendarSelect + '</option>' +
                                    '<option value="previousperiod" selected="selected">' + Code52.Language.Dictionary.PreviousDateRange + '</option>' +
                                    '<option value="previousyear" >' + Code52.Language.Dictionary.LastYears + '</option>' +
                                    '<option value="month-to-date">' + Code52.Language.Dictionary.MonthToDate + '</option>' +
                                '</select>' +
                            '</div>' +
                            '<div class="comparison-daterange">' +
                                '<input type="text" class="dr dr2 from" lastSel="2" /> - <input type="text" class="dr dr2 to" lastSel="3" disabled/>' +
                                '<input type="hidden" class="dr dr2 from_millis" lastSel="2" /><input type="hidden" class="dr dr2 to_millis" lastSel="3" />' +
                            '</div>' +
                        '</div>' +
                        '<div class="clear"></div>' +
                        '<div class="btn-group">' +
                            '<a href="#" id="button-cancel">' + Code52.Language.Dictionary.Cancel + '</a>' +
                            '<a class="active" id="button-ok">' + Code52.Language.Dictionary.Apply + '</a>' +
                        '</div>' +
                    '</div>' +
                    '<br>'
                );
                $dropdown.appendTo($($target));

                $aggregation = $('.aggregation', $dropdown);
                $aggregationWrap = $('.aggregation-wrap', $dropdown);

                $datepicker = $('.date-ranges-picker', $dropdown);

                $daterangePreset = $('.daterange-preset', $dropdown);
                $parameters = $('.parameters', $dropdown);
                $parameter1 = $('.daterange-preset-parameter1', $dropdown);

                $enableComparison = $('.enable-comparison', $dropdown);
                $comparisonPreset = $('.comparison-preset', $dropdown);

                // TODO: inherit options from DRW options
                $datepicker.DatePicker({
                    mode: 'range',
                    calendars: 3,
                    starts: 1,
                    inline: true,
                    locale: {
                        daysMin: Globalize.culture($.cookie('_culture')).calendars.standard.days.namesShort,
                        months: Globalize.culture($.cookie('_culture')).calendars.standard.months.names,
                        monthsShort: Globalize.culture($.cookie('_culture')).calendars.standard.months.namesAbbr
                    },
                    selectableDates: [new Date($("#startDate").val()), Date.now()],
                    onChange: function (dates, el, options) {

                        // user clicked on datepicker
                        var update = internal.checkDateRange(dates);
                        if (update) {
                            $datepicker.DatePickerSetDate(dates);
                        }
                        internal.setDaterangePreset('custom');
                    }
                });

                /**
				 * Handle change of aggregation.
				 */
                $aggregation.change(function () {
                    internal.populateDateRangePresets();
                });


                /**
				 * Handle change of datePreset
				 */
                $daterangePreset.change(function () {
                    var date_preset = internal.getDaterangePreset();
                    if (date_preset.parameters) {
                        //console.log(internal.getParameter1());
                        if (!$.isNumeric(internal.getParameter1())) {
                            internal.setParameter1(date_preset.defaults.parameter1);
                        }
                        $parameters.show();
                    } else {
                        $parameters.hide();
                    }
                    $('.dr1', $dropdown).prop('disabled', ($daterangePreset.val() == 'custom' ? false : true));
                    internal.checkComparisonPreset();
                    internal.recalculateDaterange();
                    if ($daterangePreset.val() != 'custom') {
                        var dates = $datepicker.DatePickerGetDate()[0];
                        //console.log(dates);
                        var update = internal.checkDateRange(dates);
                        if (update) {
                            $datepicker.DatePickerSetDate(dates);
                            internal.recalculateDaterange();
                        }
                    }
                });

                $parameter1.change(function () {
                    var p1 = internal.getParameter1();
                    if (!$.isNumeric(p1) || p1 < 1)
                        internal.setParameter1(1);
                    internal.checkComparisonPreset();

                    internal.recalculateDaterange();
                    if ($daterangePreset.val() != 'custom') {
                        var dates = $datepicker.DatePickerGetDate()[0];
                        var update = internal.checkDateRange(dates);
                        if (update) {
                            internal.recalculateDaterange();
                        }
                    }
                });

                /**
				 * Handle enable/disable comparison.
				 */
                $enableComparison.change(function () {
                    internal.setComparisonEnabled($(this).is(':checked'));
                });

                /**
				 * Handle change of comparison preset.
				 */
                $comparisonPreset.change(function () {
                    if (internal.getComparisonEnabled() && internal.getComparisonPreset() == 'custom') {
                        $datepicker.DatePickerSetLastSel($('.comparison-daterange input.dr.from', $dropdown).attr('lastSel'));
                    }
                    internal.recalculateComparison();
                });

                /**
				 * Handle clicking on date field.
				 */
                $('.dr', $dropdown).click(function () {
                    // set active date field for datepicker
                    $datepicker.DatePickerSetLastSel($(this).attr('lastSel'));
                    internal.refreshForm();
                });

                /**
				 * Handle typing on date field.
				 */
                $('.dr', $dropdown).blur(function () {
                    // set active date field for datepicker
                    var index = $('.dr').index(this);
                    var dates = $datepicker.DatePickerGetDate()[0];
                    var dateParts = $(this).val().split(".");
                    var typedDate = new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]);
                    dates[index] = typedDate;
                    if (typedDate == null || isNaN(typedDate.getTime())) {
                        var lastSel = $datepicker.DatePickerGetLastSel();
                        $('.dr[lastSel=' + lastSel + ']', $dropdown).addClass('error');
                    }
                    else {
                        $('.dr', $dropdown).removeClass('error');
                        var days = parseInt((dates[1] - dates[0]) / (24 * 3600 * 1000));
                        dates[2] = new Date(dates[0]).setDate(dates[0].getDate() - (days + 1));
                        dates[3] = new Date(dates[1]).setDate(dates[1].getDate() - (days + 1));
                        internal.checkDateRange(dates);
                        $datepicker.DatePickerSetDate(dates, true);
                        internal.recalculateComparison();
                        internal.setMillis($datepicker.DatePickerGetDate()[0]);
                    }
                });

                /**
				 * Handle clicking on OK button.
				 */
                $('#button-ok', $dropdown).click(function () {
                    internal.updateUrlComparisonType();
                    internal.saveValues($current_target);
                    internal.updateDateField($current_target);
                    internal.retractDropdown($current_target);
                    internal.okCallBack($current_target);
                    return false;
                });

                /**
				 * Handle clicking on CANCEL button.
				 */
                $('#button-cancel', $dropdown).click(function () {
                    //console.log('cancel')
                    var $this = $(this);
                    internal.retractDropdown($current_target);
                    return false;
                });

            }

            /**
			 * Handle expand/retract of dropdown.
			 */
            $target.bind('click', function () {
                var $this = $(this);
                if ($this.hasClass('DRWClosed')) {
                    $('.filter').hide();
                    internal.expandDropdown($this);
                } else {
                    internal.retractDropdown($this);
                }
                return false;
            });

            $target.addClass('DRWInitialized');
            $target.addClass('DRWClosed');
        },

        checkComparisonPreset: function () {
            if ($daterangePreset.val() == 'lastmonths' && internal.getParameter1() == 1) {
                $('.comparison-preset option[value="month-to-date"]').show();
            } else {
                $('.comparison-preset option[value="month-to-date"]').hide();
                if ($('.comparison-preset', $dropdown).val() == 'month-to-date') {
                    internal.setComparisonPreset('custom');
                }
            }
        },
        updateUrlComparisonType: function () {
            if (typeof UrlStateManager == 'undefined') {
                return;
            }

            var datePreset = $('.daterange-preset', $dropdown).val();
            if (compPreset != 'custom' && internal.getComparisonEnabled()) {
                UrlStateManager.tryAddUrlState('datePreset', compPreset);
            } else {
                UrlStateManager.delUrlState('datePreset');
            }

            var compPreset = $('.comparison-preset', $dropdown).val();
            if (compPreset != 'custom' && internal.getComparisonEnabled()) {
                UrlStateManager.tryAddUrlState('comparePreset', compPreset);
            } else {
                UrlStateManager.delUrlState('comparePreset');
            }

        },

        recalculateDaterange: function () {
            var date_preset = internal.getDaterangePreset();

            var dates = $datepicker.DatePickerGetDate()[0];
            // TODO: remove
            if (date_preset.dates == undefined) throw date_preset.title + " doesn't have dates()";

            var d = date_preset.dates();
            if (d != null) {
                dates[0] = d[0];
                dates[1] = d[1];
            }

            $datepicker.DatePickerSetDate(dates);
            internal.recalculateComparison();
        },

        recalculateComparison: function () {
            var dates = $datepicker.DatePickerGetDate()[0];
            if (dates.length >= 2) {
                var comparisonPreset = internal.getComparisonPreset();
                switch (comparisonPreset) {
                    case 'previousperiod':
                        var days = parseInt((dates[1] - dates[0]) / (24 * 3600 * 1000));
                        dates[2] = new Date(dates[0]).setDate(dates[0].getDate() - (days + 1));
                        dates[3] = new Date(dates[1]).setDate(dates[1].getDate() - (days + 1));
                        break;
                    case 'previousyear':
                        dates[2] = new Date(dates[0]).setFullYear(dates[0].getFullYear(dates[0]) - 1);
                        dates[3] = new Date(dates[1]).setFullYear(dates[1].getFullYear(dates[1]) - 1);
                        break;
                    case 'custom':
                        var days = parseInt((dates[1] - dates[0]) / (24 * 3600 * 1000));
                        dates[3] = new Date(dates[2]).setDate(dates[2].getDate() + days);
                        // if comparison custom days are intersecting
                        if (dates[3] >= dates[0]) {
                            dates[2] = new Date(dates[0]).setDate(dates[0].getDate() - (days + 1));
                            dates[3] = new Date(dates[1]).setDate(dates[1].getDate() - (days + 1));
                        }
                        break;
                    case 'month-to-date':
                        dates[2] = new Date(new Date(dates[0]).setMonth(dates[0].getMonth() - 1)).setDate(1);
                        dates[3] = new Date(dates[1]).setMonth(dates[0].getMonth() - 1);
                        var lastDay1 = new Date((dates[1])).getDate();
                        var lastDay2 = new Date(new Date(dates[0]).setDate(0)).getDate();
                        var lastDay = Math.min(lastDay1, lastDay2);
                        dates[3] = new Date(dates[3]).setDate(lastDay);

                        break;
                }
                $datepicker.DatePickerSetDate(dates);
                var isComparisonCustom = (comparisonPreset == 'custom' ? true : false);
                $('.comparison-daterange input.dr.from', $dropdown).prop('disabled', !isComparisonCustom);
                internal.refreshForm();
            }
        },

        populateAggregations: function (aggregations) {
            var $select = $('select.aggregation', $dropdown);

            $select.html('');
            $.each(aggregations, function (i, aggregation) {
                $select.append($("<option/>", {
                    value: aggregation,
                    text: db.aggregations[aggregation].title
                }));
            });
            internal.populateDateRangePresets();
        },

        /**
		 * Loads values from target element's data to controls.
		 */
        loadValues: function ($target) {
            var values = $target.data('DateRangesWidget').options.values;
            //console.log('load', values);
            // handle initial values
            $('.dr1.from', $dropdown).val(values.dr1from);
            $('.dr1.from', $dropdown).change();
            $('.dr1.to', $dropdown).val(values.dr1to);
            $('.dr1.to', $dropdown).change();
            $('.dr2.from', $dropdown).val(values.dr2from);
            $('.dr2.from', $dropdown).change();
            $('.dr2.to', $dropdown).val(values.dr2to);
            $('.dr2.to', $dropdown).change();

            $aggregation.val(values.aggregation);
            $aggregation.change();

            $daterangePreset.val(values.daterangePreset);
            $daterangePreset.change();

            $parameter1.val(values.parameter1);
            $parameter1.change();

            $enableComparison.prop('checked', values.comparisonEnabled);
            $enableComparison.change();

            $comparisonPreset.val(values.comparisonPreset);
            $comparisonPreset.change();

            var now = new Date(Date.now());

            $datepicker.DatePickerSetDate([values.dr1from == null ? now : values.dr1from,
            values.dr1to == null ? now : values.dr1to,
            values.dr2from == null ? now : values.dr2from,
            values.dr2to == null ? now : values.dr2to], true);
        },

        /**
		 * Stores values from controls to target element's data.
		 */
        GetDate: function (date) {
            var m = date.getMonth() + 1;
            if (m < 10)
                m = "0" + m;
            var d = date.getDate();
            if (d < 10)
                d = "0" + d;

            return date.getFullYear() + "-" + (m) + "-" + (d);
        },
        okCallBack: function ($target) {
            var data = $target.data('DateRangesWidget');
            var values = data.options.values;
            if (values.okCallBack != null)
                values.okCallBack();
        },
        saveValues: function ($target) {
            var data = $target.data('DateRangesWidget');
            var values = data.options.values;
            values.aggregation = internal.getAggregation();
            values.daterangePreset = internal.getDaterangePresetVal()
            values.parameter1 = internal.getParameter1();
            values.dr1from = new Date($('.dr1.from_millis', $dropdown).val() * 1)
            values.dr1to = new Date($('.dr1.to_millis', $dropdown).val() * 1)
            values.dr1from_millis = $('.dr1.from_millis', $dropdown).val()
            values.dr1to_millis = $('.dr1.to_millis', $dropdown).val()

            values.comparisonEnabled = internal.getComparisonEnabled();
            values.comparisonPreset = internal.getComparisonPreset();
            values.dr2from = new Date($('.dr2.from_millis', $dropdown).val() * 1);
            values.dr2to = new Date($('.dr2.to_millis', $dropdown).val() * 1);

            values.dr2from_millis = $('.dr2.from_millis', $dropdown).val();
            values.dr2to_millis = $('.dr2.to_millis', $dropdown).val();
            $target.data('DateRangesWidget', data);
            $.bbq.pushState({ StartDate: internal.GetDate(values.dr1from) });
            $.bbq.pushState({ EndDate: internal.GetDate(values.dr1to) });
            if (values.comparisonEnabled) {
                $.bbq.pushState({ StartCompareDate: internal.GetDate(values.dr2from) });
                $.bbq.pushState({ EndCompareDate: internal.GetDate(values.dr2to) });
            }
            else {
                $.bbq.removeState('StartCompareDate');
                $.bbq.removeState('EndCompareDate');
            }
            if ($target.data().DateRangesWidget.options.onChange)
                $target.data().DateRangesWidget.options.onChange(values);

        },
        findParamCookesData: function (name, values_ck) {
            var event = JSON.parse(values_ck, function (key, value) {
                if (key == name) return new Date(value);
                return value;
            });

            return event;
        },

        findParamCookes: function (name, values_ck) {
            var event = JSON.parse(values_ck, function (key, value) {
                if (key == name) return new String(value);
                return value;
            });

            return event;
        },

        /**
		 * Updates target div with data from target element's data
		 */
        updateDateField: function ($target) {
            var values = '';
            var values_ck = $.cookie('basket-data') + '' == 'undefined' ? null : $.cookie("basket-data");
            var event = JSON.parse(values_ck);

            if (values_ck) {
                var dr1from_ck = new Date(event.dr1from);
                var dr1to_ck = new Date(event.dr1to);
                var aggregation_ck = event.aggregation;
                var daterangePreset_ck = event.daterangePreset;
                var comparisonEnabled_ck = event.comparisonEnabled;


            }


            if (values_ck) {
                if (aggregation_ck) {
                    $('span.aggregation', $target).text(aggregation_ck);
                    $('span.aggregation', $target).show();
                } else {
                    $('span.aggregation', $target).hide();
                }

                if (dr1from_ck && dr1to_ck) {
                    if (Object.prototype.toString.call(dr1from_ck) === "[object Date]") {
                        $('span.mainD', $target).text(Filter.getPeriodText(dr1from_ck, dr1to_ck));
                    } else {

                        var txt = dr1from_ck == dr1to_ck ? dr1from_ck : dr1from_ck + ' - ' + dr1to_ck;
                        $('span.mainD', $target).text(txt);
                    }

                } else if (daterangePreset_ck) {
                    var dates = db.date_presets[daterangePreset_ck].dates();
                    $('span.mainD', $target).text(dates[0] + ' - ' + dates[1]);
                }
                else {
                    $('span.mainD', $target).text('N/A');
                }


                if (comparisonEnabled_ck) {

                    var dr2from_ck = new Date(event.dr2from);
                    var dr2to_ck = new Date(event.dr2to);

                    if (dr2from_ck && dr2to_ck) {

                        $('.date-range-field').addClass('large');
                        if (Object.prototype.toString.call(dr2from_ck) === "[object Date]") {
                            $('span.comparison', $target).text(Filter.getPeriodText(dr2from_ck, dr2to_ck));

                        } else {
                            var txt = dr2from_ck == dr2to_ck ? dr2from_ck : dr2from_ck + ' - ' + dr2to_ck;
                            $('span.comparison', $target).text(txt);
                        }

                        $('span.comparison', $target).css('display', 'block');
                        $('span.comparison-divider', $target).css('display', 'block');


                    }
                } else {
                    $('.date-range-field').removeClass('large');
                    $('span.comparison-divider', $target).hide();
                    $('span.comparison', $target).hide();
                }
            }
            else {

                values = $target.data("DateRangesWidget").options.values;

                if (values.aggregation) {
                    $('span.aggregation', $target).text(values.aggregation);
                    $('span.aggregation', $target).show();
                } else {
                    $('span.aggregation', $target).hide();
                }

                if (values.dr1from && values.dr1to) {
                    if (Object.prototype.toString.call(values.dr1from) === "[object Date]") {
                        $('span.mainD', $target).text(Filter.getPeriodText(values.dr1from, values.dr1to));
                    } else {
                        var txt = values.dr1from == values.dr1to ? values.dr1from : values.dr1from + ' - ' + values.dr1to;
                        $('span.mainD', $target).text(txt);
                    }

                } else if (values.daterangePreset) {
                    var dates = db.date_presets[values.daterangePreset].dates();
                    $('span.mainD', $target).text(dates[0] + ' - ' + dates[1]);
                }
                else {
                    $('span.mainD', $target).text('N/A');
                }

                if (values.comparisonEnabled && values.dr2from && values.dr2to) {
                    $('.date-range-field').addClass('large');
                    if (Object.prototype.toString.call(values.dr2from) === "[object Date]") {
                        $('span.comparison', $target).text(Filter.getPeriodText(values.dr2from, values.dr2to));
                    } else {
                        var txt = values.dr2from == values.dr2to ? values.dr2from : values.dr2from + ' - ' + values.dr2to;
                        $('span.comparison', $target).text(txt);
                    }

                    $('span.comparison', $target).css('display', 'block');
                    $('span.comparison-divider', $target).css('display', 'block');
                } else {
                    $('.date-range-field').removeClass('large');
                    $('span.comparison-divider', $target).hide();
                    $('span.comparison', $target).hide();
                }
            }

            return true;
        },

        getAggregation: function () {
            return $aggregation.val();
        },

        getDaterangePresetVal: function () {
            return $daterangePreset.val();
        },

        getDaterangePreset: function () {
            var value = $daterangePreset.val();
            if (value == null) {
                value = "today";
            }
            return db.date_presets[value];
        },

        setDaterangePreset: function (value) {
            $daterangePreset.val(value);
            $daterangePreset.change();
        },

        checkDateRange: function (dates) {
            var minDate = new Date('2013-01-01');
            var maxDate = new Date();
            var update = false;
            for (var i = 0; i < dates.length; i++) {
                if (dates[i] < minDate) {
                    dates[i] = minDate;
                    update = true;
                }
                if (dates[i] > maxDate) {
                    dates[i] = maxDate;
                    update = true;
                }
            }
            if (dates[0] > dates[1]) {
                dates[0] = dates[1];
                update = true;
            }

            if (dates.length == 4 && parseInt(dates[1] - dates[0]) != parseInt(dates[3] - dates[2])) {
                var days = parseInt((dates[1] - dates[0]) / (24 * 3600 * 1000));
                dates[3] = new Date(new Date(dates[2]).setDate(dates[2].getDate() + days));

                if (dates[3] > maxDate) {
                    dates[3] = maxDate;
                    dates[2] = new Date(new Date(dates[3]).setDate(dates[3].getDate() - days));
                }
                update = true;
            }

            return update;
        },

        getParameter1: function () {
            return parseInt($parameter1.val());
        },

        setParameter1: function (value) {
            $parameter1.val(value);
        },

        setComparisonEnabled: function (enabled) {
            $datepicker.DatePickerSetMode(enabled ? 'tworanges' : 'range');
            if (enabled) {
                $('.comparison-preset', $dropdown).prop('disabled', false);
                if ($('.comparison-preset', $dropdown).val() == 'custom') {
                    $('.comparison-daterange input.dr.from', $dropdown).prop('disabled', false);
                }
                if ($('.comparison-preset', $dropdown).val() == 'month-to-date') {

                }
            } else {

                $('.comparison-preset', $dropdown).prop('disabled', 'disabled');
                $('.comparison-daterange input.dr.from', $dropdown).prop('disabled', 'disabled');

            }
        },

        getComparisonEnabled: function () {
            return $enableComparison.prop('checked');
        },

        getComparisonPreset: function () {
            return $comparisonPreset.val();
        },

        setComparisonPreset: function (value) {
            $comparisonPreset.val(value);
            $comparisonPreset.change();
        },

        populateDateRangePresets: function () {
            var aggregation = internal.getAggregation();
            if (!aggregation)
                aggregation = default_aggregation;
            var main_presets_keys = db.aggregations[aggregation].presets;

            var $other_presets = $('<optgroup/>', { label: Code52.Language.Dictionary.OtherPeriods })
            var valueBackup = $daterangePreset.val();

            $daterangePreset.html('');

            // add main presets
            $.each(main_presets_keys, function (i, main_preset_key) {
                var date_preset = db.date_presets[main_preset_key];
                if (date_preset == undefined) throw 'Invalid preset "' + main_preset_key + '".';
                $daterangePreset.append($("<option/>", {
                    value: main_preset_key,
                    text: date_preset.title
                }));
            });

            // add other presets
            $.each(db.date_presets, function (preset_key, date_preset) {
                if ($.inArray(preset_key, main_presets_keys) == -1) {
                    $other_presets.append($("<option/>", {
                        value: preset_key,
                        text: date_preset.title
                    }));
                }
            });
            $daterangePreset.append($other_presets);

            $daterangePreset.val(valueBackup);
        },

        expandDropdown: function ($target) {
            var options = $target.data("DateRangesWidget").options;
            $datepicker.DatePickerSetLastSel('0');
            $current_target = $target;

            // init aggregations
            if (options.aggregations.length > 0) {
                internal.populateAggregations(options.aggregations);
                $aggregationWrap.show();
            } else {
                $aggregationWrap.hide();
            }

            internal.loadValues($target);

            // retract all other dropdowns
            $('.DRWOpened').each(function () {
                internal.retractDropdown($(this));
            });

            //var leftDistance = $target.offset().left;
            //var rightDistance = $(document).width() - $target.offset().left - $target.width();
            $dropdown.show();
            //if (rightDistance > leftDistance) {
            //    // align left edges
            //    $dropdown.offset({
            //        left: $target.offset().left,
            //        top: $target.offset().top + $target.height() - 1
            //    });
            //    $dropdown.css('border-radius', '0 5px 5px 5px')
            //} else {
            //    // align right edges
            //    var fix = parseInt($dropdown.css('padding-left').replace('px', '')) +
            //        parseInt($dropdown.css('padding-right').replace('px', '')) +
            //        parseInt($dropdown.css('border-left-width').replace('px', '')) +
            //        parseInt($dropdown.css('border-right-width').replace('px', ''))
            //    $dropdown.offset({
            //        left: $target.offset().left + $target.width() - $dropdown.width() - fix,
            //        top: $target.offset().top + $target.height() - 1
            //    });
            //    $dropdown.css('border-radius', '5px 0 5px 5px')
            //}

            $target.addClass('DRWOpened');
            $target.removeClass('DRWClosed');

            // refresh
            internal.recalculateDaterange();
        },

        retractDropdown: function ($target) {
            $dropdown.find('#button-ok').attr('nodekey', $target.closest('div.compareChart').attr('nodekey'));
            //$dropdown.hide();
            $target.addClass('DRWClosed');
            $target.removeClass('DRWOpened');
        },

        getMonday: function (d) {
            d = new Date(d);
            var day = d.getDay();
            var diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
            return new Date(d.setDate(diff));
        }
    };

    $.fn.DateRangesWidget = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.DateRangesWidget');
        }
    };

})(jQuery);

