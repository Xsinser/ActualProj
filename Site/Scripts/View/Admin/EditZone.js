function Admin_EditZone() {
}

Admin_EditZone.Init = function () {
    FabricatorOdElements.GetObjectLists(4, "camerasMarker", $("#Id").val()-0);
}