function storeData() {
  localStorage.setItem("settings", JSON.stringify(settings));
}

function getData() {
  let store = localStorage.getItem("settings", JSON.stringify(settings));
  store = JSON.parse(store);
  setDefault(store);
}

function setDefault(loaded) {
  // 이벤트
  let inputs = document.querySelectorAll("input");

  inputs.forEach(function (item, index) {
    if (item.getAttribute("data-ary")) {
      if (loaded.prevDes.includes(Number(item.value))) item.checked = true;
      else item.checked = false;
    } else {
      let iClass = item.getAttribute("data-class");
      let iname = item.getAttribute("data-name");

      if (item.type === "radio") {
        let val = item.value;
        if (isFloat(val)) val = Number(val);
        if (loaded[iClass][iname] === val) item.checked = true;
      } else {
        if (item.type === "checkbox") item.checked = loaded[iClass][iname];
        else {
          item.value = loaded[iClass][iname];
        }
      }
    }
  });
}
