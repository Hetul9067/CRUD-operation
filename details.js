create= document.querySelector('.btn-create');
save= document.querySelector('.btn-save');
firstPage = document.querySelector('.page-1');
secondPage  = document.querySelector('.page-2-main');
formDetail = document.querySelector('.form-details');
tableHead = document.querySelector('thead');
tableBody = document.querySelector('tbody');
outerSubmit = document.querySelector('.form-outer')


let detailObject=[] ;
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

// detail class
class Detail  {
    constructor (data) {
        // console.log(firstName);
        this.firstName = data.firstName[0].toUpperCase() + data.firstName.slice(1);
        this.surname = data.surname[0].toUpperCase() + data.surname.slice(1);
        this.gender = data.gender;
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
    detailObject.push(dataAll);
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
    const addMarkup = 
    `<td id="del" rowspan=${detailObject.length}>
    <button type = "button" id="btn-del">Delete</button>
    </td>`;
    
    detailObject.forEach(function(data, i,arr) {
        const markup = `
        <tr>
        <td class="fname" data-no="${i}" >${data.firstName}</td>
        <td class='sname' data-no="${i}">${data.surname}</td>
        <td>${data.fullName}</td>
        <td >${data.age} </td>
        <td class="gender" data-no="${i}">${data.gender}</td>
        <td class="birthdate" data-no="${i}">${data.birthDate}</td>
        
        ${(i===0)?addMarkup:''}
        </tr>
        
        `;
        tableBody.insertAdjacentHTML('beforeend',markup);
    });
}






const sv = function(e) {
    
    firstPage.classList.toggle('hidden');
    secondPage.classList.toggle('hidden');
    try {
        if(!document.querySelector('#fname').value ||
            !document.querySelector('#sname').value ||
            !document.querySelector('#gen').value ||
            !document.querySelector('#bday').value) {
                throw new Error( 'data empty, please enter a data')
        }
    } catch (err) {
        alert(err);
    }
    renderTable();
    
}
save.addEventListener('click',sv)



// delete button call back function

document.addEventListener('click',function(e) {
    if(e.target && e.target.getAttribute('id') === 'btn-del') {
        count = 0;
        localStorage.removeItem('PersonalDetail');
        location.reload();
        renderTable();
        
    }
})


// update data 
let counter ;
let addDetail = false;
document.addEventListener('submit',async function(e) {
    e.preventDefault();
    if (addDetail ) {
        const idName = e.target.firstElementChild.getAttribute('id');
        const text = e.target.firstElementChild.value;
        const data = getLocalStorage();
        data.forEach(function(dataObject,i,arr) {
            if(i === +counter){
                if(idName === 'editfname' ) {
                    dataObject.firstName = text;
                    const xdata = new Detail(dataObject);
                    dataObject.fullName = xdata.name();
                    alert('FirstName & FullName change successfully')               
                } else if(idName === 'editsname' ) {
                    dataObject.surname = text;
                    const xdata = new Detail(dataObject);
                    dataObject.fullName = xdata.name();
                    alert('Surname & FullName change successfully')               

                } else if (idName === 'editgender') {
                    dataObject.gender = text;
                    alert('Gender change successfully')               

                } 
                else if (idName === 'editbirthdate') {
                    dataObject.birthDate = text;
                    const xdata = new Detail(dataObject);
                    dataObject.age = xdata.ageCalc();
                    alert('Birthdate & Age change successfully')
                }

            }
        })

        storeData(data) 
        renderTable();
}
})


document.addEventListener('click', function(e) {
    // console.log(e.target);
    const className = e.target.getAttribute('class');
    if(e.target && className === 'fname' || className === 'sname' || className === 'gender'  ) {
        e.target.innerHTML = '';
        
        counter = e.target.getAttribute('data-no')

        const markup = 
        `
        <form class='formname'>
            <input type= "text" id="edit${className}" data-no="${counter}" name="edit${className}">
        </form>`;
        e.target.insertAdjacentHTML('beforeend',markup);
    } else if (e.target && className === 'birthdate') {
        e.target.innerHTML = '';
        
        counter = e.target.getAttribute('data-no')

        const markup = 
        `
        <form class='formname'>
            <input type= "date" id="edit${className}" data-no="${counter}" name="edit${className}" required>
            <input type='submit' >
        </form>`;
        e.target.insertAdjacentHTML('beforeend',markup);
    }

    // console.log(e.target);
    addDetail = true;
})




const init = function() {
    getLocalStorage();
    renderTable();
}
init();

