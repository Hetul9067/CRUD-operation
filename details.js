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
outerSubmit = document.querySelector('.form-outer')


let detailObject=[] ;
const database = [];
const svClAns = [];
let getData;
let ans;
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
    let available = false;
    if (dataAll.saveCancel === 'Cancelled' ) {
        detailObject.forEach(function(data) {
            // console.log(data);
            if(data.fullName === dataAll.fullName) {
                data.saveCancel = 'Cancelled';
                available = true;
            }   
        });
        if(available === false) {
            alert ('For this operation, same data require')
        }       
        storeData(detailObject);

        renderTable();
        return;
        
    }
    // update.addEventListener('click',function() {
    //     console.log('hii');
    // })
    detailObject.push(dataAll);
    storeData(detailObject);
    renderTable();
    
})

// update button
const updateDetail = function(e) {
    e.preventDefault();
    // const dataArr = [...new FormData(outerSubmit)];
    // const data = Object.fromEntries(dataArr);
    // const dataAll = {
    //     firstName : data.fname,
    //     surname : data.sname,
    //     gender : data.gen,
    //     birthDate : data.bday,
    // }
    // h1 = new Detail(dataAll);
    // dataAll.fullName = h1.name();
    // dataAll.age = h1.ageCalc();
    // dataAll.saveCancel = ans;
    // console.log(dataAll);
    // console.log('hii');
    // detailObject.forEach(function(data) {
    //     if(dataAll.fullName === data.fullName) {

    //     }
    // })


    // firstPage.classList.toggle('hidden');
    // secondPage.classList.toggle('hidden');
}


update.addEventListener('submit',updateDetail)

console.log(localStorage.length);
// render table 
const renderTable = function () {
    console.log(localStorage.length);
    if(localStorage.length > 0) {
        detailObject = getLocalStorage();
    }
    else {
        tableBody.innerHTML = '';
        return;

    }
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
const svCl = function(e) {
    if(e.target.getAttribute('class') === 'btn-save' || e.target.getAttribute('class') === 'btn-cancel') {
            ans = e.target.getAttribute('class') === 'btn-save' ? 'Saved' : 'Cancelled' ;
            console.log(ans);
            firstPage.classList.toggle('hidden');
            secondPage.classList.toggle('hidden');
            renderTable();

            }
}
saveCancelContainer.addEventListener('click',svCl)
        



// delete button call back function

document.addEventListener('click',function(e) {
    if(e.target && e.target.getAttribute('id') === 'btn-del') {
        localStorage.removeItem('PersonalDetail');
        location.reload();
        renderTable();
        
    }
})




const init = function() {
    getLocalStorage();
    renderTable();
}
init();


// localStorage.removeItem('PersonalDetail')
        
        // console.log('//////////////////////////');
        // const x = [1,2,3];
        // const y = [1,2,3];
        // console.log(JSON.stringify(x)===JSON.stringify(y));
        // if (JSON.stringify(Object.values(data)) === JSON.stringify(Object.values(dataAll))) {
            
            // if(e.target.getAttribute('class') === 'btn-cancel') {
                //     console.log('hii');
                //     const ex = getLocalStorage();
                //     ex.forEach(function(data,i,arr) {
                    //         if(dataAll === data) {
                        //             console.log('you got it');
                        //         }
                        //     })
                        // }
                        
        // }