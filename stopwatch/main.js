let playPause = document.querySelector('.play-pause');
let stopBtn = document.querySelector('.stop-btn');
let timePara = document.querySelector('.display-section');

let circular = document.querySelector('.circular');
let ctx1 = playPause.getContext('2d');
ctx1.imageSmoothingEnabled = true;
ctx1.imageSmoothingQuality = "high";
//playPause button----------------------
playPause.width = 50;
playPause.height = 50;
playPause.state = 'paused';
/*
Set the current state to 'paused'
option can be: 'paused', 'playing'
*/
function drawButton1Play(){
    ctx1.fillStyle = 'palegoldenrod';
    ctx1.fillRect(0,0,50,50);
    ctx1.beginPath();
    ctx1.moveTo(15,10);
    ctx1.lineTo(40,25);
    ctx1.lineTo(15,40);
    ctx1.fillStyle = '#69a920';
    ctx1.fill();
    ctx1.closePath();
}
// drawButton1Pause();
function drawButton1Pause(){
    let ctx1 = playPause.getContext('2d');
    ctx1.fillStyle = 'palegoldenrod';
    ctx1.fillRect(0,0,50,50);
    ctx1.beginPath();
    ctx1.moveTo(14,10);
    ctx1.lineTo(14,40);
    ctx1.lineTo(22,40);
    ctx1.lineTo(22,10);
    ctx1.fillStyle = '#7fcd28';
    ctx1.fill();
    ctx1.closePath();
    
    ctx1.beginPath();
    ctx1.moveTo(28,10);
    ctx1.lineTo(28,40);
    ctx1.lineTo(36,40);
    ctx1.lineTo(36,10);
    ctx1.fill();
    ctx1.closePath();
}

//stop button-------------------------
stopBtn.width = 50;
stopBtn.height = 50;
function drawButton2(){
    let ctx2 = stopBtn.getContext('2d');
    ctx2.fillStyle = 'palegoldenrod';
    ctx2.fillRect(0,0,50,50);
    ctx2.beginPath();
    ctx2.moveTo(15,15);
    ctx2.lineTo(35,15);
    ctx2.lineTo(35,35);
    ctx2.lineTo(15,35);
    ctx2.fillStyle = 'rgb(226,148,0)';
    ctx2.fill();
}

//stopwatch mechanism
circular.width = 200;
circular.height = 200;
let circularCtx;

let msecondCount = 0;
let displaymSec;
let displaySec;
let displayMin;
let displayHour;
let runner;
let isPlaying = false;


function displayTime(){
    let mSecTemporary = msecondCount;
    displayHour = Math.floor(mSecTemporary/(360000));
    mSecTemporary -= displayHour * 360000;
    displayMin = Math.floor(mSecTemporary/6000);
    mSecTemporary -= displayMin * 6000;
    displaySec = Math.floor(mSecTemporary/100);
    mSecTemporary -= displaySec * 100;
    displaymSec = mSecTemporary;
    
    if (displayHour < 10) displayHour = '0' + displayHour;
    if (displayMin < 10) displayMin = '0' + displayMin;
    if (displaySec < 10) displaySec = '0' + displaySec;
    if (displaymSec < 10) displaymSec = '0' + displaymSec;

    timePara.textContent = displayHour + ':' + displayMin + ':' + displaySec + ':' + displaymSec;
    msecondCount++;
}

//for circular motion
let endX;
let endY;
//Coordinates of endpoint of hand of clock
function drawTime(){
    circularCtx = circular.getContext('2d');
    circularCtx.fillStyle = 'palegoldenrod';
    circularCtx.fillRect(0,0,200,200);
    circularCtx.beginPath();
    circularCtx.arc(100,100,80,0,Math.PI*2,true);
    circularCtx.lineWidth = 5;
    circularCtx.strokeStyle = '#b39400';
    circularCtx.stroke();
    circularCtx.closePath();

    endX = 100 + 65*(Math.sin((msecondCount/100) * Math.PI / 30));
    endY = 100 - 65*Math.cos((msecondCount/100) * Math.PI / 30);
    
    circularCtx.beginPath();
    circularCtx.moveTo(100,100);
    circularCtx.lineTo(endX, endY);
    circularCtx.lineWidth = 3;
    circularCtx.stroke();
    circularCtx.closePath();
    requestAnimationFrame(drawTime);
}

playPause.addEventListener('click', () => {
    if (isPlaying === false){
        runner = setInterval(displayTime, 10);
        drawButton1Pause();
        isPlaying = true;
    }
    else if (isPlaying === true){
        clearInterval(runner);
        drawButton1Play();
        isPlaying = false;
    }
});

stopBtn.addEventListener('click', () => {
    clearInterval(runner);
    msecondCount = 0;
    isPlaying = false;
    drawButton1Play();
    displayTime();
});

drawTime();
drawButton1Play();
drawButton2();
displayTime();