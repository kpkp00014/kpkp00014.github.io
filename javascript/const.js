const settings = {
  prevDes: [],
  log: {},
  starcatch: {},
  item: {},
  test: {},
  event: {},
  a_sale: {},
};

const summary = document.querySelector("#summary .content ul");
const btn_submit = document.querySelector("#btn_submit");
const btn_logClear = document.querySelector("#btn_clear");
const resultArr = [];
const every_log = document
  .querySelectorAll("#result_log table")[0]
  .querySelector("tbody");
const result_log = document
  .querySelectorAll("#result_log table")[1]
  .querySelector("tbody");
const result_ul = document.querySelector("#result_ul ul");

const prob = [
  // prob[n][0] - n성에서 스타포스 시도 시, 성공 확률
  // prob[n][1] - n성에서 스타포스 실패 시, 파괴 확률

  [0.95, 0], //0성
  [0.9, 0], //1성
  [0.85, 0], //2성
  [0.85, 0], //3성
  [0.8, 0], //4성
  [0.75, 0], //5성
  [0.7, 0], //6성
  [0.65, 0], //7성
  [0.6, 0], //8성
  [0.55, 0], //9성
  [0.5, 0], //10성
  [0.45, 0], //11성
  [0.4, 0.01], //12성
  [0.35, 0.02], //13성
  [0.3, 0.02], //14성
  [0.3, 0.03], //15성
  [0.3, 0.03], //16성
  [0.3, 0.03], //17성
  [0.3, 0.04], //18성
  [0.3, 0.05], //19성
  [0.3, 0.1], //20성
  [0.3, 0.1], //21성
  [0.03, 0.2], //22성
  [0.02, 0.3], //23성
  [0.01, 0.4], //24성
];

class Starforce {
  constructor(level, star) {
    this.level = level;
    this.star = star;
  }

  level = 150;
  star = 0;
  chance = 0; // 찬스타임 스택, 2가 될 경우 100% 성공
  destroyCount = 0; // 파괴 횟수
  successCount = 0; // 성공 횟수
  failCount = 0; // 실패 횟수
  cost = 0; // 누적 비용
  goal = false; // 목표 달성 여부
  statusDestroy = false; // 현재 파괴상태인가
  failCause = "";
  runningTime = 0;

  // 스타포스 비용 계산
  starCost() {
    let discountRate = this.getInfo("saleRate");
    var cost;

    if (this.star < 10) {
      cost = 1000 + (Math.pow(this.level, 3) * (this.star + 1)) / 25;
    } else if (this.star < 15) {
      cost =
        1000 + (Math.pow(this.level, 3) * Math.pow(this.star + 1, 2.7)) / 400;
    } else {
      cost =
        1000 + (Math.pow(this.level, 3) * Math.pow(this.star + 1, 2.7)) / 200;
    }

    if (this.statusDestroy) {
      // 복구 비용 추가
      cost += settings.test.recover_cost * 100000000;
    }
    return Math.floor(cost * 0.1 * discountRate) * 10;
  }
  checkStarcatch() {
    if (this.star >= settings.starcatch.condition) return true;
    else return false;
  }
  // 스타포스 확률 계산
  starPercentage() {
    if (settings.event.sunday === "s15" && [5, 10, 15].includes(this.star)) {
      return 1;
    }
    if (this.chance == 2) {
      return 1;
    }
    var percent = prob[this.star][0];
    if (this.checkStarcatch()) {
      if (settings.starcatch.cal === "mul") {
        return percent * (1 + 0.01 * settings.starcatch.rate);
      } else {
        return percent + 0.01 * settings.starcatch.rate;
      }
    } else return percent;
  }

  getInfo(att) {
    if (att === "successRate") return this.starPercentage();
    else if (att == "destroyRate") {
      // 파괴방지 여부
      if (
        settings.prevDes.includes(this.star) ||
        (this.star < 15 && settings.event.free)
      ) {
        return 0;
      } else {
        return prob[this.star][1];
      }
    } else if (att === "saleRate") {
      var aDiscount =
        this.star < 17
          ? 1 -
            (settings.a_sale.pcroom
              ? settings.a_sale.mvp + 5
              : settings.a_sale.mvp) *
              0.01
          : 1;
      var event = settings.event.sunday === "sale30" ? 0.7 : 1;
      var pDestroy;
      if (this.star < 15 && settings.event.free) {
        pDestroy = 0;
      } else {
        pDestroy = settings.prevDes.includes(this.star) ? 1 : 0;
      }
      var discountRate = aDiscount * event;
      if (!(this.star === 15 && settings.event.sunday === "s15"))
        discountRate += pDestroy;

      return discountRate;
    }
  }

