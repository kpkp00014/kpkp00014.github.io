function include() {
  var includes = $("[data-include]");
  jQuery.each(includes, function (item, index) {
    var file = "html/" + $(this).data("include") + ".html";
    $(this).load(file);
  });
}
