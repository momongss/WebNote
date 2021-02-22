function getCurTime() {
  return new Date().toJSON();
}

function getTimeDiff(storedJSONDate) {
  const time = new Date(storedJSONDate);

  const curTime = new Date();
  if (curTime.getFullYear() !== time.getFullYear()) {
    return (curTime.getFullYear() - time.getFullYear()).toString() + "년 전";
  } else if (curTime.getMonth() !== time.getMonth()) {
    return (curTime.getMonth() - time.getMonth()).toString() + "달 전";
  } else if (curTime.getDate() !== time.getDate()) {
    return (curTime.getDate() - time.getDate()).toString() + "일 전";
  } else if (curTime.getHours() !== time.getHours()) {
    return (curTime.getHours() - time.getHours()).toString() + "시간 전";
  } else if (curTime.getMinutes() !== time.getMinutes()) {
    return (curTime.getMinutes() - time.getMinutes()).toString() + "분 전";
  } else {
    return "몇 초 전";
  }
}

export { getCurTime, getTimeDiff };
