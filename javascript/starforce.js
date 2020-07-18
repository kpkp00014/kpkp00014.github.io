function starforce() {
  let t1 = new Date();
  ulUpdate(`${t1} 테스트를 실시합니다`);
  resultArr.length = 0;
  // 테스트 횟수만큼 반복 실행
  for (var i = 1; i <= settings.test.try; i++) {
    var item = new Starforce(settings.item.level, settings.item.star);
    while (true) {
      // 예산이 무한한 경우
      if (settings.test.budget === 0) {
        item.starforce(i);
        // 목표 달성 시
        if (item.star >= settings.test.goal) {
          item.goal = true;
          resultArr.push(item); // 결과 배열에 데이터 저장
          testResult(i, item);
          break;
        } else if (
          settings.test.recover_spare !== -1 &&
          item.destroyCount > settings.test.recover_spare
        ) {
          // 스페어 부족으로 실패 할 경우
          item.failCause = "스페어 부족";
          resultArr.push(item);
          break;
        }
      } else {
        if (item.cost + item.starCost() >= settings.test.budget * 100000000) {
          // 더 강화하면 예산이 초과 될 경우
          item.failCause = "예산 초과";
          resultArr.push(item);
          testResult(i, item);
          break;
        } else if (
          settings.test.recover_spare !== -1 &&
          item.destroyCount > settings.test.recover_spare
        ) {
          // 스페어가 부족한 경우
          item.failCause = "스페어 부족";
          resultArr.push(item);
          testResult(i, item);
          break;
        } else if (item.star >= settings.test.goal) {
          // 목표 달성한 경우
          item.goal = true;
          resultArr.push(item); // 결과 배열에 데이터 저장
          testResult(i, item);
          break;
        } else {
          // 위 조건에 다 해당하지 않는 경우 스타포스를 시도한다
          item.starforce(i);
        }
      }
    }
  }

  fianlResult();
  enableEdit();
  let t2 = new Date();
  ulUpdate(`${t2} 테스트가 종료되었습니다`);
  ulUpdate(`${(t2 - t1) / 1000}초 소요되었습니다`);
}

function testResult(i, item) {
  if (settings.log.each_result) {
    tableUpdate(
      result_log,
      i,
      item.goal ? "성공" : "실패",
      splitNum(item.cost),
      item.destroyCount,
      item.successCount,
      item.failCount,
      secToDay(item.runningTime)
    );
  }
}

function secToDay(seconds) {
  seconds = Math.floor(seconds);
  var day = parseInt(seconds / (3600 * 24));
  var hour = parseInt((seconds % (3600 * 24)) / 3600);
  var min = parseInt((seconds % 3600) / 60);
  var sec = parseInt(seconds % 60);

  let result = "";
  if (day > 0) result += `${day}일 `;
  if (hour > 0) result += `${hour}시간 `;
  if (min > 0) result += `${min}분 `;
  if (sec > 0) result += `${sec}초`;

  return result;
}

