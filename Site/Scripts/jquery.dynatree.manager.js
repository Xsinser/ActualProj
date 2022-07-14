
function TreeManager() {
}

TreeManager.isNetworkSelected = false;
TreeManager.reportTreesAreLoading = false;
TreeManager.initialLoad = false;
TreeManager.isUpdating = false;
isCity = function (node) { return (node.data.key.indexOf('city_') > -1); }
isGroup = function (node) { return (node.data.key.indexOf('group_') > -1); }
isShop = function (node) { return (node.data.key.indexOf('shop_') > -1); }
isZone = function (node) { return (node.data.key.indexOf('zone_') > -1); }
isCam = function (node) { return (node.data.key.indexOf('cam_') > -1); }

TreeManager.initialize = function (data, onSelect, onCliclFunc,selectMode) {


    $('#tree').dynatree({
        onLazyRead: function (node) {
            node.appendAjax({
                url: "/sendData",
                data: {
                    "key": node.data.key, // Optional url arguments
                    "mode": "all"
                }
            });
        },
        children: data,
        checkbox: true,
        selectMode: selectMode,
        imagePath: "/Content/images/",
        onSelect: onSelect,
        debugLevel: 0
    }); 
    $.widget.bridge('uitooltip', $.ui.tooltip);   
    $('#tree').uitooltip({
        position: { my: "left-220 center", at: "right top+15" },
        items: "li",
        content: function () {
            var val = $("#buttonSelect").val();
            return "<input type='button' onclick='" + onCliclFunc + "();' value = '" + val + "' />";
        },
        show: null, // show immediately
        open: function (event, ui) {
            if (typeof (event.originalEvent) === 'undefined') {
                return false;
            }
            var $id = $(ui.tooltip).attr('id');
            $('div.ui-tooltip').not('#' + $id).remove();
        },
        close: function (event, ui) {
            ui.tooltip.hover(function () {
                $(this).stop(true).fadeTo(400, 1);
            },
                function () {
                    $(this).fadeOut('400', function () {
                        $(this).remove();
                    });
                });
        }
    });
    $("#tree").tooltip();
};

TreeManager.applyUrlFilters = function (filters) {

    if (filters == null) {
        return;
    }

    $("#tree").dynatree("getRoot").visit(function (treeNode) {
        treeNode.select(false);
    });

    TreeManager.isNetworkSelected = false;
    $.each(filters, function (key, value) {
        if (value.Nodekey.indexOf('network') > -1) {
            TreeManager.isNetworkSelected = true;
            return false;
        }
        return true;
    });

    var node;
    var tree = $('#tree').dynatree("getTree");
    if (TreeManager.isNetworkSelected) {
        node = tree.getNodeByKey('network');
        if (node != null) {

            TreeManager.selectNode(node);
        }
    } else {
        $.each(filters, function (key, value) {
            node = tree.getNodeByKey(value.Nodekey);
            if (node != null) {
                TreeManager.selectNode(node);
            }
        });
    }
};

TreeManager.selectNode = function (node) {
    node.select(true);
    DynatreeUtils.expandTreeBranchByNode(node);
    TreeManager.onSelected(node);
};

TreeManager.onNodeSelected = function (select, node) {
    if (TreeManager.reportTreesAreLoading) {
        return;
    }

    if (TreeManager.isUpdating) {
        return;
    }

    TreeManager.isUpdating = true;
    if (select) {
        DynatreeUtils.expandTreeBranchByNode(node);

    } else {
        TreeManager.onDeselected(node);
    }

    TreeManager.isUpdating = false;

    // todo: refactor here
    var selectedItems = TreeManager.getSelectedItems();
    if ((selectedItems == null || selectedItems.length == 0) && (select)) {
        TreeManager.isNetworkSelected = true;
    }
    //var tt = node.attr('Id');
    //var aa = 2;
    UrlStateManager.updateUrlWithAggregateTreeItems(selectedItems);
};

