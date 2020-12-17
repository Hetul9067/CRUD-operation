create= document.querySelector('.btn-create');
save= document.querySelector('.btn-save');
cancel= document.querySelector('.btn-cancel');
update= document.querySelector('.btn-update');
firstPage = document.querySelector('.page-1');
secondPage  = document.querySelector('.page-2-main');
formDetail = document.querySelector('.form-details');
saveCancelContainer = document.querySelector('.btn-sv-cl')
tableHead = document.querySelector('thead');
tableBody = document.querySelector('tbody');


let detailObject ;
const database = [];
const svClAns = [];
let getData;
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
    firstPage.classList.toggle('hidden');
    secondPage.classList.toggle('hidden');
}

create.addEventListener('click',openSecondPage );


// fetch form data
let h1;
formDetail.addEventListener('submit',function(e) {
    e.preventDefault();
    const dataArr = [...new FormData(formDetail)];
    const data = Object.fromEntries(dataArr);
    const dataAll = {
        firstName : data.fname,
        surname : data.sname,
        gender : data.gen,
        birthDate : data.bday,
    }
    h1 = new Detail(dataAll);
    dataAll.fullName = h1.name();
    dataAll.age = h1.ageCalc();
    dataAll.saveCancel = ans;
    // database.push(dataAll)
    detailObject.push(dataAll);
    storeData(detailObject);
    renderTable();

})

// render table 
const renderTable = function () {
    detailObject = getLocalStorage();
    tableBody.innerHTML = '';
    const addMarkup = 
        `<td id="del" rowspan=${detailObject.length}>
            <button type = "button" id="btn-del">Delete</button>
        </td>`;

    detailObject.forEach(function(data, i,arr) {
        
        const markup = `
            
            <tr>
                <td>${data.firstName}</td>
                <td>${data.surname}</td>
                <td>${data.fullName}</td>
                <td>${data.age}</td>
                <td>${data.gender}</td>
                <td>${data.birthDate}</td>
                <td>${data.saveCancel}</td>
                ${(i===0)?addMarkup:''}
            </tr>
        
            `;
        tableBody.insertAdjacentHTML('beforeend',markup);
    });
}
// save cancel return;
let ans;
const svCl = function(e) {
    if(e.target.getAttribute('class') === 'btn-save' || e.target.getAttribute('class') === 'btn-cancel') {
        ans = e.target.getAttribute('class') === 'btn-save' ? 'Saved' : 'Cancelled' ;
        console.log(ans);
        firstPage.classList.toggle('hidden');
        secondPage.classList.toggle('hidden');
        renderTable();
        
    }
}

saveCancelContainer.addEventListener('click',svCl);


// update button
const updateDetail = function() {
    firstPage.classList.toggle('hidden');
    secondPage.classList.toggle('hidden');
}


update.addEventListener('click',updateDetail)


// detail class
class Detail  {
    constructor (data) {
        // console.log(firstName);
        this.firstName = data.firstName[0].toUpperCase() + data.firstName.slice(1);
        this.surname = data.surname[0].toUpperCase() + data.surname.slice(1);
        this.gender = data.gender;
        this.birthDate = data.birthDate;
        this.ans = ans;
    }
    
    name () {
        this.fullName = [this.firstName,this.surname].join(' ');
        return this.fullName;
    } 
    
    ageCalc () {
        const year = new Date().getFullYear();
        console.log(year);
        this.age = year - (+this.birthDate.slice(0,4));
        return this.age;
    }
}





const init = function() {
    renderTable();

}
init();