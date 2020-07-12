document.addEventListener(
  "keydown",
  function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  },
  true
);

function getSettings() {
  settings.event = document.querySelector("input[name=event]:checked").value;
  settings.event2 = document.querySelector("input[name=freeDes]:checked")
    ? true
    : false;

  settings.mvp = Number(
    document.querySelector("input[name=mvp]:checked").value
  );
  settings.pcroom = document.querySelector("input[name=pcroom]:checked")
    ? true
    : false;

  settings.preventDestroy = [];
  if (document.querySelector("input[name=des12]:checked"))
    settings.preventDestroy.push(12);
  if (document.querySelector("input[name=des13]:checked"))
    settings.preventDestroy.push(13);
  if (document.querySelector("input[name=des14]:checked"))
    settings.preventDestroy.push(14);
  if (document.querySelector("input[name=des15]:checked"))
    settings.preventDestroy.push(15);
  if (document.querySelector("input[name=des16]:checked"))
    settings.preventDestroy.push(16);

  settings.starcatch.cal = document.querySelector(
    "input[name=starcatch_cal]:checked"
  ).value;
  settings.starcatch.percent = Number(
    document.querySelector("input[name=starcatch_percent]").value
  );
  settings.starcatch.when = Number(
    document.querySelector("input[name=starcatch_star]").value
  );

  settings.item.lv = Number(
    document.querySelector("input[name=equiplv]").value
  );
  settings.item.star = Number(
    document.querySelector("input[name=equipstar]").value
  );

  settings.test.trys = Number(
    document.querySelector("input[name=goal_try]").value
  );
  settings.test.goal = Number(
    document.querySelector("input[name=goal_star]").value
  );
  settings.test.budget = Number(
    document.querySelector("input[name=goal_budget]").value
  );
  settings.test.recover_cost = Number(
    document.querySelector("input[name=goal_recover_cost]").value
  );
  settings.test.recover_try = Number(
    document.querySelector("input[name=goal_recover_try]").value
  );
  settings.test.sf_time = Number(
    document.querySelector("input[name=goal_sf_try]").value
  );
  settings.test.nsf_time = Number(
    document.querySelector("input[name=goal_nsf_try]").value
  );

  settings.logs.each = document.querySelector("input[name=log_each]:checked")
    ? true
    : false;
  settings.logs.each_result = document.querySelector(
    "input[name=log_each_result]:checked"
  )
    ? true
    : false;
  settings.logs.times = document.querySelector("input[name=log_times]:checked")
    ? true
    : false;
  settings.logs.rate = document.querySelector("input[name=log_rate]:checked")
    ? true
    : false;
  settings.logs.plot = document.querySelector("input[name=log_plot]:checked")
    ? true
    : false;
  settings.logs.destroy = document.querySelector(
    "input[name=log_destroy]:checked"
  )
    ? true
    : false;
  settings.logs.number = document.querySelector(
    "input[name=log_number]:checked"
  )
    ? true
    : false;
  settings.logs.running_time = document.querySelector(
    "input[name=log_running_time]:checked"
  )
    ? true
    : false;
}

function showSummary() {
  summary.innerHTML = "";

  //이벤트
  let event = document.createElement("li");
  event.innerText = "이벤트 : ";
  switch (settings.event) {
    case "s15":
      event.innerText += "5, 10, 15성 100% 성공";
      break;
    case "sale30":
      event.innerText += "30% 할인";
      break;
    case "oneplus":
      event.innerText += "10성 이하 1+1";
      break;
    case "none":
      event.innerText += "없음";
      break;
  }
  if (settings.event2) {
    event.innerText += ", 무료 파괴방지";
  }
  summary.appendChild(event);

  let addSale = document.createElement("li");
  addSale.innerText = "추가 할인율 : ";
  addSale.innerText += settings.pcroom ? settings.mvp + 5 : settings.mvp;
  addSale.innerText += "%";
  summary.appendChild(addSale);

  let pDes = document.createElement("li");
  pDes.innerText = "파괴방지 설정 : ";
  if (!settings.preventDestroy.length) pDes.innerText += "없음";
  else if (settings.preventDestroy.length == 5) pDes.innerText += "풀파방";
  else {
    let str = "";
    for (var i in settings.preventDestroy) {
      str += settings.preventDestroy[i];
      str += "성 ";
    }
    pDes.innerText += str;
  }
  summary.appendChild(pDes);

  let sCatch = document.createElement("li");
  sCatch.innerText = "스타캐치 설정 : ";
  if (settings.starcatch.when === 25 || settings.starcatch.percent === 0) {
    sCatch.innerText += "안함";
  } else {
    sCatch.innerText += settings.starcatch.cal === "mul" ? "x " : "+ ";
    sCatch.innerText += settings.starcatch.percent;
    sCatch.innerText += "%, ";
    sCatch.innerText += settings.starcatch.when;
    sCatch.innerText += "성 이상에서 시도";
  }
  summary.appendChild(sCatch);

  let equip = document.createElement("li");
  equip.innerText = `아이템 : ${settings.item.lv}제, ${settings.item.star}성`;
  summary.appendChild(equip);

  let tSet = document.createElement("li");
  tSet.innerText = `테스트 설정 : ${settings.test.trys}회, ${settings.test.goal}성, `;
  if (settings.test.budget === 0) {
    tSet.innerText += "예산 무제한";
  } else {
    tSet.innerText += `예산 ${settings.test.budget}억`;
  }
  summary.appendChild(tSet);

  let recov = document.createElement("li");
  recov.innerText = `복구 옵션 : 비용 - 회당 ${settings.test.recover_cost}억, 최대복구횟수 - `;
  if (settings.test.recover_try === -1) recov.innerText += "무제한";
  else recov.innerText += `${settings.test.recover_try}회`;
  summary.appendChild(recov);
}

inputs.forEach(function (item, idx) {
  item.addEventListener("input", function () {
    getSettings();
    showSummary();
  });
});

function disableEdit() {
  inputs.forEach(function (item, idx) {
    item.readOnly = true;
    item.disabled = true;
  });
  btn_submit.disabled = true;
}
function enableEdit() {
  inputs.forEach(function (item, idx) {
    item.readOnly = false;
    item.disabled = false;
  });
  btn_submit.disabled = false;
}

btn_submit.addEventListener("click", function (e) {
  disableEdit();
  starforce();
});

window.onload = function () {
  getSettings();
  showSummary();
};

btn_logClear.addEventListener("click", function (e) {
  result.innerHTML = "";
});
