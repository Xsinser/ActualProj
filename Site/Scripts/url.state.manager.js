function UrlStateManager() {

    this.extractTreeItemsFromUrl = function () {
        if (UrlStateManager.urlHasTreeItems() == true) {

            var encodedTreeItems = $.bbq.getState("selectedTreeItems").split(',');

            var selectedTreeItems = [];
            if (UrlStateManager.isAggregateMode() == true) {
                selectedTreeItems = extractAggregationFilters(encodedTreeItems);
            } else if (UrlStateManager.isCompareMode() == true) {
                selectedTreeItems = extractComparisonFilters(encodedTreeItems);
            }
            else if (UrlStateManager.isShopCenterMode() == true) {
                selectedTreeItems = extractShopCenterFilters(encodedTreeItems);
            }
            else if (UrlStateManager.isCompareMode() == true) {
                selectedTreeItems = extractComparisonFilters(encodedTreeItems);
            }
            return selectedTreeItems;
        }

        return [];
    };

    function extractShopCenterFilters(selectedTreeItemsHash) {
        var filters = [];
        $.each(selectedTreeItemsHash, function (key, value) {
            filters.push({ Id: null, Nodekey: value, Type: 'shopCenter' });
        });
        return filters;
    }



    function extractComparisonFilters(selectedTreeItemsHash) {
        /// <summary>
        /// Extracts all filters for the comparison tree.
        /// </summary>

        var filters = [];
        $.each(selectedTreeItemsHash, function (key, value) {
            var strings = value.split(':');
            if (strings.length == 2) {
                var dates = strings[1].split('|');
                if (dates.length == 1 || dates.length == 2) {
                    var id;
                    var startDate = parseDate(dates[0]);
                    var endDate = null;
                    if (dates.length == 2) {
                        endDate = parseDate(dates[1]);
                    }
                    if (value.indexOf('network') > -1) {
                        filters.push(createComparisonFilter(null, 'network', strings[0], startDate, endDate));
                    } else if (value.indexOf('city') > -1) {
                        id = strings[0].replace('city_', '');
                        filters.push(createComparisonFilter(id, 'city', strings[0], startDate, endDate));
                    } else if (value.indexOf('shop') > -1) {
                        id = strings[0].replace('shop_', '');
                        filters.push(createComparisonFilter(id, 'shop', strings[0], startDate, endDate));
                    } else if (value.indexOf('zone') > -1) {
                        id = strings[0].replace('zone_', '');
                        filters.push(createComparisonFilter(id, 'zone', strings[0], startDate, endDate));
                    } else if (value.indexOf('cam') > -1) {
                        id = strings[0].replace('cam_', '');
                        filters.push(createComparisonFilter(id, 'cam', strings[0], startDate, endDate));
                    } else if (value.indexOf('group') > -1) {
                        id = strings[0].replace('group_', '');
                        filters.push(createComparisonFilter(id, 'group', strings[0], startDate, endDate));
                    }
                }
            }
        });
        return filters;
    }

    function createComparisonFilter(id, type, nodekey, startDate, endDate) {
        /// <summary>
        /// Creates a comparison filter.
        /// </summary>

        var item = {
            Id: id,
            Type: type,
            Nodekey: nodekey,

            StartDate: startDate,
            EndDate: endDate,
        };
        return item;
    }


    function parseDate(date) {
        /// <summary>
        /// Parses a date by specific format 'yyyy-mm-dd'.
        /// </summary>

        var parts = date.split('-');
        if (parts.length == 3) {
            return new Date(parts[0], parts[1] * 1 - 1, parts[2]);
        }
        return null;
    }
}
function createAggregationFilter(id, type, nodekey) {
    /// <summary>
    /// Creates a general filter.
    /// </summary>

    var item = {
        Id: id,
        Type: type,
        Nodekey: nodekey,
    };
    return item;
}

function extractAggregationFilters(selectedTreeItemsHash) {
    /// <summary>
    /// Extracts all filters for the aggregation tree.
    /// </summary>

    var filters = [];
    $.each(selectedTreeItemsHash, function (key, value) {
        var id;
        if (value.indexOf('network') > -1) {
            filters.push(createAggregationFilter(null, 'network', value));
        } else if (value.indexOf('city') > -1) {
            id = value.replace('city_', '');
            filters.push(createAggregationFilter(id, 'city', value));
        } else if (value.indexOf('shop') > -1) {
            id = value.replace('shop_', '');
            filters.push(createAggregationFilter(id, 'shop', value));
        } else if (value.indexOf('zone') > -1) {
            id = value.replace('zone_', '');
            filters.push(createAggregationFilter(id, 'zone', value));
        } else if (value.indexOf('cam') > -1) {
            id = value.replace('cam_', '');
            filters.push(createAggregationFilter(id, 'cam', value));
        } else if (value.indexOf('group') > -1) {
            id = value.replace('group_', '');
            filters.push(createAggregationFilter(id, 'group', value));
        }
    });
    return filters;
}



