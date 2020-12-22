'use strict'

const create= document.querySelector('.btn-create');
const save= document.querySelector('.btn-save');
const firstPage = document.querySelector('.page-1');
const secondPage  = document.querySelector('.page-2-main');
const formDetail = document.querySelector('.form-details');
const tableHead = document.querySelector('thead');
const tableBody = document.querySelector('tbody');
const outerSubmit = document.querySelector('.form-outer')
const cancel=document.querySelector('.btn-cancel')

let detailObject=[] ;
const database = [];
let getData;
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth();
const d = date.getDate();
const dynamicDateStamp = date.getTime()
console.log(year,month,d);
//set data on local storage
const storeData = function(database) {
    localStorage.setItem('PersonalDetail',JSON.stringify(database));
}

//get data on local storage
const getLocalStorage = function() {
    getData = JSON.parse(localStorage.getItem('PersonalDetail'));
    return getData;
}



// for opening second page;
const openSecondPage = function () {
    console.log(date);
    document.querySelector('#bday').setAttribute('max',`${year}-${month + 1}-${d}`);
    firstPage.classList.toggle('hidden');
    secondPage.classList.toggle('hidden');
}
cancel.addEventListener('click',openSecondPage)
create.addEventListener('click',openSecondPage );

// detail class
class Detail  {
    constructor (data) {
        // console.log(firstName);
        this.firstName = data.firstName[0].toUpperCase() + data.firstName.slice(1).toLowerCase();
        this.surname = data.surname[0].toUpperCase() + data.surname.slice(1).toLowerCase();
        this.gender = data.gender[0].toUpperCase() + data.gender.slice(1).toLowerCase();
        this.birthDate = data.birthDate;
        
    }
    
    name () {
        this.fullName = [this.firstName,this.surname].join(' ');
        return this.fullName;
    } 
    
    ageCalc () {
        const year = new Date().getFullYear();
        this.age = year - (+this.birthDate.slice(0,4));
        return this.age;
    }
}





// fetch form data
formDetail.addEventListener('submit',function(e) {
    e.preventDefault();
    
    const dataArr = [...new FormData(formDetail)];
    const data = Object.fromEntries(dataArr);
    const h1 = new Detail(data);
    data.fullName = h1.name();
    data.age = h1.ageCalc();
    detailObject.push(h1);
    storeData(detailObject);
    renderTable();
    formDetail.reset();
})


//render a first page
const renderTable = function () {
    if(localStorage.length > 0) {
        detailObject = getLocalStorage();
    }
    else {
        tableBody.innerHTML = '';
        return;
    }
    tableBody.innerHTML = '';
    detailObject.forEach(function(data, i,arr) {
        const markup = `
        <tr>
            <td class="fname" id='editHover' data-no="${i}" >${data.firstName}</td>
            <td class='sname' id='editHover' data-no="${i}">${data.surname}</td>
            <td>${data.fullName}</td>
            <td >${data.age} </td>
            <td class="gender" id='editHover' data-no="${i}">${data.gender}</td>
            <td class="birthdate" id='editHover'  data-no="${i}">${data.birthDate}</td>
            <td id="del" >
                <button type = "button" id="btn-del" data-no="${i}">Delete</button>
            </td>
        </tr>
        
        `;
        tableBody.insertAdjacentHTML('beforeend',markup);
    });
}

//save button
const sv = function(e) {
    const fname = formDetail.querySelector('#fname').value;
    const sname = formDetail.querySelector('#sname').value;
    const gen = formDetail.querySelector('#gen').value;
    const bday = formDetail.querySelector('#bday').value;
    const timeStamp = new Date(bday).getTime();

    if(!fname || 
        !sname ||
        !gen ||
        !bday ) {
        return false;
    }
    
    if(!bday || timeStamp < new Date('1950-01-01').getTime() || timeStamp > dynamicDateStamp ) {
        if(!bday) alert('Oops, birthday is an empty')
        return false;
    }
    firstPage.classList.toggle('hidden');
    secondPage.classList.toggle('hidden');
    renderTable();
}
save.addEventListener('click',sv)

// delete button call back function
document.addEventListener('click',function(e) {
    if(e.target && e.target.getAttribute('id') === 'btn-del') {
        const data = getLocalStorage();
        const delEl = e.target.getAttribute('data-no');
        data.splice(delEl,1);
        storeData(data);
        renderTable();
        location.reload();
    }
})


// update data submit 
let counter ;
let updateAvailable = false;



//function which check the change
const updateChecker = function(data,text,idName) {
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


//submit other editted element
const updateOtherEl = function(e) {
    e.preventDefault();
    const text = e.target.firstElementChild.value;
    if(updateAvailable) {
        if (text) {
            const idName = e.target.firstElementChild.getAttribute('id');
            const data = getLocalStorage();
            const updateData = updateChecker(data,text,idName);
            storeData(updateData)
            renderTable();
        } 
        else  {
            e.target.innerHTML='';
            renderTable();
        }
        updateAvailable = false;
    }
}

document.addEventListener('submit',updateOtherEl)


//date update function
const dateSubmit = function(event) {
    const text = event.target.value;
    if(event.keyCode === 13 && text) {
        const timeStp = new Date(text).getTime();
        if(timeStp < new Date('1950-01-01').getTime()  ) {
            alert('Oops, birthday is less than 1950')
            return false;
        }
        if(timeStp > dynamicDateStamp) {
            alert('Oops, birthday is grater than current date')
            return false;
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

    } else if(event.keyCode === 13) {
        event.target.parentElement.innerHTML = '';
        renderTable();
    } 
}

// select a markup for editting
const htmlElement = function(className,counter) {
    const birthDateText = "min='1950-01-01' max='2020-01-01' onkeydown='dateSubmit(event)' >"
    const value = className === 'birthdate' ? 'date' : 'text' ;
    const markup = 
        `
        <form class='formname'>
            <input type=${value} id="edit${className}" data-no="${counter}" name="edit${className}" ${className === 'birthdate' ? birthDateText : '>'}
        </form>`;
    return  markup;
}

// click event for update
const editClickEvent = function(e) {
    const className = e.target.getAttribute('class');
    if(e.target && className === 'fname' || className === 'sname' || className === 'gender'  ) {
        e.target.innerHTML = '';
        counter = e.target.getAttribute('data-no')
        e.target.insertAdjacentHTML('beforeend',htmlElement(className,counter));
        updateAvailable=true;
    } 
    else if (e.target && className === 'birthdate') {
        e.target.innerHTML = '';
        counter = e.target.getAttribute('data-no');
        e.target.insertAdjacentHTML('beforeend',htmlElement(className,counter));
    }
}

// click event for edit 
document.addEventListener('click', editClickEvent );
   
const init = function() {
    getLocalStorage();
    renderTable();
}
init();

