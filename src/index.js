import $ from 'jquery'
import './style.css'
import print from './print'

var paused = false;
var stopped = true;
var breakNext = false;
var intervalID = null;
var counter = null;

const setAnimationDuration = () => {

  $(".wedge").css("animationDuration", counter + "s");
  $(".container1").css("animationDuration", counter + "s");
  $(".container2").css("animationDuration", counter + "s");
}

const setSessionColorForAnimation = () => $(".wedge").addClass("sessionColor").removeClass("breakColor");

const setBreakColorForAnimation = () => $(".wedge").addClass("breakColor").removeClass("sessionColor");

const continueAnimation = () => {
  document.getElementById("wedge1").style.animationPlayState = "running";
  document.getElementById("wedge2").style.animationPlayState = "running";
  document.getElementById("container1").style.animationPlayState = "running";
  document.getElementById("container2").style.animationPlayState = "running";
}
const pauseAnimation = () => {

  document.getElementById("wedge1").style.animationPlayState = "paused";
  document.getElementById("wedge2").style.animationPlayState = "paused";
  document.getElementById("container1").style.animationPlayState = "paused";
  document.getElementById("container2").style.animationPlayState = "paused";
}

const convertToMinsAndSecs = (secs) => {
  const mins = Math.floor(secs / 60);
  const remSecs = secs - 60 * mins;
  return {
    "seconds": remSecs,
    "minutes": mins
  };
}

const updateClock = () => {
  counter -= 1;
  const time = convertToMinsAndSecs(counter);
  var timeString = "";
  if (counter > 0) {
    if (time.seconds < 10)
      timeString = time.minutes + ":0" + time.seconds;
    else
      timeString = time.minutes + ":" + time.seconds;
    $("#timeLabel").html(timeString);
  }
  else
    $("#timeLabel").html("00:00");
}

const convertToSecs = (secs, mins) => mins * 60 + secs;

const stopTimer = () => {
  clearInterval(intervalID);
  stopped = true;
  pauseAnimation();
  $("#timeLabel").html("00:00");
  var wav = 'https://notificationsounds.com/notification-sounds/job-done-501/download/mp3';
  var audio = new Audio(wav);
  audio.play();
}

const startSessionTimer = () => {
  setSessionColorForAnimation();
  counter = parseInt($("#sessionDuration").html()) * 60;
  startTimer();
}

const startBreakTimer = () => {
  setBreakColorForAnimation();
  counter = parseInt($("#breakDuration").html()) * 60;
  startTimer();
}

const startTimer = () => {
  intervalID = setInterval(updateClock, 1000);
  setAnimationDuration();
  continueAnimation();
  stopped = false;
  setTimeout(stopTimer, 1000 * counter);
  breakNext = !breakNext;

}

const continueTimer = () => {
  intervalID = setInterval(updateClock, 1000);
  setTimeout(stopTimer, 1000 * counter);
  paused = false;
  continueAnimation();
}

const pauseTimer = () => {
  clearInterval(intervalID);
  paused = true;
  pauseAnimation();
}

$("#pomodoro").on("click", () => {
  print()
  if (stopped)
    if (!breakNext)
      startSessionTimer();
    else
      startBreakTimer();
  else if (paused)
    continueTimer();
  else
    pauseTimer();
})

$("#incSession").on("click", () => {
  const dur = parseInt($("#sessionDuration").html());
  if (dur < 99) {
    $("#sessionDuration").html(dur + 1);
    if (stopped)
      $("#timeLabel").html(dur + ":00");
  }

})
$("#decSession").on("click", () => {
  const dur = parseInt($("#sessionDuration").html());
  if (dur > 1) {
    $("#sessionDuration").html(dur - 1);
    if (stopped)
      $("#timeLabel").html(dur + ":00");
  }
})
$("#incBreak").on("click", () => {
  const dur = parseInt($("#breakDuration").html());
  if (dur < 99)
    $("#breakDuration").html(dur + 1);
})
$("#decBreak").on("click", () => {
  const dur = parseInt($("#breakDuration").html());
  if (dur > 1)
    $("#breakDuration").html(dur - 1);
})

// if (module.hot) {
//   module.hot.accept('./print.js', function () {
//     console.log('Accepting the updated printMe module!');
//     print();
//   })
// }