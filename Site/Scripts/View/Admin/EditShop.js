function Admin_EditShop() {
}

Admin_EditShop.Init = function () {
    FabricatorOdElements.GetObjectLists(3, "zonesMarker", $("#Id").val()-0);
}