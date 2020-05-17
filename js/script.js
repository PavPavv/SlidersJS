'use strict';

/////////////////////////////////////Single Range///////////////////////////////

const singleRange = () => {
  //  DOM-elements to work with
  const range = getEl('.range');
  const slider = getEl('slider');
  const selected = getEl('selected');
  const load = getEl('.load');
  const layout = getEl('.layout');


  //  ! Lowest function abstruction level
  //  Get element's coordinates
  function getCoords(elem){
    let box = elem.getBoundingClientRect();
    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset,
      width: box.width
    }
  };


  //  Fast function to get element by Id or class name

  function getEl(el, area = document) {
    if (typeof el === 'string') {
      area = typeof area === 'string' ? getEl(area): area;
      if (el.indexOf('.') === 0 || el.indexOf('[') === 0) {
        el = area.querySelector(el);
      } else if (area === document) {
        el = area.getElementById(el);
      } else {
        el = area.querySelector(el);
      }
    }
    return el;
  }


  function down() {
    //  Remove mousemove event when mouse button is pressed up
    document.addEventListener('mouseup', stopSlider);
    //  Main event: when mouse button is pressed down and moving along
    document.addEventListener('mousemove', moveSlider);
  }


  //  stop moving slider when button is pressed up

  function stopSlider() {
    document.removeEventListener('mousemove', moveSlider);
    slider.style.cursor = 'grab';
  }

  //  !! Next level of function abstraction
  //  Function which is describing the main event: moving alider along the range

  function moveSlider(evt) {
    let rangeCoords = getCoords(range);  //  get range coordinates 'getCoords' function
    let sliderCoords = getCoords(slider);  //  get slider coordinates with 'getCoords' function
    let sliderCoordsWidth = sliderCoords.width;
    let shiftSlider = evt.pageX - sliderCoords.left;  // correct shift of the slider relatively the range
    let fullSlider = evt.pageX - rangeCoords.left - (sliderCoordsWidth - 8);

    // stay slider inside the range
    if (fullSlider < 0) {
      fullSlider = 0
    } else if (fullSlider > rangeCoords.width) {
      fullSlider = rangeCoords.width - sliderCoords.width + 5;
    }

    slider.style.cursor = 'grabbing';
    // moving slider itself
    slider.style.marginLeft = parseInt(fullSlider) + 'px';
    // show selected range
    selected.style.width = parseInt(fullSlider) + 'px';

    displayProgress();
  }


  //  Display progress

  function displayProgress() {
    let fullSlider = getCoords(slider).width;
    let fullRange = getCoords(range).width;
    let selectedRange = getCoords(selected).width;
    const difference = 16;
    let step = (fullRange - difference) / 100;
    let loadResult = parseInt(selectedRange / step);
    let brightness = loadResult / 100;

    if (loadResult > 100) {
      loadResult = 100;
    } else if (loadResult < 0) {
      loadResult = 0;
    }
    //  display percentages
    load.innerHTML = loadResult + '%';
    //  brightness level
    layout.style.background = `rgba(0,0,0,${brightness})`;
  }


  //  Start slider

  slider.addEventListener('mousedown', down);
}

singleRange();



///////////////////////////// Double Range /////////////////////////////////////