function fianlResult() {
  const length = resultArr.length;
  ulUpdate("----- 최종 강화 결과 -----");
  let results = {
    success: {
      num: 0,
      success: 0,
      fail: 0,
      destroy: [],
      cost: [],
      time: [],
    },
    fail: {
      num: 0,
      success: 0,
      fail: 0,
      destroy: 0,
      cost: 0,
      destroy: [],
      cost: [],
    },
    failCause: {
      money: 0,
      spare: 0,
    },
  };
  for (var i = 0; i < length; i++) {
    if (resultArr[i].goal) {
      results.success.num++;
      results.success.success += resultArr[i].successCount;
      results.success.fail += resultArr[i].failCount;
      results.success.destroy.push(resultArr[i].destroyCount);
      results.success.cost.push(resultArr[i].cost);

      if (settings.log.time) {
        results.success.time.push(resultArr[i].runningTime);
      }
    } else {
      results.fail.num++;
      results.fail.success += resultArr[i].successCount;
      results.fail.fail += resultArr[i].failCount;
      results.fail.destroy.push(resultArr[i].destroyCount);
      results.fail.cost.push(resultArr[i].cost);

      if (resultArr[i].failCause === "스페어 부족") results.failCause.spare++;
      else if (resultArr[i].failCause === "예산 초과")
        results.failCause.money++;
    }
  }
  if (settings.log.rate) {
    // 목표 달성
    let result = (results.success.num / resultArr.length) * 100;
    result = Math.round(result * 100) / 100;
    ulUpdate(
      `목표 달성 : ${results.success.num}/${resultArr.length} [${result}%]`
    );
  }
  if (settings.log.average) {
    // 성공 케이스
    ulUpdate(` ------ 성공 통계 ------`);
    ulUpdate(` 전체 수 : ${splitNum(results.success.num)} `);
    if (results.success.num) {
      ulUpdate(
        ` 평균 성공 횟수 : ${splitNum(
          results.success.success / results.success.num
        )}회 `
      );
      ulUpdate(
        ` 평균 실패 횟수 : ${splitNum(
          results.success.fail / results.success.num
        )}회`
      );

      ulUpdate(
        ` 평균 파괴 횟수 : ${splitNum(
          calArr(results.success.destroy, "avg")
        )}회`
      );
      ulUpdate(
        ` 평균 누적 비용 : ${splitNum(
          calArr(results.success.cost, "avg")
        )} 메소`
      );
      ulUpdate(
        ` 강화 비용 최솟값 : ${splitNum(
          calArr(results.success.cost, "min")
        )} 메소`
      );
      ulUpdate(
        ` 강화 비용 최댓값 : ${splitNum(
          calArr(results.success.cost, "max")
        )} 메소`
      );
      ulUpdate(
        ` 강화 비용 중간값 : ${splitNum(
          calArr(results.success.cost, "mid")
        )} 메소`
      );
      ulUpdate(
        ` 파괴 횟수 최솟값 : ${splitNum(
          calArr(results.success.destroy, "min")
        )}회`
      );
      ulUpdate(
        ` 파괴 횟수 최댓값 : ${splitNum(
          calArr(results.success.destroy, "max")
        )}회`
      );
      ulUpdate(
        ` 파괴 횟수 중간값 : ${splitNum(
          calArr(results.success.destroy, "mid")
        )}회`
      );

      if (settings.log.time) {
        ulUpdate(
          ` 강화시간 평균 : ${secToDay(calArr(results.success.time, "avg"))}`
        );
        ulUpdate(
          ` 강화시간 최솟값 : ${secToDay(calArr(results.success.time, "min"))}`
        );
        ulUpdate(
          ` 강화시간 최댓값 : ${secToDay(calArr(results.success.time, "max"))}`
        );
        ulUpdate(
          ` 강화시간 중간값 : ${secToDay(calArr(results.success.time, "mid"))}`
        );
      }
    }

    // 실패 케이스
    ulUpdate(` ------ 실패 통계 ------`);
    ulUpdate(` 전체 수 : ${splitNum(results.fail.num)} `);
    if (results.fail.num) {
      ulUpdate(
        ` 평균 성공 횟수 : ${splitNum(
          results.fail.success / results.fail.num
        )}회`
      );
      ulUpdate(
        ` 평균 실패 횟수 : ${splitNum(results.fail.fail / results.fail.num)}회`
      );
      ulUpdate(
        ` 평균 파괴 횟수 : ${splitNum(calArr(results.fail.destroy, "avg"))}회`
      );
      ulUpdate(
        ` 평균 누적 비용 : ${splitNum(calArr(results.fail.cost, "avg"))}메소`
      );

      ulUpdate(
        ` 강화 비용 최솟값 : ${splitNum(calArr(results.fail.cost, "min"))} 메소`
      );
      ulUpdate(
        ` 강화 비용 최댓값 : ${splitNum(calArr(results.fail.cost, "max"))} 메소`
      );
      ulUpdate(
        ` 강화 비용 중간값 : ${splitNum(calArr(results.fail.cost, "mid"))} 메소`
      );
      ulUpdate(
        ` 파괴 횟수 최솟값 : ${splitNum(calArr(results.fail.destroy, "min"))}회`
      );
      ulUpdate(
        ` 파괴 횟수 최댓값 : ${splitNum(calArr(results.fail.destroy, "max"))}회`
      );
      ulUpdate(
        ` 파괴 횟수 중간값 : ${splitNum(calArr(results.fail.destroy, "mid"))}회`
      );

      ulUpdate(` ------ 실패 분석 ------`);
      let cresult = (results.failCause.money / results.fail.num) * 100;
      cresult = Math.round(cresult * 100) / 100;
      ulUpdate(`강화비용 부족 : ${results.failCause.money}건 [${cresult}]%`);

      let sresult = (results.failCause.spare / results.fail.num) * 100;
      sresult = Math.round(sresult * 100) / 100;
      ulUpdate(`스페어 부족 : ${results.failCause.spare}건 [${sresult}]%`);
    }
  }
}
