function getCookie(nombre) {
    var regex = new RegExp("(?:(?:^|.*;\\s*)" + nombre + "\\s*\\=\\s*([^;]*).*$)|^.*$");
    var valorCookie = document.cookie.replace(regex, "$1");
    return decodeURIComponent(valorCookie);
}