UrlStateManager.aggregateTreeUrl = '';
UrlStateManager.compareTreeUrl = '';

UrlStateManager.updateStep = function (selectedStep) {
    $.bbq.pushState({ step: selectedStep });
};

UrlStateManager.setDefaultStep = function () {
    $.bbq.pushState({ step: 'Day' });
};

UrlStateManager.setDefaultStepIfEmpty = function () {
    if ($.bbq.getState("step") == null) {
        $.bbq.pushState({ step: 'Day' });
    }
};

UrlStateManager.setDefaultChartTypesIfEmpty = function () {
    if ($.bbq.getState("chartTypes") == null) {
        $.bbq.pushState({ chartTypes: '1,6,10' });
    }
};

UrlStateManager.setDefaultTreeStateIfEmpty = function () {
    if ($.bbq.getState('selectedTreeItems') == null) {
        $.bbq.pushState({ selectedTreeItems: 'network' });
    }
};

UrlStateManager.setDefaultModeIfEmpty = function () {
    if ($.bbq.getState("mode") == null) {
        $.bbq.pushState({ mode: 'aggregate' });
    }
};

UrlStateManager.setDefaultDatesIfEmpty = function (index) {
    var endPeriod = new Date(Date.now());
    var startPeriod = new Date(endPeriod.getFullYear(), endPeriod.getMonth(), endPeriod.getDate() - 6);

    if ($.bbq.getState("startPeriod") == null) {
        $.bbq.pushState({ startPeriod: startPeriod.getFullYear() + '-' + (startPeriod.getMonth() + 1) + '-' + startPeriod.getDate() });
    }
    if ($.bbq.getState("endPeriod") == null) {
        $.bbq.pushState({ endPeriod: endPeriod.getFullYear() + '-' + (endPeriod.getMonth() + 1) + '-' + endPeriod.getDate() });
    }
};

UrlStateManager.urlHasGranularityStep = function () {
    return $.bbq.getState("step") != null;
};

UrlStateManager.IsHoursForOneDay = function (chartId) {
    return Filter.getStartDateFilter().getDate(chartId) == Filter.getEndDateFilter().getDate(chartId) && UrlStateManager.getGranularityStep() == 'Hour';
};


UrlStateManager.setUrlMode = function (state) {
    /// <summary>
    /// Sets mode to URL. Valid parameters examples: 'compare' OR 'aggregate'
    /// </summary>
    if (state != null && typeof (state) == "string" && (state == 'compare' || state == 'aggregate' || state == 'shopCenter' || state == 'industry' || state == 'aggregate_lite' || state == 'crossshoping' || state == 'crossshopingbyzones')) {
        $.bbq.pushState({ mode: state });
    }
};

UrlStateManager.getGranularityStep = function () {
    return $.bbq.getState("step");
};

UrlStateManager.pushUrlToState = function (hashUrl) {
    if (hashUrl == '') {
        return;
    }
    $.bbq.pushState("#" + hashUrl);
};

UrlStateManager.pushState = function (state) {
    if (state != null && state != '') {
        $.bbq.pushState(state);
    }
};

UrlStateManager.tryAddUrlState = function (key, value) {
    if (value != null && value != '' && key != null && key != '') {
        var state = {};
        state[key] = value;
        $.bbq.pushState(state);
    }
};

UrlStateManager.delUrlState = function (key) {
    if (key != null && key != '') {
        jQuery.bbq.removeState(key);
    }
};

UrlStateManager.synchronizeUrlState = function (key, value) {
    if (key == null || key == '') {
        return;
    }
    if (value != null && value != '') {
        var state = {};
        state[key] = value;
        $.bbq.pushState(state);
    } else {
        $.bbq.removeState(key);
    }
};

UrlStateManager.urlHasTreeItems = function () {
    var itemsState = $.bbq.getState("selectedTreeItems");
    return itemsState != null;
};

UrlStateManager.urlHasTabInfo = function () {
    var tabInfo = $.bbq.getState("crossTab");
    ////
    return tabInfo != null;
}

UrlStateManager.urlHasSelectedZoneInfo = function () {
    var zoneInfo = $.bbq.getState("selectedZone");
    return zoneInfo != null;
}

UrlStateManager.getUrlTreeItems = function () {
    return $.bbq.getState("selectedTreeItems");
};

