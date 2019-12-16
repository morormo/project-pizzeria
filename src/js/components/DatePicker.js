import BaseWidget from "./BaseWidget.js";
import { utils } from "../utils.js";

class datePicker extends BaseWidget{
    constructor(wrapper){  
        super(wrapper, utils.dateToStr(new Date()));

        thisWidget.dom.input = thisWidget.dom.wrapper.qurySelector(select.widgets.date.Picker.input);

        thisWidget.initPlugin();

    }
    initPlugin(){
        thisWidget.minDate = new Date(thisWidget.value);

        thisWidget.maxDate = new Date(utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture));

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