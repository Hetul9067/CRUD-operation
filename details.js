// import {hetul} from './model.js';
import {UpdateCl} from './update.js';
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

// hetul();

let detailObject=[] ;
const database = [];
let getData;
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth();
const d = date.getDate();
export const dynamicDateStamp = date.getTime()

//set data on local storage
export const storeData = function(database) {
    localStorage.setItem('PersonalDetail',JSON.stringify(database));
}

//get data on local storage
export const getLocalStorage = function() {
    getData = JSON.parse(localStorage.getItem('PersonalDetail'));
    return getData;
}



// for opening second page;
const openSecondPage = function (e) {

    document.body.classList.toggle('blur');

    document.querySelector('#birthDate').setAttribute('max',`${year}-${month + 1}-${d}`);
    firstPage.classList.toggle('hidden');
    secondPage.classList.toggle('hidden');
}
cancel.addEventListener('click',openSecondPage)
create.addEventListener('click',openSecondPage );

// detail class
export class Detail  {
    constructor (data) {
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


let sub  = false


// fetch form data
formDetail.addEventListener('submit',function(e) {
    e.preventDefault();
    if(sub) {
        const dataArr = [...new FormData(formDetail)];
        const data = Object.fromEntries(dataArr);
        const h1 = new Detail(data);
        data.fullName = h1.name();
        data.age = h1.ageCalc();
        detailObject.push(h1);
        storeData(detailObject);
        renderTable();
        formDetail.reset();
        sub = false;
    }
})


//render a first page
export const renderTable = function () {
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
                <button type = "button" id="btn-del" class='rounded-pill border border-danger bg-danger bg-gradient' data-no="${i}">
                    <i class="fas fa-trash-alt"></i> Delete</button>
            </td>
        </tr>
        
        `;
        tableBody.insertAdjacentHTML('beforeend',markup);
    });
}

//save button
const sv = function(e) {
    
    const dataA = [...new FormData(formDetail)];
    const dataO = Object.fromEntries(dataA);
    const h1 = new Detail(dataO);
    const timeStamp = new Date(h1.birthDate).getTime();
    if(!h1.firstName || 
        !h1.surname ||
        !h1.gender ||
        !h1.birthDate ) {
        return false;
    }

    if(!h1.birthDate || timeStamp < new Date('1950-01-01').getTime() || timeStamp > dynamicDateStamp ) {
        if(!h1.birthDate) alert('Oops, birthday is an empty')
        return false;
    }
    const dataBase = getLocalStorage();
    if(dataBase)
        for(let i=0; i < dataBase.length; i++) {
            if(dataBase[i].firstName === h1.firstName && dataBase[i].surname === h1.surname && dataBase[i].gender === h1.gender && new Date(dataBase[i].birthDate).getTime() === timeStamp) {
                formDetail.reset();
                break;
            }
    }
    firstPage.classList.toggle('hidden');
    secondPage.classList.toggle('hidden');
    sub = true;
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


const init = function() {
    getLocalStorage();
    renderTable();
    UpdateCl.prototype._updateClickEventHandler();
    UpdateCl.prototype._UpdateSubmitEventHandler();
}
init();