UrlStateManager.updateUrlWithSelectedChartTypes = function (selectedChartIds) {
    var chartTypes = UrlStateManager.getUrlChartTypes(true);
    var updateChartType = [];
    $.each(chartTypes, function (key, value) {
        if ($.inArray(value.split(':')[0] * 1, selectedChartIds) != -1) {
            updateChartType.push(value);
        }
    });

    $.each(selectedChartIds, function (key, value) {
        var found = false;
        $.each(chartTypes, function (keyChartType, valueChartType) {
            if (valueChartType.split(':')[0] * 1 == value) {
                found = true;
                return;
            }
        });

        if (!found) {
            updateChartType.push(value + ':show');
        }
    });


    $.bbq.pushState({ chartTypes: updateChartType.join(',') });
};

UrlStateManager.setVisibleUrlSelectedChartType = function (selectedChartId, visible) {
    var chartTypes = UrlStateManager.getUrlChartTypes(true);
    var selectedChartTypes = [];
    $.each(chartTypes, function (key, value) {
        if (value.indexOf(':') > -1) {
            if (value.split(':')[0] == selectedChartId) {
                selectedChartTypes.push(value.split(':')[0] + ':' + visible);
            } else {
                selectedChartTypes.push(value);
            }
        } else {
            if (value == selectedChartId) {
                selectedChartTypes.push(value + ':' + visible);
            } else {
                selectedChartTypes.push(value + ':show');
            }
        }
    });
    $.bbq.pushState({ chartTypes: selectedChartTypes.join(',') });
};

UrlStateManager.getUrlChartTypes = function (withVisibleState) {
    /// <summary>
    /// Return array of chart types from Url state. UrlKey - 'chartTypes'.
    /// </summary>

    if ($.bbq.getState('chartTypes') != null) {
        var chartTypes = [];
        $.each($.bbq.getState('chartTypes').split(','), function (key, value) {
            if (!withVisibleState) {
                if (value.indexOf(':') > -1) {
                    var val = value.split(':');
                    chartTypes.push(val[0]);
                } else {
                    chartTypes.push(value);
                }
            } else {
                chartTypes.push(value);
            }
        });
        return chartTypes;
    }
    return [];
};
UrlStateManager.getDateDiapason = function (st, ed) {
    return Filter.getPeriodText($.bbq.getState(st), $.bbq.getState(ed)).replace(/ - /,'<br/>-<br/>');  
};
UrlStateManager.clearUrlState = function () {
    jQuery.bbq.removeState();
};

UrlStateManager.getUrlStateString = function () {
    return jQuery.param.fragment();
};

UrlStateManager.getUrlStateObject = function (state) {
    if (state == null) {
        return $.bbq.getState();
    } else {
        return $.bbq.getState(state);
    }
};

UrlStateManager.getDateFromState = function (dateParamName) {
    if ($.bbq.getState(dateParamName) != null) {
        var parts = $.bbq.getState(dateParamName).split('-');
        if (parts.length == 3) {
            return new Date(parts[0], parts[1] * 1 - 1, parts[2]);
        }
    }
    return null;
};
UrlStateManager.isAggregateMode = function () {
    return $.bbq.getState("mode") == 'aggregate' || $.bbq.getState("mode") == 'aggregate_lite' || typeof Statistic != "undefined" && Statistic.isAnalysisStatisticsMode() == true;
};
UrlStateManager.isAggregateLiteMode = function () {
    return $.bbq.getState("mode") == 'aggregate_lite';
};

UrlStateManager.isCompareMode = function () {
    return $.bbq.getState("mode") == 'compare';
};

UrlStateManager.isCrossShopingMode = function () {
    return $.bbq.getState("mode") == 'crossshoping';
};

UrlStateManager.isCrossShopingByZonesMode = function () {
    return $.bbq.getState("mode") == 'crossshopingbyzones';
};

UrlStateManager.isShopCenterMode = function () {
    return $.bbq.getState("mode") == 'shopCenter';
};

UrlStateManager.isIndustryMode = function () {
    return $.bbq.getState("mode") == 'industry';
};

UrlStateManager.getMode = function () {
    return $.bbq.getState("mode");
};

UrlStateManager.updateUrlWithShopCenterTreeItems = function (selectedNode) {
    $.bbq.pushState({ selectedTreeItems: selectedNode.data.key });
};

