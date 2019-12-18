import {select, settings} from '../settings.js';
import BaseWidget from './BaseWidget.js';
import { utils } from '../utils.js';

// eslint-disable-next-line no-unused-vars
class datePicker extends BaseWidget{
  constructor(wrapper){  
    super(wrapper, utils.dateToStr(new Date()));
    const thisWidget = this;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);

    thisWidget.initPlugin();

    

  }
  initPlugin(){
    const thisWidget = this;
    thisWidget.minDate = new Date(thisWidget.value);

    thisWidget.maxDate = new Date(utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture));

    thisWidget.dom.input.addEventListener('input', function(){
      thisWidget.value = thisWidget.dom.input.value;
    });

    // eslint-disable-next-line no-undef
    flatpickr(thisWidget.dom.input, {
      enableTime: false,
      dateFormat: 'Y-m-d',
      minDate: thisWidget.minDate,
      maxDate: thisWidget.maxDate,
      /** monday start */
      disable: [
        function(date) {
          // return true to disable
          return (date.getDay() === 1 || date.getDay() === 7);
        }
      ],
      locale: {
        'firstDayOfWeek': 1 // start week on Monday
      }
    });
  }
  parseValue(value){
    return value;
  }
  isValid(){
    return true;
  }
  renderValue(){

  }

}
export default datePicker;
