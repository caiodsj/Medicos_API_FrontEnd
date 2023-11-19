import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DoctorServiceService } from 'src/app/services/doctor-service.service';

@Component({
  selector: 'app-endereco',
  templateUrl: './endereco.component.html',
  styleUrls: ['./endereco.component.scss']
})
export class EnderecoComponent implements OnInit{
  form: FormGroup;
  isEditMode: boolean = false;
  doctorAddress:any = []

  constructor(
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<EnderecoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _service: DoctorServiceService
  ) {
    this.form = _fb.group({
      state: { value: '', disabled: true },
      city: { value: '', disabled: true },
      street: { value: '', disabled: true },
      zipCode: { value: '', disabled: true },
      neighborhood: { value: '', disabled: true },
      number: { value: '', disabled: true },
      complement: { value: '', disabled: true }
    });
  }

  ngOnInit(): void {
    this.getAddressByDoctorId();
  }
  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  
    if (this.isEditMode) {
      this.form.enable();
    } else {
      if (this.form.dirty) {
        this.saveChanges();
      }
  
      this.form.disable();
    }
  }

  saveChanges() {
    if (this.doctorAddress && this.doctorAddress.id) {
      const idAdress = this.doctorAddress.id;
      
      this._service.updateAdress(idAdress, this.form.value).subscribe({
        next: (res) => {
          console.log('Endereço atualizado');
          this.getDoctorList();
          this._dialogRef.close(true);
        },
        error: (err) => {
          console.error(err);
        }
      });
    } else {
      console.error('O campo idAdress está ausente ou inválido.');
    }
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
  getAddressByDoctorId(){
    this._service.getAdressByDoctorId(this.data.id).subscribe({
      next:(res)=>{
        this.doctorAddress = res
        this.form.patchValue(this.doctorAddress);
      }, 
      error: console.error
    })
  }
}