import {dynamicDateStamp,getLocalStorage,storeData,Detail,renderTable} from './details.js';
export class UpdateCl {
    _dataGet = getLocalStorage();
    _counter ;
    _updateAvailable = false;


    
    _updateChecker (text,idName,counter) {
        const data = getLocalStorage();
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
            
            
            
    _duplicateChecker(text,idName,counter,dateDuplicate = false) {
        const data = getLocalStorage();
        let fname= data[+counter].firstName;
        let sname=data[+counter].surname;
        let gen=data[+counter].gender;
        let bDay = data[+counter].birthDate;
        if(idName === 'editfname' ) {
            fname = text[0].toUpperCase() + text.slice(1).toLowerCase();
        } else if(idName === 'editsname' ) {
            sname =  text[0].toUpperCase() + text.slice(1).toLowerCase();
            

        } else if (idName === 'editgender') {
            gen= text[0].toUpperCase() + text.slice(1).toLowerCase();
            
        } else if (dateDuplicate) {
            bDay = text;
        }
        
        let duplicateData = false;
        let dateC = 1;
        for(let i=0;i<data.length;i++) {
            if(data[i].firstName === fname && 
                data[i].surname === sname &&
                data[i].gender === gen &&
                data[i].birthDate === bDay) {
                    duplicateData = true;
                    dateC = 0;
                    

            }
                
        }
        if(dateDuplicate) {
            return dateC;
        }
        if(duplicateData) {
            duplicateData = false;
            return data;
        }
        return UpdateCl.prototype._updateChecker(text,idName,counter);
        
    }

    _UpdateSubmitEventHandler() {
        document.addEventListener('submit',function(e) {
            e.preventDefault();
            
            if(this._updateAvailable) {
                e.preventDefault();
                const text = e.target.firstElementChild.value;
                if (text) {
                    const idName = e.target.firstElementChild.getAttribute('id');
                    const updateData = UpdateCl.prototype._duplicateChecker(text,idName,this._counter);
                    storeData(updateData)
                    renderTable();
                } 
                else  {
                    e.target.innerHTML='';
                    renderTable();
                }
            }
            this._updateAvailable = false;
            // if()
            let counter = this._counter;
            const text = e.target.firstElementChild.value;
            if(e.target.firstElementChild.getAttribute('id') === 'editbirthdate' && text) {
                if(!e.target.firstElementChild.checkValidity()) {
                    return;
                }
                const changeUp = UpdateCl.prototype._duplicateChecker(text,' ',this._counter,true);
                const data = getLocalStorage();
                if(changeUp) {
                    data.forEach(function(dataObject,i) {
                        if(i === +counter ) {
                            dataObject.birthDate = text;
                            const xdata = new Detail(dataObject);
                            dataObject.age = xdata.ageCalc();
                        }    
                    })
                }
                storeData(data);
                renderTable();
            }
            else if(e.target.firstElementChild.getAttribute('id') === 'editbirthdate' && !text) {
                e.target.parentElement.innerHTML = '';
                renderTable();
            }   
            
            
        })
    }

    //date update function
    dateSubmit(counter,event) {
        const text = event.target.value;
        if(event.keyCode === 13 && text) {
            if(!event.target.checkValidity()) {
                return;
            }
            const changeUp = UpdateCl.prototype._duplicateChecker(text,' ',counter,true);
            const data = getLocalStorage();
            if(changeUp) {
                data.forEach(function(dataObject,i) {
                    if(i === +counter ) {
                        dataObject.birthDate = text;
                        const xdata = new Detail(dataObject);
                        dataObject.age = xdata.ageCalc();
                    }    
                })
            }
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
        const birthDateText = `min='1950-01-01' max='2020-01-01' onkeydown='dateClick(event)' required>
                               <input class= 'buttonSub' type='submit' >`
        const value = className === 'birthdate' ? 'date' : 'text' ;
        const markup = 
            `
            <form class='formname was-validated' autocomplete="off" novalidate>
                
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
