'use strict';

/////////////////////////////////////Single Range///////////////////////////////

const singleRange = () => {
  //  DOM-элементы для работы с ними
  let slider = getEl('slider');
  let range = getEl('.range');
  let selected = getEl('selected');

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


  function down() {
    document.addEventListener('mouseup', stopSlider);  //  при отпускании клавиши убираем прослушку событий (полузунок больше не реагирует на перемещение мыши)
    document.addEventListener('mousemove', moveSlider);  //  Основное соблытие : перемещение при нажатии на левую кнопку мыши и перемещение
  }


  //  При отпускании клавиши убираем прослушку событий (полузунок больше не реагирует на перемещение мыши

  function stopSlider() {
    document.removeEventListener('mousemove', moveSlider);
    slider.style.cursor = 'grab';
  }


  //  Основное событие : перемещение при нажатии на левую кнопку мыши и перемещение

  function moveSlider(evt) {
    let rangeCoords = getCoords(range);  //  запрашиваем координаты слайдера через функцию getCoods
    let sliderCoords = getCoords(slider);  //  запрашиваем координаты ползунка через функцию getCoods
    let sliderCoordsWidth = sliderCoords.width;
    let shiftSlider = evt.pageX - sliderCoords.left;  // корректируем расстояние смещения ползунка без учета его ширины
    let fullSlider = evt.pageX - rangeCoords.left - (sliderCoordsWidth - 8);


    if (fullSlider < 0) {  //условия, чтобы ползунок не выходил за пределы диапазона
      fullSlider = 0
    } else if (fullSlider > rangeCoords.width) {
      fullSlider = rangeCoords.width - sliderCoords.width + 5;
    }

    slider.style.cursor = 'grabbing';
    slider.style.marginLeft = parseInt(fullSlider) + 'px';
    selected.style.width = parseInt(fullSlider) + 'px';
  }


  //  Вешаем обработчик события нажатия на левую кнопку мыши на ползунок

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
