function DynatreeUtils() {
    /// <summary>
    /// The class contains contains utilities for a dynatree tree object which is represented by the jquery.dynatree.js file.
    /// </summary>    
}

DynatreeUtils.expandChildNodes = function(node) {
    /// <summary>
    /// Expands all child nodes of the specific tree node.
    /// </summary>
    //console.log('node.childList', node.childList );

    if (!node.bExpanded) {
            node.expand(true);
        }

    if (node.childList == null) {
        return;
    }
    
    $.each(node.childList, function(keyChild, valueChild) {
        if (!valueChild.bExpanded) {
            valueChild.expand(true);
        }
        if (valueChild.childList != null && valueChild.childList.length > 0) {
            DynatreeUtils.expandChildNodes(valueChild);
        }
    });
};

DynatreeUtils.expandParentNodes = function(node) {
    /// <summary>
    /// Expands all parent nodes of the specific tree node.
    /// </summary>

    if (node.parent != null) {
        DynatreeUtils.expandParentNodes(node.parent);
    }
    if (!node.bExpanded) {
        node.expand(true);
    }
};

DynatreeUtils.expandTreeBranchByNode = function(node) {
    /// <summary>
    /// Expands all parent and child nodes of the specific tree node.
    /// </summary>

    if (node.parent != null) {
        DynatreeUtils.expandParentNodes(node.parent);
    }
    node.expand(true);
    DynatreeUtils.expandChildNodes(node);
};

DynatreeUtils.collapseNode = function(node) {
    /// <summary>
    /// Collapses specific tree node.
    /// </summary>
    node.visit(function (n) {
        n.expand(false);
    });
    return false;
};

DynatreeUtils.collapseNodes = function (nodes) {
    /// <summary>
    /// Collapses all specific tree nodes.
    /// </summary>
    $.each(nodes, function (en, node) {
        DynatreeUtils.collapseNode(node);
    });
    return false;
};

DynatreeUtils.collapseChildNodes = function(node)
{
    /// <summary>
    /// Collapses all child nodes of the specific tree node.
    /// </summary>
    var childNodes = node.getChildren();
    return DynatreeUtils.collapseNodes(childNodes);
};



DynatreeUtils.areSiblingsSelected = function(node) {
    /// <summary>
    /// Checks that all node's siblings was selected.
    /// </summary>

    var areSiblingsSelected = true;
    if (node.getParent() != null) {
        $.each(node.getParent().childList, function(key, value) {
            if (!value.isSelected()) {
                areSiblingsSelected = false;
                return false;
            }
            return true;
        });
    } else {
        areSiblingsSelected = false;
    }
    return areSiblingsSelected;
};

DynatreeUtils.selectChildren = function (node, select) {
    //console.log('selectChildren', '' + node.data.key + ': ' + select);
    node.visit(function(node){
        node.select(select);
    });
};

DynatreeUtils.selectParents = function (node, select) {
    if (node.parent != null)
    {
        //console.log('selectParents', '' + node.data.key + ': ' + select);
        node.parent.select(select);

        if (node.parent.parent != null)
            DynatreeUtils.selectParents(node.parent, select);
    }
};

DynatreeUtils.checkNode = function (node, select) {
    //console.log('checkNode', '' + node.data.key + ': ' + select);
    // если есть родитель и галка снята, снять галки у всех родителей
    if (node.parent != null && select == false)
    {
        // получу список детей
        var checkedChildren = [];
        checkedChildren = DynatreeUtils.selectCheckedChildrenKeys(node.parent, checkedChildren);
        //console.log('checkedChildren', checkedChildren);
        DynatreeUtils.selectParents(node, select);


        $.each(checkedChildren, function (n, v) {
            //console.log('v', v);
            node.tree.selectKey(v);
        });
    }

    // если есть дети проставить галку для всех детей
    if (node.childList != null && node.childList.length > 0)
    {
        DynatreeUtils.selectChildren(node, select);
    }

    //node.select(select);
};

DynatreeUtils.selectCheckedChildrenKeys = function (node, keysArr) {
    if (node.childList == null || node.childList.length < 1) return keysArr;

    $.each(node.childList, function (n, v) {
        if (v != null && v.bSelected)
            if (v.data != null && v.data.key != null) {
                keysArr.push(v.data.key);
                if (v.childList != null)
                    DynatreeUtils.selectCheckedChildrenKeys(v, keysArr);
            }
    });

    return keysArr;
};


DynatreeUtils.getAllNodesOfPrefix = function (tree, prefix) {
        var nodeList = [];
        tree.visit(function(node){
            if(node.data.key.indexOf(prefix) > -1) {
                nodeList.push(node);
            }
        });
        return nodeList;
};

