"use strict"
//constants
const LIGHT_GREEN = '#c0e200';
const DARK_GREEN = '#5d6d00';
// navigation buttons
let prevButton = document.querySelector('.prev');
let nextButton = document.querySelector('.next');
let pictureSelector = document.querySelector('.navigators');

// main slideshow
let mainPicture = document.querySelector('.slideshow-image');
let caption = document.querySelector('.caption');
let photoIndex = document.querySelector('.photo-num');

//for image sources
let pictures = ['./media/1img_nature_wide.jpg',
    './media/2img_snow_wide.jpg',
    './media/3img_mountains_wide.jpg',
    './media/4img_lights_wide.jpg'];

let positions = ['First', 'Second', 'Third', 'Fourth'];
function ShowPicture(n) {
    //Shows slide at nth position
    mainPicture.src = pictures[n];

    //change photo Index
    photoIndex.innerHTML = n + 1;

    //change caption
    caption.innerHTML = positions[n] + " picture";

    //change backgroundColor
    pictureSelector.children[currentSlide].style.backgroundColor = LIGHT_GREEN;
    pictureSelector.children[n].style.backgroundColor = DARK_GREEN;
}

function PlusSlide(n) {
    // Increase or decrease slide number
    if (n == 1) {
        if (currentSlide != 3) {
            ShowPicture(currentSlide + n);
            currentSlide += n;
        }
        else {
            ShowPicture(0);
            currentSlide = 0;
        }
    }
    if (n == -1) {
        if (currentSlide != 0) {
            ShowPicture(currentSlide + n);
            currentSlide += n;
        }
        else {
            ShowPicture(3);
            currentSlide = 3;
        }
    }
}
prevButton.onclick = () => { PlusSlide(-1) };
nextButton.onclick = () => { PlusSlide(+1) };

for (let i = 0; i < pictureSelector.children.length; ++i) {
    pictureSelector.children[i].onclick = () => {
        ShowPicture(i);
        currentSlide = i;
    };
}

let currentSlide = 0;
ShowPicture(0);