TreeManager.onSelected = function (node) {

    TreeManager.manageSelection(node);


    //UrlStateManager.updateUrlWithSelectedChartTypes(false);
};
TreeManager.manageSelection = function (node) {
    if (node.getLevel() == 1) { // the network node selected
        if (TreeManager.isNetworkSelected) {
            if (TreeManager.initialLoad) {
                TreeManager.initialLoad = false;
            }
            else {
                TreeManager.deselectChildNodes(node);
                TreeManager.isNetworkSelected = false;
            }
        }
        else {
            TreeManager.selectChildNodes(node);
            TreeManager.isNetworkSelected = true;
        }
        TreeManager.deselectGroupsNodes(node);
    } else if (node.getLevel() == 2) { // a city node selected
        if (isGroup(node)) {
            TreeManager.deselectCityNodes(node.tree);
        }
        if (isCity(node)) {
            TreeManager.deselectAllGroupNodes(node.tree);
        }
        TreeManager.selectChildNodes(node);
    } else if (node.getLevel() == 3) { // a shop node selected
        TreeManager.deselectAllGroupNodes(node.tree);
    } else if (node.getLevel() == 4) { // a zone node selected
        //alert("tree error!!!");
        //var tree = $('#tree').dynatree("getTree");
        //var selectedNodes = $('#tree').dynatree("getSelectedNodes");
        //if (selectedNodes.length > 0) {
        //    $.each(selectedNodes, function (key, value) {
        //        if (value.parent.data.key != node.parent.data.key) {
        //            tree.selectKey(value.data.key, false);
        //        }
        //    });
        //}
        TreeManager.onZoneNodeSelected(node);
    }
}

TreeManager.manageDeselection = function (node) {
    TreeManager.isNetworkSelected = false;
    if (node.getLevel() == 1) { // the network node deselected
        TreeManager.deselectChildNodes(node);
    } else if (node.getLevel() == 2) { // a city node deselected
        TreeManager.deselectChildNodes(node);
        if (node.getParent().isSelected()) {
            node.getParent().select(false);
        }
    } else if (node.getLevel() == 3) { // a shop node deselected
        if (node.getParent().isSelected()) {
            node.getParent().select(false);
        }
        if (node.getParent().getParent().isSelected()) {
            node.getParent().getParent().select(false);
        }
    } else if (node.getLevel() == 4) { // a zone node deselected

    }
}

TreeManager.onDeselected = function (node) {
    TreeManager.manageDeselection(node);

    //UrlStateManager.updateUrlWithSelectedChartTypes(false);
};


TreeManager.selectChildNodes = function (node) {
    if (node.getLevel() <= 2 && node.childList != null) {
        $.each(node.childList, function (key, value) {
            if (!value.isSelected()) {
                value.select(true);
            }
            if (value.getLevel() <= 2) {
                TreeManager.selectChildNodes(value);
            }
        });
    }
};

TreeManager.deselectChildNodes = function (node) {
    if (node.getLevel() <= 2) {
        $.each(node.childList, function (key, value) {
            if (value.isSelected()) {
                value.select(false);
            }
            if (value.getLevel() <= 2) {
                TreeManager.deselectChildNodes(value);
            }
        });
    }
};

TreeManager.deselectZoneNodes = function (node) {
    /// <summary>
    /// Deselects all zones.
    /// </summary>

    if (node.getLevel() < 4 && node.childList != null) {
        $.each(node.childList, function (key, value) {
            if (value.getLevel() == 4 && value.isSelected()) {
                value.select(false);
            }
            if (value.getLevel() < 4 && value.childList != null) {
                TreeManager.deselectZoneNodes(value);
            }
        });
    }
};

TreeManager.deselectGroupsNodes = function (node) {
    /// <summary>
    /// Deselects all groups.
    /// </summary>

    if (node.getLevel() == 1 && node.childList != null) {
        $.each(node.childList, function (key, value) {
            if (value.getLevel() == 2 && value.isSelected() && value.data.key.indexOf('group') > -1) {
                value.select(false);
                TreeManager.deselectChildNodes(value);
            }
        });
    }
};

