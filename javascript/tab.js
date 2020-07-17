const header = document.querySelector("#tab .header");
const content = document.querySelector("#tab .content");
var tab_btn = header.querySelectorAll(".tab_btn");

tab_btn.forEach(function (item, index) {
  item.addEventListener("click", function (e) {
    let elem = e.target;
    let parent = elem.parentNode;
    let childs = parent.querySelectorAll(".tab_btn");
    let num = -1;

    // 몇번째 탭을 클릭했는지 확인
    childs.forEach(function (item, index) {
      if (item === elem) num = index;
    });
    btn_select(num);
    cont_select(num);
  });
});

function btn_select(n) {
  let btn = header.querySelectorAll(".tab_btn");
  btn.forEach(function (item, index) {
    if (index === n) item.classList.add("selected");
    else item.classList.remove("selected");
  });
}
function cont_select(n) {
  let box = content.querySelectorAll(".box");
  box.forEach(function (item, index) {
    if (index === n) item.classList.add("selected");
    else item.classList.remove("selected");
  });
}
