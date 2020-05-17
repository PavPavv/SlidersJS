'use strict';

/////////////////////////////////////Single Range///////////////////////////////

const singleRange = () => {
  //  DOM-elements to work with
  const range = getEl('.range');
  const slider = getEl('slider');
  const selected = getEl('selected');
  const load = getEl('.load');


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


  //  Fast function to get element by Id or class name:

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


  //  Function which is describing the main event: moving alider along the range

  function moveSlider(evt) {
    let rangeCoords = getCoords(range);  //  get range coordinates 'getCoords' function
    let sliderCoords = getCoords(slider);  //  get slider coordinates with 'getCoords' function
    let sliderCoordsWidth = sliderCoords.width;
    let shiftSlider = evt.pageX - sliderCoords.left;  // correct shift of the slider relatively the range
    let fullSlider = evt.pageX - rangeCoords.left - (sliderCoordsWidth - 8);


    if (fullSlider < 0) {  // stay slider inside the range
      fullSlider = 0
    } else if (fullSlider > rangeCoords.width) {
      fullSlider = rangeCoords.width - sliderCoords.width + 5;
    }

    slider.style.cursor = 'grabbing';
    slider.style.marginLeft = parseInt(fullSlider) + 'px';
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

    if (loadResult > 100) {
      loadResult = 100;
    } else if (loadResult < 0) {
      loadResult = 0;
    }

    load.innerHTML = loadResult + '%';
  }

  
  //  Start slider

  slider.addEventListener('mousedown', down);
}

singleRange();



///////////////////////////// Double Range /////////////////////////////////////

const doubleRange = () => {
  //  Забираем необходимые DOM-элементы для манипуляции

  const range = document.querySelector('#range'); //  шкала
  const selectedRange = document.querySelector('#selected-range');  //  пройденная шкала
  const slider1 = document.getElementById('slider1'); //  левый ползунок
  const slider2 = document.getElementById('slider2'); // правый ползунок


  //  ! Самый низкий уровень абстракции
  //  Получение координотов элемента

  function getCoords(elem){
    let box = elem.getBoundingClientRect();
    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset,
      width: box.width
    }
  };


  //  Получение элемента по id или селектору:

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


  //  Работа первого ползунка

  slider1.addEventListener('mousedown', function(evt) {
    let rangeCoords = getCoords(range); // размеры шкалы
    let sliderCoords1 = getCoords(slider1); // размер левого ползунка
    let sliderCoords2 = getCoords(slider2); // размер правого ползунка
    let shiftX1 = evt.pageX - sliderCoords1.left; // размер смещения левого ползунка без размера кнопки
    let shiftX2 = evt.pageX - sliderCoords2.left; // размер смещения правого ползунка без размера кнопки

    function slider1Moving(evt) {
      let slider1Move = evt.pageX - shiftX1 - rangeCoords.left; // расстояние перетаскивания ползунка
      let rangeWithoutSlider1 = range.offsetWidth - slider1.offsetWidth; // длина шкалы без ширины левого ползунка

      // условия, чтобы ползунок не выходил за пределы диапазона
      if (slider1Move < 0) slider1Move = 0;
      if (slider1Move > rangeWithoutSlider1) slider1Move = rangeWithoutSlider1;

      // перемещение самого ползунка
      slider1.style.marginLeft = slider1Move + 'px';

      //  отслеживание смещения правого ползунка
      shiftX2 = evt.pageX - sliderCoords2.left;
      let slider2Move = evt.pageX - shiftX2 - rangeCoords.left;
      let rangeWithoutSlider2 = range.offsetWidth - slider2.offsetWidth;

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


  // Работа правого ползунка

  slider2.addEventListener('mousedown', function(evt) {
    let rangeCoords = getCoords(range); //  размеры шкалы
    let sliderCoords1 = getCoords(slider1); //  размер левого ползунка
    let sliderCoords2 = getCoords(slider2); //  размер правого ползунка
    let shiftX1 = evt.pageX - sliderCoords1.left; // размер смещения левого ползунка без размера кнопки
    let shiftX2 = evt.pageX - sliderCoords2.left; //  размер смещения правого ползунка без размера кнопки


    function slider2Moving(evt) {
      let slider2Move = evt.pageX - shiftX2 - rangeCoords.left;//расстояние перетаскивания ползунка
      let rangeWithoutSlider2 = range.offsetWidth - slider2.offsetWidth;//длина шкалы без ширины левого ползунка

      //  условия, чтобы ползунок не выходил за пределы диапазона
      if (slider2Move < 0 ) slider2Move = 0;
      if (slider2Move > rangeWithoutSlider2) slider2Move = rangeWithoutSlider2;

      slider2.style.left = slider2Move + 'px';  //  перемещение самого ползунка

      //  отслеживание смещения правого ползунка
      shiftX1 = evt.pageX - sliderCoords1.left;
      let slider1Move = evt.pageX - shiftX1 - rangeCoords.left;
      let rangeWithoutSlider1 = range.offsetWidth - slider1.offsetWidth;

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