TreeManager.deselectCityNodes = function (tree) {
    /// <summary>
    /// Deselects all groups.
    /// </summary>
    $.each(tree.getRoot().childList[0].childList, function (key, value) {
        if (value.data.key.indexOf('city') > -1) {
            value.select(true);
            value.select(false);
            //TreeManager.deselectChildNodes(value);
        }
    });
};

TreeManager.deselectAllGroupNodes = function (tree) {
    /// <summary>
    /// Deselects all groups.
    /// </summary>
    $.each(tree.getRoot().childList[0].childList, function (key, value) {
        if (value.data.key.indexOf('group') > -1) {
            value.select(false);
            TreeManager.deselectChildNodes(value);
        }
    });
};

TreeManager.onZoneNodeSelected = function (node) {
    /// <summary>
    /// Occurs when a zone node is selected.
    /// Need to deselect all nodes like: network, city and shop.
    /// </summary>

    var network = node.getParent().getParent().getParent();
    if (network.isSelected()) {
        network.select(false);
    }
    TreeManager.deselectChildNodes(network);
};

TreeManager.onNotZoneNodeSelected = function (node) {
    /// <summary>
    /// Occurs when a not zone node is selected.
    /// Need to deselect all zone nodes in the aggregation tree.
    /// </summary>

    var network = node;
    while (network.getParent().getLevel() > 1) {
        network = network.getParent();
    }

    TreeManager.deselectZoneNodes(network);
};

TreeManager.getTreeManagerRequest = function () {
    /// <summary>
    /// Gets an aggregation tree request for the server.
    /// </summary>

    var TreeManagerRequest = TreeManager.createTreeManagerRequest();

    var isEmptyRequest = true;
    var areAnyNodeSelected = false;

    var tree = $('#tree').dynatree("getTree");

    var network = tree.getNodeByKey('network');
    if (network != null) {
        isEmptyRequest = false;
        TreeManagerRequest.Network = {
            Cities: [],
            Groups: [],
        };

        TreeManagerRequest.Network.Id = 0;
        TreeManagerRequest.Network.IsSelected = network.isSelected();

        if (TreeManagerRequest.Network.IsSelected) {
            areAnyNodeSelected = true;
        }

        if (network.childList != null) {
            $.each(network.childList, function (key, node) {
                if (node.data.key.indexOf('city') > -1) {
                    var city = {
                        Id: node.data.key.replace('city_', ''),
                        IsSelected: node.isSelected(),
                        InnerItems: [],
                    };

                    if (city.IsSelected) {
                        areAnyNodeSelected = true;
                    }

                    $.each(node.childList, function (k, n) {
                        var shop = {
                            Id: n.data.key.replace('shop_', ''),
                            IsSelected: n.isSelected(),
                        };

                        if (shop.IsSelected) {
                            areAnyNodeSelected = true;
                        }

                        city.InnerItems.push(shop);
                    });

                    TreeManagerRequest.Network.Cities.push(city);
                } else if (node.data.key.indexOf('group') > -1) {
                    var group = {
                        Id: node.data.key.replace('group_', ''),
                        IsSelected: node.isSelected(),
                        InnerItems: [],
                    };

                    if (group.IsSelected) {
                        areAnyNodeSelected = true;
                    }

                    $.each(node.childList, function (k, n) {
                        var shop = {
                            Id: n.data.key.replace('shop_', ''),
                            IsSelected: true,
                        };

                        group.InnerItems.push(shop);
                    });

                    TreeManagerRequest.Network.Groups.push(group);
                }
            });
        }
    }

    // note: if aren't any selected nodes need to select all network ...
    if (!areAnyNodeSelected) {
        TreeManagerRequest.Network.Id = 0;
        TreeManagerRequest.Network.IsSelected = true;
        TreeManagerRequest.Network.Cities = [];
        TreeManagerRequest.Network.Groups = [];

        $.each(TreeManagerRequest.Network.Cities, function (key, city) {
            city.IsSelected = true;
            $.each(city.InnerItems, function (k, shop) {
                shop.IsSelected = true;
            });
        });
        $.each(TreeManagerRequest.Network.Groups, function (key, group) {
            group.IsSelected = true;
        });
    }

    if (isEmptyRequest) {
        return null;
    } else {
        return TreeManagerRequest;
    }
};

