const modal = document.getElementById("modal");
const btn_modal = document.getElementById("btn_modal");
const span = modal.querySelector("#modal .close");
const modalTable = modal.querySelector("table tbody");
btn_modal.onclick = function () {
  modalContent();
  modal.style.display = "flex";
};
span.onclick = function () {
  modal.style.display = "none";
};
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

function modalContent() {
  modalTable.innerHTML = "";

  for (var i = 0; i < 25; i++) {
    let item = new Starforce(settings.item.level, i);

    let star = i + "성";
    let cost = splitNum(item.starCost()) + " 메소";
    let sale = Number(splitNum(item.getInfo("saleRate") * 100));
    sale += "%";
    let sucRate = item.getInfo("successRate");
    let desRate = (1 - sucRate) * item.getInfo("destroyRate");
    let failRate = 1 - sucRate - desRate;
    sucRate = splitNum(sucRate * 100) + "%";
    desRate = splitNum(desRate * 100) + "%";
    failRate = splitNum(failRate * 100) + "%";

    tableUpdate(modalTable, star, cost, sale, sucRate, failRate, desRate);
  }
}
