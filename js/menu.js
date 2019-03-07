function foldMenu() {
    var x = document.getElementById("myTopnav");
    if (x.className === "smallmenu") {
        x.className += " afterClick";
    } else {
        x.className = "smallmenu";
    }
}