const doubleRange = () => {
  //  Needed DOM-elements to work with
  const range = document.querySelector('#range'); //  range scale
  const selectedRange = document.querySelector('#selected-range');  //  selected range
  const slider1 = document.getElementById('slider1'); //  first slider
  const slider2 = document.getElementById('slider2'); // second slider


  //  ! Lowest function abstruction level
  //  Get element's coordinates

  function getCoords(elem){
    let box = elem.getBoundingClientRect();
    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset,
      width: box.width
    }
  };


  //  Fast function to get element by Id or class name

  function getEl(el, area = document) {
    if (typeof el === 'string') {
      area = typeof area === 'string' ? getEl(area): area;
      if (el.indexOf('.') === 0 || el.indexOf('[') === 0) {
        el = area.querySelector(el);
      } else if (area === document) {
        el = area.getElementById(el);
      } else {
        el = area.querySelector(el);
      }
    }
    return el;
  }


  //  Move first slider

  slider1.addEventListener('mousedown', function(evt) {
    let rangeCoords = getCoords(range); // range scale coordinates
    let sliderCoords1 = getCoords(slider1); // fisrt slider coordinates
    let sliderCoords2 = getCoords(slider2); // second slider coordinates
    let shiftX1 = evt.pageX - sliderCoords1.left; // left shift without left slider
    let shiftX2 = evt.pageX - sliderCoords2.left; // right shift without right slider

    function slider1Moving(evt) {
      let slider1Move = evt.pageX - shiftX1 - rangeCoords.left; // first slider moving distance
      let rangeWithoutSlider1 = range.offsetWidth - slider1.offsetWidth; // scale width without fisrt slider's width

      //  hold slider inside the range
      if (slider1Move < 0) slider1Move = 0;
      if (slider1Move > rangeWithoutSlider1) slider1Move = rangeWithoutSlider1;

      //  move first slider itself
      slider1.style.marginLeft = slider1Move + 'px';

      //  check second slider coordinates
      shiftX2 = evt.pageX - sliderCoords2.left;
      let slider2Move = evt.pageX - shiftX2 - rangeCoords.left;
      let rangeWithoutSlider2 = range.offsetWidth - slider2.offsetWidth;

      //  show and control selected range from first slider
      if (slider1Move > slider2Move) {
        selectedRange.style.width = '0';
        //selectedRange.style.marginLeft = slider2Move + 'px';
        slider1.style.marginLeft = slider2Move - 20 + 'px';
      } else{
        selectedRange.style.width = (slider2Move-slider1Move) + 'px';
        selectedRange.style.marginLeft = slider1Move + 'px';
      }
    };

    document.addEventListener('mousemove', slider1Moving);

    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', slider1Moving);
    });

    return false;
  });


  // Move second slider

  slider2.addEventListener('mousedown', function(evt) {
    let rangeCoords = getCoords(range); //  range scale coordinates
    let sliderCoords1 = getCoords(slider1); //  fisrt slider coordinates
    let sliderCoords2 = getCoords(slider2); //  second slider coordinates
    let shiftX1 = evt.pageX - sliderCoords1.left; // left shift without left slider
    let shiftX2 = evt.pageX - sliderCoords2.left; //  right shift without right slider


    function slider2Moving(evt) {
      let slider2Move = evt.pageX - shiftX2 - rangeCoords.left; // second slider moving distance
      let rangeWithoutSlider2 = range.offsetWidth - slider2.offsetWidth;  //  scale width without second slider's width

      //  hold slider inside the range
      if (slider2Move < 0 ) slider2Move = 0;
      if (slider2Move > rangeWithoutSlider2) slider2Move = rangeWithoutSlider2;

      //  move second slider itself
      slider2.style.left = slider2Move + 'px';
      shiftX1 = evt.pageX - sliderCoords1.left;
      let slider1Move = evt.pageX - shiftX1 - rangeCoords.left;
      let rangeWithoutSlider1 = range.offsetWidth - slider1.offsetWidth;

      //  show and control selected range to second slider
      if (slider1Move > slider2Move) {
        selectedRange.style.width = '0';
        selectedRange.style.marginLeft = slider2Move + 'px';
        slider2.style.marginLeft = slider1Move + 20 + 'px';
      } else{
        selectedRange.style.width = (slider2Move-slider1Move) + 'px';
        selectedRange.style.marginLeft = slider1Move + 'px';
      }
    };

    document.addEventListener('mousemove', slider2Moving);

    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', slider2Moving);
    });

    return false;
  });


  slider1.addEventListener('dragstart', () => {
    return false;
  });

  slider2.addEventListener('dragstart', () => {
    return false;
  });
}


doubleRange();