TreeManager.createTreeManagerRequest = function () {
    /// <summary>
    /// Creates an aggregation tree request for the server. The request contains only dates.
    /// </summary>

    var firstInterval = {
        StartDate: Filter.getStartDateFilterString(),
        EndDate: Filter.getEndDateFilterString(),
    };

    var isEnableComparison = false;
    if ($('.enable-comparison')[0].checked) {
        isEnableComparison = true;
    }

    var secondInterval = {
        StartDate: Filter.getStartCompareDateFilterString(),
        EndDate: Filter.getEndCompareDateFilterString(),
    };

    var TreeManagerRequest = {
        FirstInterval: firstInterval,
        SecondInterval: isEnableComparison ? secondInterval : null,
    };

    return TreeManagerRequest;
};




TreeManager.getSelectedGroups = function () {
    var nodes = $('#tree').dynatree("getSelectedNodes");
    var groupIds = [];

    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].data.key.indexOf('group') > -1) {
            groupIds.push(nodes[i].data.key.replace('group_', '') * 1);
        }
    }

    return groupIds;
}

TreeManager.getSelectedShops = function () {
    var nodes = $('#tree').dynatree("getSelectedNodes");
    var shopIds = [];

    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].data.key.indexOf('shop') > -1) {
            if (nodes[i].parent != null && nodes[i].parent.data.key.indexOf('group') == -1) {
                shopIds.push(nodes[i].data.key.replace('shop_', '') * 1);
            }
        }
    }

    return shopIds;
}



TreeManager.selectChildNodes = function (node) {
    /// <summary>
    /// Selects all child cities and shops.
    /// </summary>

    if (node.getLevel() <= 2 && node.childList != null) {
        $.each(node.childList, function (key, value) {
            if (!value.isSelected()) {
                value.select(true);
            }
            if (value.getLevel() <= 2) {
                TreeManager.selectChildNodes(value);
            }
        });
    }
};

TreeManager.deselectChildNodes = function (node) {
    /// <summary>
    /// Deselects all child cities and shops.
    /// </summary>

    if (node.getLevel() <= 2) {
        $.each(node.childList, function (key, value) {
            if (value.isSelected()) {
                value.select(false);
            }
            if (value.getLevel() <= 2) {
                TreeManager.deselectChildNodes(value);
            }
        });
    }
};



TreeManager.getSelectedItems = function () {
    var arr = $("#tree").dynatree("getSelectedNodes");
    var items = [];

    $.each(arr, function (key, value) {
        TreeManager.getSelectedItem(value, items);
    });
    return items;
}


