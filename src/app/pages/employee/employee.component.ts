import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Employee } from 'src/app/modele/employee';
import { EmployeeService } from 'src/app/services/employee.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  emplList:Employee[] = [];
  emplFormGroup!: FormGroup;
  emplFormGroup2!: FormGroup;
  submitted:boolean = false;
  emplModel:Employee = new Employee();
  employe:Employee = new Employee();
  file!: File;
  imgUrl: string | ArrayBuffer = 'assets/img/avatar.png'
  @ViewChild('closeModalBtn') closeModalBtn!: ElementRef;
  @ViewChild('closeUpdateModalBtn') closeUpdateModalBtn!: ElementRef;
  constructor(private empservice:EmployeeService
    ) { }

  ngOnInit(): void {
    this.emplFormGroup = new FormGroup({
      'fullName' : new FormControl('', Validators.required),
      'age' : new FormControl('', Validators.required),
      'image' : new FormControl('', Validators.required),
    });
    this.emplFormGroup2 = new FormGroup({
      'fullName' : new FormControl('', Validators.required),
      'age' : new FormControl('', Validators.required),
      'image' : new FormControl('', Validators.required),
    });
this.getEmployeList()
  }
  getEmployeList()
  {
    this.empservice.getList().subscribe(res => {
      this.emplList = res
    } , error => {
        console.error(error)
    } , ()=> {

    })
  }
  addEmployee()
  {
    
    this.submitted = true;
    if(this.emplFormGroup.invalid)
    {
      return  ;
    }
    

    this.emplModel.fullName= this.emplFormGroup.value.fullName;
    this.emplModel.age = this.emplFormGroup.value.age;
    this.emplModel.image = this.emplFormGroup.value.image;
    
   
    
      this.empservice.saveemployee(this.emplModel)
        .subscribe({
          next: (res) => {
            this.empservice.uploadEmpImage(res.id, this.file).subscribe(
              res =>  {} , error => {} , () => {this.closeModalBtn.nativeElement.click()
                this.getEmployeList();
                this.submitted = false ; 
                this.emplModel = new Employee();
                this.emplFormGroup.reset();
                //this.toastrService.success('Success!', 'Votre employe a été ajouté!');
              });
            
          },
        });
      }

      getEmploye(employeId:number)
  {

    if(employeId!=undefined && employeId !=null)
    {
      this.empservice.findEmpById(employeId).subscribe(
        res=>{
          console.log(res);
          this.emplModel=res 
      },error=>{
        console.error(error) 
      },()=>{ 
        this.imgUrl=this.emplModel.image;
        this.emplFormGroup2.get("fullName")?.setValue(this.emplModel.fullName);
        this.emplFormGroup2.get("age")?.setValue(this.emplModel.age);
        this.emplFormGroup2.get("image")?.setValue(this.emplModel.image);
        this.emplFormGroup2.updateValueAndValidity()
      });
    }
  }
  updateEmploye()
  {
    this.submitted = true;
    if(this.emplFormGroup2.invalid)
    {
      return ;
    }
    
    
      
      this.emplModel.fullName = this.emplFormGroup2.value.firstName;
      this.emplModel.age = this.emplFormGroup2.value.lastName;
      this.emplModel.image = this.emplFormGroup2.value.image;
     
    
    this.empservice.saveemployee(this.emplModel)
    .subscribe({
      next: (res) => {
        this.empservice.uploadEmpImage(res.id, this.file).subscribe(
          res =>  {} , error => {} , () => {
            this.submitted = false ; 
            this.emplModel = new Employee();
            this.emplFormGroup2.reset();
            this.getEmployeList();});
            this.closeUpdateModalBtn.nativeElement.click();
            this.getEmployeList();
            //alertifyjs.set("notifier","position","top-right");
        //alertifyjs.success('Votre professeur a été modifié!');
        //this.toastrService.success('Success!', 'Votre employe a été modifié!');

        
      },
    });
  }
  deleteEmploye(empId:number)
  {
    if(empId!=undefined && empId !=null)
    {
      Swal.fire({
        title: 'Êtes-vous sûr?',
        text: 'Vous ne pourrez pas récupérer ce employe!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, supprimez-le!',
        cancelButtonText: 'Non, gardez-le'
      }).then((result : any) => {
        if (result.value) {
         // alert(id);
          this.empservice.deleteEmploye(empId)
          .subscribe(res=>{
            this.getEmployeList();
          })
        Swal.fire(
          'Supprimé!',
          'Votre employe a été supprimé.',
          'success'
        )
     
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Annulé',
          'Votre professeur est en sécurité 🙂',
          'error'
        )
        }
      })
    }
  }
  viewEmployee(empId:number)
  {
      if(empId!=undefined && empId !=null)
      {
        this.employe = new Employee();
        this.empservice.findEmpById(empId).subscribe( res => {
          this.employe = res;
          console.log('view ' , this.employe)
        })
      }
  }

  onFileInput(files: FileList | null): void {
    if (files) {
      this.file = files.item(0) as File;
      if (this.file) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(this.file);
        fileReader.onload = (event) => {
          if (fileReader.result) {
            this.imgUrl = fileReader.result;
          }
        };
      }
    }
  }

  changeSource(event:any) {      
    event.target.src = "assets/img/avatar.png";
}

}
