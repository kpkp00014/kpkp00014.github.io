function starforce() {
  resultInput("시뮬레이션을 시작합니다");
}

function resultInput(str) {
  let li = document.createElement("li");
  li.innerText = str;
  result.appendChild(li);
}
