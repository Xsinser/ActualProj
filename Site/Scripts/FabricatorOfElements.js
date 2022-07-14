function FabricatorOdElements() {
}

FabricatorOdElements.GetMainReportLegendElement = function (color, chartId, chartName, chartNameSecondRow, AddThirdRow, chartNameThirdRow, chartAreaName) {
    var element = '<div  class="row" >';
    element += '<div class="col-1">';
    element += '<div class="box" style="background-color:' + color + ';width: 16px;'
        + 'height: 12px;' +
        +'border - radius: 2px;' +
        +'margin - top: 6px;' +
        +'position: absolute;' + '"></div>';
    element += '</div>';
    element += '<div  class="col" >';
    element += '<span onClick="HighchartsManager.legendHeaderClick(event)" class="legendHeader" chartAreaId="' + chartAreaName + '" style ="cursor:pointer;"  charttypeid="' + chartId + '">' + chartName + '</span><br/>';



    element += '<label style="display:inline-block;width:100%" onClick="HighchartsManager.legendClick(event)" id="clt' + chartId + '" chartAreaId="' + chartAreaName + '" chartType="trend ' + chartId + '"><input type="checkbox"  id="clti' + chartId + '" chartAreaId="' + chartAreaName + '" chartType="trend ' + chartId + '" />' + chartNameSecondRow + '</label><br/>';
    if (AddThirdRow) {
        //element += '<label  onClick="HighchartsManager.legendClick(event)" style="color: rgb(204, 204, 204);display:inline-block;width:100%"><input type="checkbox" charttypeid="' + chartId + '" averageType="' + 'avg' + '" disabled="disabled"/>'
        //    + chartNameThirdRow + '</label>';
        element += '<label style="display:inline-block;width:100%" onClick="HighchartsManager.legendClick(event)" id="clt' + chartId + '" chartAreaId="' + chartAreaName + '" chartType="avr ' + chartId + '"><input type="checkbox"  id="clts' + chartId + '" chartAreaId="' + chartAreaName + '" chartType="avr ' + chartId + '" />' + chartNameThirdRow + '</label><br/>';

    }
    element += '<br/>';
    element += '</div>';
    element += '</div>';
    return element;
}

FabricatorOdElements.GetObjectLists = function (bundleTypeId, container,fatherId) {
    var controller = '';
    switch (bundleTypeId) {
        case 1:
            controller = "EditCity";
            break;
        case 2:
            controller = "EditShop";
            break;
        case 3:
            controller = "EditZone";
            break;
        case 4:
            controller = "EditCamera";
            break;

    }
    $.ajax({
        async: false,
        type: "POST",
        data: { bundleTypeId: bundleTypeId, bundleFatherId: fatherId },
        url: '/Admin/GetBundles',
        success: function (ajaxResult) {
            var result = '<div>';
            for (let i = 0; i < ajaxResult.result.length; i++) {
                result += '<div class="row"><div class="col"><a href="/Admin/' + controller + '?id=' + ajaxResult.result[i].Id + '">' + ajaxResult.result[i].Name + '</a></div></div>';
            }
            result += '</div>';
            var containerName = '#' + container;
            $(containerName).append(result);
        }
    });
}