UrlStateManager.updateUrlWithAggregateTreeItems = function (selectedNodes) {
    var selectedItemsIds = '';

    //Quickfix for single shop cities
    if (selectedNodes != null && selectedNodes.length == 1) {
        var value = selectedNodes[0];

        if (value.ShopId != undefined) {
            selectedItemsIds += value.ShopId;
        }
        if (value.CityId != undefined) {
            if (value.Shops != null && value.Shops.length == 1) {
                selectedItemsIds += value.Shops[0].ShopId;
            } else {
                selectedItemsIds += value.CityId;
            }
        }
        if (value.GroupId != undefined) {
            selectedItemsIds += value.GroupId;
        }
        if (value.ZoneId != undefined) {
            selectedItemsIds += value.ZoneId;
        }
        if (value.CamId != undefined) {
            selectedItemsIds += value.CamId;
        }
    } else {
        $.each(selectedNodes, function (key, value) {
            if (selectedItemsIds != '') {
                selectedItemsIds += ',';
            }
            if (value.ShopId != undefined) {
                selectedItemsIds += value.ShopId;
            }
            if (value.CityId != undefined) {
                selectedItemsIds += value.CityId;
            }
            if (value.GroupId != undefined) {
                selectedItemsIds += value.GroupId;
            }
            if (value.ZoneId != undefined) {
                selectedItemsIds += value.ZoneId;
            }
            if (value.CamId != undefined) {
                selectedItemsIds += value.CamId;
            }
        });
    }
    if (selectedItemsIds == '') {
        selectedItemsIds += 'network';
    }
    $.bbq.pushState({ selectedTreeItems: selectedItemsIds });
};

UrlStateManager.isAggregationCompareEnabled = function () {
    if ($.bbq.getState("startComparePeriod") != null && $.bbq.getState("endComparePeriod") != null) {
        return true;
    }
    return false;
};

UrlStateManager.updateAggregateUrlDates = function (startDate, endDate, startCompareDate, endCompareDate) {
    startDate = startDate.getFullYear() + '-' + ("0" + (startDate.getMonth() + 1)).slice(-2) + '-' + ("0" + startDate.getDate()).slice(-2);
    endDate = endDate.getFullYear() + '-' + ("0" + (endDate.getMonth() + 1)).slice(-2) + '-' + ("0" + endDate.getDate()).slice(-2);

    if (startCompareDate != null) {
        startCompareDate = startCompareDate.getFullYear() + '-' + ("0" + (startCompareDate.getMonth() + 1)).slice(-2) + '-' + ("0" + startCompareDate.getDate()).slice(-2);
    }
    if (endCompareDate != null) {
        endCompareDate = endCompareDate.getFullYear() + '-' + ("0" + (endCompareDate.getMonth() + 1)).slice(-2) + '-' + ("0" + endCompareDate.getDate()).slice(-2);
    }
    UrlStateManager.synchronizeUrlState('startPeriod', startDate);
    UrlStateManager.synchronizeUrlState('endPeriod', endDate);
    UrlStateManager.synchronizeUrlState('startComparePeriod', startCompareDate);
    UrlStateManager.synchronizeUrlState('endComparePeriod', endCompareDate);
};

UrlStateManager.getChartAverages = function () {
    if ($.bbq.getState("chartTypeAverage") != null) {
        var averages = [];
        var averagesState = $.bbq.getState("chartTypeAverage").split(',');
        $.each(averagesState, function (key, value) {
            var agvData = value.split(':');
            var chartTypeId = agvData[0] * 1;
            var avgType = agvData[1];
            averages.push({
                chartTypeId: chartTypeId,
                avgType: avgType
            });
        });
        return averages;
    }
    return [];
};

UrlStateManager.setUrlSelectedAverageTypes = function (averages) {
    var averageState = '';
    $.each(averages, function (key, average) {
        if (averageState != '') {
            averageState += ',';
        }
        averageState += average.chartTypeId + ':' + average.avgType;
    });
    UrlStateManager.synchronizeUrlState("chartTypeAverage", averageState);
};

UrlStateManager.getChartTrendlines = function () {
    if ($.bbq.getState("chartTypeTrendline") != null) {
        var trendlines = [];
        var trendlinesState = $.bbq.getState("chartTypeTrendline").split(',');
        $.each(trendlinesState, function (key, value) {
            var tlData = value.split(':');
            var chartTypeId = tlData[0] * 1;
            var tlType = tlData[1];
            trendlines.push({
                chartTypeId: chartTypeId,
                tlType: tlType
            });
        });
        return trendlines;
    }
    return [];
};

UrlStateManager.setUrlSelectedTrendlineTypes = function (trendlines) {
    var trendlineState = '';
    $.each(trendlines, function (key, trendline) {
        if (trendlineState != '') {
            trendlineState += ',';
        }
        trendlineState += trendline.chartTypeId + ':' + trendline.tlType;
    });
    UrlStateManager.synchronizeUrlState("chartTypeTrendline", trendlineState);
};


UrlStateManager.urlContainsOnlyTreeState = function () {
    if ($.bbq.getState("selectedTreeItems") != null && $.bbq.getState("mode") == null && $.bbq.getState("step") == null && $.bbq.getState("chartTypes") == null) {
        return true;
    } else return false;
};

UrlStateManager.datasourcetypeId = function () {
    if ($.bbq.getState("datasourcetypeId") != null)
        return $.bbq.getState("datasourcetypeId");
    else
        return "";
};

