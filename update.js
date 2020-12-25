import {dynamicDateStamp,getLocalStorage,storeData,Detail,renderTable} from './details.js';
export class UpdateCl {
    _counter ;
    _updateAvailable = false;



    //function which check the change
    _updateChecker (data,text,idName,counter) {
        data.forEach(function(dataObject,i) {
            if(i === +counter){
                if(idName === 'editfname' ) {
                    dataObject.firstName = text;
                    const xdata = new Detail(dataObject);
                    dataObject.firstName = xdata.firstName;
                    dataObject.fullName = xdata.name();
                } else if(idName === 'editsname' ) {
                    dataObject.surname = text;
                    const xdata = new Detail(dataObject);
                    dataObject.surname = xdata.surname;
                    dataObject.fullName = xdata.name();
                } else if (idName === 'editgender') {
                    dataObject.gender = text[0].toUpperCase() + text.slice(1).toLowerCase();
                } 
            } 
        });
        return data;
    }


    _UpdateSubmitEventHandler() {
        document.addEventListener('submit',function(e) {
            e.preventDefault();
            const text = e.target.firstElementChild.value;
            if(this._updateAvailable) {
                if (text) {
                    const idName = e.target.firstElementChild.getAttribute('id');
                    const data = getLocalStorage();
                    const updateData = UpdateCl.prototype._updateChecker(data,text,idName,this._counter);
                    storeData(updateData)
                    renderTable();
                } 
                else  {
                    e.target.innerHTML='';
                    renderTable();
                }
                this._updateAvailable = false;
            }
        })
    }

    //date update function
    dateSubmit(counter,event) {
        const text = event.target.value;
        if(event.keyCode === 13 && text) {
            const timeStp = new Date(text).getTime();
            if(!event.target.checkValidity()) {
                return;
            }
            const data = getLocalStorage();
            data.forEach(function(dataObject,i) {
                if(i === +counter ) {
                    dataObject.birthDate = text;
                    const xdata = new Detail(dataObject);
                    dataObject.age = xdata.ageCalc();
                }    
            })
            storeData(data);
            renderTable();
        }
        else if(event.keyCode === 13) {
            event.target.parentElement.innerHTML = '';
            renderTable();
        } 
    }

    // // select a markup for editting
    _htmlElement (className,counter,dateClick) {
        const birthDateText = "min='1950-01-01' max='2020-01-01' onkeydown='dateClick(event)' required>"
        const value = className === 'birthdate' ? 'date' : 'text' ;
        const markup = 
            `
            <form class='formname was-validated' autocomplete="off">
                
                <input type=${value} id="edit${className}" data-no="${counter}" name="edit${className}" ${className === 'birthdate' ? birthDateText : '>'}
                <div class="invalid-feedback" style="font-size:1.5rem">
                    
                    Please enter date between 01/01/1950 & current date.
                </div>
            </form>`;
        
        return  markup;
    }

    // click event for update
    _updateClickEventHandler () {
        document.addEventListener('click', function(e) {
            const className = e.target.getAttribute('class');
            if(e.target && className === 'fname' || className === 'sname' || className === 'gender'  ) {
                e.target.innerHTML = '';
                this._counter = e.target.getAttribute('data-no')

                const markup = UpdateCl.prototype._htmlElement.bind(this,className,this._counter)
                e.target.insertAdjacentHTML('beforeend',markup(className,this._counter));
                this._updateAvailable=true;
            } 
            else if (e.target && className === 'birthdate') {
                e.target.innerHTML = '';
                this._counter = e.target.getAttribute('data-no');
                const markup = UpdateCl.prototype._htmlElement.bind(this)
                this.dateClick = UpdateCl.prototype.dateSubmit.bind(this,this._counter);
                e.target.insertAdjacentHTML('beforeend',markup(className,this._counter,this.dateClick));
            }
        })
    }
}
