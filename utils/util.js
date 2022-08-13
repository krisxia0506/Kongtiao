const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}
//此方法处于外部文件 “utils/util.js” 中进行了定义

//需要加上这段来暴露你定义的方法，否则在外部找不到
module.exports = {
  formatTime
}
