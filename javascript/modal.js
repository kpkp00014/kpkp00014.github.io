const modal = document.getElementById("modal");
const btn_modal = document.getElementById("btn_modal");
const span = modal.querySelector("#modal .close");
const modalTable = modal.querySelector("table tbody");
btn_modal.onclick = function () {
  modalContent();
  modal.style.display = "block";
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
    let sale = settings.event.sunday == "sale30" ? 30 : 0;
    if (i < 17) {
      let a_sale = settings.a_sale.pcroom
        ? settings.a_sale.mvp + 5
        : settings.a_sale.mvp;

      sale = 1 - (1 - 0.01 * sale) * (1 - 0.01 * a_sale);
      sale = Number(splitNum(sale * 100));
    }

    sale = 100 - sale;

    if (settings.prevDes.includes(i) && !settings.event.free)
      if (!(i === 15 && settings.event.sunday === "s15")) sale += 100;
    sale += "%";

    let sucRate = item.starPercentage();
    let desRate =
      settings.event.free && i < 17 ? 0 : (1 - sucRate) * prob[item.star][1];
    let failRate = 1 - sucRate - desRate;

    sucRate = splitNum(sucRate * 100) + "%";
    desRate = splitNum(desRate * 100) + "%";
    failRate = splitNum(failRate * 100) + "%";

    tableUpdate(modalTable, star, cost, sale, sucRate, failRate, desRate);
  }
}