//ВОТ ТУТ ПОЧИНИТЬ
//TODO: REFACTOR HERE
TreeManager.getSelectedItem = function (value, items) {

    if (value.data.key.indexOf('group') > -1) {
        var parentKey = value.parent.data.key;
        var item = null;
        if (value.data.key.indexOf('shop') > -1) {
            if (items.length > 0 && items[items.length - 1].Groups != null) {
                $.each(items[items.length - 1].Groups, function (key, group) {
                    if (parentKey == group.GroupId) {
                        item = group;
                    }
                });
            }

            if (item == null) {
                if (items[items.length - 1] != null && items[items.length - 1].GroupId != null) {
                    if (parentKey == items[items.length - 1].GroupId) {
                        item = items[items.length - 1];
                    }
                }
            }

            if (item != null) {
                item.Shops.push({
                    ShopId: value.data.key,
                    Zones: []
                });
            } else {
                items.push({
                    ShopId: value.data.key,
                    Zones: []
                });
            }
        } else {
            if (items.length > 0 && items[items.length - 1].Groups != null) {
                items[items.length - 1].Groups.push({
                    GroupId: value.data.key,
                    Shops: []
                });
            } else {
                items.push({
                    GroupId: value.data.key,
                    Shops: []
                });
            }
        }
    }
    else if (value.data.key.indexOf('network') > -1) {
        items.push({
            Cities: [],
            Groups: []
        });
    }
    else if (value.data.key.indexOf('city') > -1) {
        if (items.length > 0 && items[items.length - 1].Cities != null) {
            items[items.length - 1].Cities.push({
                CityId: value.data.key,
                Shops: []
            });
        } else {
            items.push({
                CityId: value.data.key,
                Shops: []
            });
        }
    } else if (value.data.key.indexOf('shop') > -1) {
        var parentKey = value.parent.data.key;
        var item = null;

        if (items.length > 0 && items[items.length - 1].Cities != null) {
            $.each(items[items.length - 1].Cities, function (key, city) {
                if (parentKey == city.CityId) {
                    item = city;
                }
            });

            $.each(items[items.length - 1].Groups, function (key, group) {
                if (parentKey == group.GroupId) {
                    item = group;
                }
            });
        }
        if (item == null) {
            if (items[items.length - 1] != null && items[items.length - 1].CityId != null) {
                if (parentKey == items[items.length - 1].CityId) {
                    item = items[items.length - 1];
                }
            }
        }

        if (item != null) {
            item.Shops.push({
                ShopId: value.data.key,
                Zones: []
            });
        } else {
            items.push({
                ShopId: value.data.key,
                Zones: []
            });
        }
    }
    else if (value.data.key.indexOf('zone') > -1) {
        parentKey = value.parent.data.key;
        item = null;
        if (items.length > 0 && items[items.length - 1].Cities != null) {
            $.each(items[items.length - 1].Cities, function (key, city) {
                $.each(city.Shops, function (key, shop) {
                    if (parentKey == shop.ShopId) {
                        item = shop;
                    }
                });
            });
        }

        if (item == null) {
            if (items[items.length - 1] != null && items[items.length - 1].ShopId != null) {
                if (parentKey == items[items.length - 1].ShopId) {
                    item = items[items.length - 1];
                }
            }
        }

        if (item == null) {
            $.each(items, function (keyItem, valueItem) {
                if (valueItem.CityId != null) {
                    $.each(valueItem.Shops, function (keyItemShop, valueItemShop) {
                        if (valueItemShop.ShopId == parentKey) {
                            item = valueItemShop;
                        }
                    });
                }
            });
        }

        if (item != null) {
            item.Zones.push({
                ZoneId: value.data.key,
                Cams: []
            });
        } else {
            items.push({
                ZoneId: value.data.key,
                Cams: []
            });
        }
    }
    else if (value.data.key.indexOf('cam') > -1) {
        parentKey = value.parent.data.key;
        item = null;
        if (items.length > 0 && items[items.length - 1].Cities != null) {
            $.each(items[items.length - 1].Cities, function (key, city) {
                $.each(city.Shops, function (key, shop) {
                    $.each(shop.Zones, function (key, zone) {
                        if (parentKey == zone.ZoneId) {
                            item = zone;
                        }
                    });
                });
            });
        }

        if (item == null) {
            if (items[items.length - 1] != null && items[items.length - 1].ZoneId != null) {
                if (parentKey == items[items.length - 1].ZoneId) {
                    item = items[items.length - 1];
                }
            }
        }

        if (item == null) {
            $.each(items, function (keyItem, valueItem) {
                if (valueItem.CityId != null) {
                    $.each(valueItem.Zones, function (keyItemShop, valueItemZone) {
                        if (valueItemShop.ZoneId == parentKey) {
                            item = valueItemZone;
                        }
                    });
                }
            });
        }


        if (item != null) {
            item.Cams.push({
                CamId: value.data.key,
            });
        } else {
            items.push({
                CamId: value.data.key,
            });
        }
    }
}