create= document.querySelector('.btn-create');
save= document.querySelector('.btn-save');
cancel= document.querySelector('.btn-cancel');
update= document.querySelector('.btn.update');
firstPage = document.querySelector('.page-1');
secondPage  = document.querySelector('.page-2-main');
formDetail = document.querySelector('.form-details');


// const data = [];
const openSecondPage = function () {
    firstPage.classList.toggle('hidden');
    secondPage.classList.toggle('hidden');
}


formDetail.addEventListener('submit',function(e) {
    e.preventDefault();
    const dataArr = [...new FormData(formDetail)];
    console.log(dataArr);
    const data = Object.fromEntries(dataArr);
    console.log(data);
})

class Detail  {
    costructor (firstName,surname,gender,birthDate) {
        this.firstName = firstName[0].toUpperCase() + firstName.slice(1);
        this.surname = surName[0].toUpperCase() + surName.slice(1);
        this.gender = gender;
        this.birthDate = birthDate;
    }

    name (firstName,surname) {
        this.fullName = [firstName,surname].join(' ');
    } 

    ageCalc (age) {
        const year = new Date().getFullYear();
        console.log(year);
        this.age = year - age;
    }
    saveAndCancel () {
        
    }
    
}


create.addEventListener('click',openSecondPage );