  // 해당 확률이 성공할지 테스트
  starTest(percent) {
    if (Math.random() < percent) return true;
    else return false;
  }

  // 스타포스 1회 동작
  starforce(i) {
    // 스타포스 비용을 더한다
    let before = this.star;
    this.cost += this.starCost();
    this.runningTime += this.checkStarcatch()
      ? settings.test.time_sc
      : settings.test.time_nsc;
    if (this.statusDestroy) this.statusDestroy = false; // 복구함

    // 스타포스 시도
    if (this.starTest(this.starPercentage())) {
      // 스타포스 성공 시
      // 1+1 이벤트 체크
      if (settings.event.sunday === "oneplus" && this.star <= 10) this.star++;
      this.star++;

      this.chance = 0;
      this.successCount++;
      if (settings.log.each_all)
        tableUpdate(
          every_log,
          i,
          this.successCount + this.failCount,
          before,
          this.star,
          "성공",
          splitNum(this.cost),
          this.destroyCount
        );
    } else {
      // 스타포스 실패 시
      this.failCount++;

      // 파괴 체크
      if (this.starTest(this.getInfo("destroyRate"))) {
        // 파괴!
        this.destroyCount++;
        this.statusDestroy = true;
        this.star = 12;
        this.chance = 0;

        if (settings.log.each_all) {
          tableUpdate(
            every_log,
            i,
            this.successCount + this.failCount,
            before,
            this.star,
            "파괴",
            splitNum(this.cost),
            this.destroyCount
          );
        }
      } else {
        // 파괴 실패!
        if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20].includes(this.star)) {
          this.chance = 0;
        } else {
          this.chance++;
          this.star--;
        }
        if (settings.log.each_all) {
          tableUpdate(
            every_log,
            i,
            this.successCount + this.failCount,
            before,
            this.star,
            "실패",
            splitNum(this.cost),
            this.destroyCount
          );
        }
      }
    }
  }
}

function splitNum(num) {
  num = Math.round(num * 100) / 100;

  //숫자 만단위 표시
  if (settings.log.number) {
    var size = 0; // 숫자의 크기

    if (num > Math.pow(10, 16)) {
      return Math.round(num / Math.pow(10, 14)) / 100 + "경";
    } else if (num > Math.pow(10, 12)) {
      return Math.round(num / Math.pow(10, 10)) / 100 + "조";
    } else if (num > Math.pow(10, 8)) {
      return Math.round(num / Math.pow(10, 6)) / 100 + "억";
    } else if (num > Math.pow(10, 4)) {
      return Math.round(num / Math.pow(10, 2)) / 100 + "만";
    } else {
      return num;
    }
  } else {
    // 문자 , 로 나누기
    num += "";
    x = num.split(".");
    x1 = x[0];
    x2 = x.length > 1 ? "." + x[1] : "";
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, "$1" + "," + "$2");
    }
    return x1 + x2;
  }
}

function tableUpdate(tbody) {
  let tr = document.createElement("tr");
  for (var i = 1; i < arguments.length; i++) {
    let td = document.createElement("td");
    td.textContent = arguments[i];
    tr.appendChild(td);
  }
  tbody.appendChild(tr);
}

function ulUpdate(text) {
  let txt = document.createElement("li");
  txt.textContent = text;
  result_ul.appendChild(txt);
}

function calArr(arr, cal) {
  if (arr.length > 0) {
    if (cal === "avg") {
      return arr.reduce((sum, current) => sum + current, 0) / arr.length;
    } else {
      let sortArr = arr.sort(function (a, b) {
        return a - b;
      });
      if (cal === "min") {
        return sortArr[0];
      } else if (cal === "max") {
        return sortArr[sortArr.length - 1];
      } else if (cal === "mid") {
        let center = Math.ceil(sortArr.length / 2);
        return sortArr[center - 1];
      }
    }
  } else return NaN;
}
