const slide_num = document.querySelectorAll(".slide_num");
let current_slide = document.querySelector(".slide_num.selected");

window.onload = function () {
  slide_num.forEach(function (item, index) {
    item.addEventListener("click", function (e) {
      let elem = e.target;
      let parent = elem.parentNode;

      if (elem !== current_slide) {
        elem.classList.add("selected");
        current_slide.classList.remove("selected");
        current_slide = elem;
        let nth;
        parent.querySelectorAll(".slide_num").forEach(function (item, index) {
          if (item === elem) nth = index;
        });
        setSlide(nth);
      }
    });
  });
};

function setSlide(nth) {
  getSettings();
  showSummary();
  let slides = document.querySelectorAll("#main_slide .slide");
  slides.forEach(function (item, index) {
    item.classList.remove("selected");
    if (nth === index) item.classList.add("selected");
  });
}

$(document).on("click", "#main_slide .slide .tab .title", function (e) {
  e.target.parentNode.classList.toggle("selected");
});
$(document).on("change", "input", function (e) {
  getSettings();
  showSummary();
});

getData();
