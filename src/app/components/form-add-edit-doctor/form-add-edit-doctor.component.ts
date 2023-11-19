import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DoctorServiceService } from 'src/app/services/doctor-service.service';

@Component({
  selector: 'app-form-add-edit-doctor',
  templateUrl: './form-add-edit-doctor.component.html',
  styleUrls: ['./form-add-edit-doctor.component.scss']
})
export class FormAddEditDoctorComponent implements OnInit{

  form: FormGroup;

  constructor(private _fb:FormBuilder,
    private _service: DoctorServiceService,
    private _dialogRef:MatDialogRef<FormAddEditDoctorComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any){
      this.form = _fb.group({
        id: '',
        crm: '', 
        name: '',
        cpf: '',
        phone: '',
        email: '',
        specialty: '',
        acceptsample: data ? data.acceptSample : false
      })
    }

    ngOnInit(): void {
      this.form.patchValue(this.data)
    }
    onFormSubmit(){
      if(this.form.valid){
        if(this.data) this.updateDoctor()
        else this.addDoctor()
      }
    }

    addDoctor(){
      this._service.addDoctor(this.form.value).subscribe({
        next: () =>{
          console.log("Cadastrado com sucesso")
          this.getDoctorList()
          this._dialogRef.close(true)
        },
        error:(err)=>{
          console.error(err)
        }
      })
    }
    updateDoctor(){
      this._service.updateDoctor(this.data.id, this.form.value).subscribe({
        next: () =>{
          console.log("Atualizado com sucesso")
          this.getDoctorList()
          this._dialogRef.close(true)
        },
        error:(err)=>{
          console.error(err)
        }
      })
    }
    closeDialog(): void {
      this._dialogRef.close();
    }

    getDoctorList(){
      this._service.getDoctors().subscribe({
        next:(res)=>{
          this.data = res
        },
        error: console.error
      })
    }
}
