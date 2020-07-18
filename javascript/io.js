//submit 방지
document.addEventListener(
  "keydown",
  function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  },
  true
);

// string이 number인지 확인
function isFloat(val) {
  var floatRegex = /^-?\d+(?:[.,]\d*?)?$/;
  if (!floatRegex.test(val)) return false;

  val = parseFloat(val);
  if (isNaN(val)) return false;
  return true;
}

function getSettings() {
  settings.prevDes.length = 0;
  let inputs = document.querySelectorAll("input");
  inputs.forEach(function (item, index) {
    if (item.getAttribute("data-ary")) {
      if (item.checked) settings.prevDes.push(Number(item.value));
    } else {
      let iClass = item.getAttribute("data-class");
      let iname = item.getAttribute("data-name");

      if (item.type === "radio") {
        if (item.checked) {
          let val = item.value;
          if (isFloat(val)) val = Number(val);
          settings[iClass][iname] = val;
        }
      } else {
        let val = item.value;
        if (isFloat(val)) val = Number(val);
        if (item.type === "checkbox") val = item.checked;
        settings[iClass][iname] = val;
      }
    }
  });
}

function summaryUpdate(text) {
  let li = document.createElement("li");
  li.innerText = text;
  summary.appendChild(li);
}

function showSummary() {
  summary.innerHTML = "";

  //이벤트
  let event = "이벤트 : ";
  switch (settings.event.sunday) {
    case "s15":
      event += "5, 10, 15성 100% 성공";
      break;
    case "sale30":
      event += "30% 할인";
      break;
    case "oneplus":
      event += "10성 이하 1+1";
      break;
    case "none":
      event += "없음";
      break;
  }
  if (settings.event.prevDes) {
    event += ", 무료 파괴방지";
  }
  summaryUpdate(event);

  //할인
  let addSale = "추가 할인율 : ";
  addSale += settings.a_sale.pcroom
    ? settings.a_sale.mvp + 5
    : settings.a_sale.mvp;
  addSale += "%";
  summaryUpdate(addSale);

  //파괴방지
  let pDes = "파괴방지 설정 : ";
  if (!settings.prevDes.length) pDes += "없음";
  else if (settings.prevDes.length == 5) pDes += "풀파방";
  else {
    let str = "";
    for (var i in settings.prevDes) {
      str += settings.prevDes[i];
      str += "성 ";
    }
    pDes += str;
  }
  summaryUpdate(pDes);

  //스타캐치
  let sCatch = "스타캐치 설정 : ";
  if (settings.starcatch.condition === 25 || settings.starcatch.rate === 0) {
    sCatch += "안함";
  } else {
    sCatch += settings.starcatch.cal === "mul" ? " x" : " +";
    sCatch += settings.starcatch.rate;
    sCatch += "%, ";
    sCatch += settings.starcatch.condition;
    sCatch += "성 이상에서 시도";
  }
  summaryUpdate(sCatch);

  //아이템
  let equip = `아이템 : ${settings.item.level}제, ${settings.item.star}성`;
  summaryUpdate(equip);

  let tSet = `테스트 설정 : ${settings.test.try}회, 목표 ${settings.test.goal}성, `;
  if (settings.test.budget === 0) {
    tSet += "예산 무제한";
  } else {
    tSet += `예산 ${settings.test.budget}억`;
  }
  summaryUpdate(tSet);

  // 복구 설정
  let recov = `복구 옵션 : 비용 - 회당 ${settings.test.recover_cost}억, 최대복구횟수 - `;
  if (settings.test.recover_spare === -1) recov += "무제한";
  else recov += `${settings.test.recover_spare}회`;
  summaryUpdate(recov);
  showLog();
}

function disableEdit() {
  let inputs = document.querySelectorAll("input");
  inputs.forEach(function (item, idx) {
    item.readOnly = true;
    item.disabled = true;
  });
  btn_submit.disabled = true;
}
function enableEdit() {
  let inputs = document.querySelectorAll("input");
  inputs.forEach(function (item, idx) {
    item.readOnly = false;
    item.disabled = false;
  });
  btn_submit.disabled = false;
}

btn_submit.addEventListener("click", function (e) {
  disableEdit();
  storeData();
  starforce();
});

window.onload = function () {
  getSettings();
  showSummary();
  getData();
};

btn_logClear.addEventListener("click", function (e) {
  every_log.innerHTML = "";
  result_log.innerHTML = "";
  result_ul.innerHTML = "";
});

function showLog() {
  let every = document.querySelectorAll("#result_log table")[0];
  let res = document.querySelectorAll("#result_log table")[1];

  if (!settings.log.each_all) {
    every.classList.add("hidden");
  } else {
    every.classList.remove("hidden");
  }
  if (!settings.log.each_result) {
    res.classList.add("hidden");
  } else {
    res.classList.remove("hidden");
  }

  if (!settings.log.time) {
    every.classList.add("notimecal");
    res.classList.add("notimecal");
  } else {
    every.classList.remove("notimecal");
    res.classList.remove("notimecal");
  }
}
