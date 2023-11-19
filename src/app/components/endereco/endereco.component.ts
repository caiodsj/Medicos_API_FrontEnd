import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CepCorreiosService } from 'src/app/services/cep-correios.service';
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
    private _service: DoctorServiceService,
    private _cepService: CepCorreiosService
  ) {
    this.form = this._fb.group({
      state: [''],
      city: [''],
      street: [''],
      zipCode: [''],
      neighborhood: [''],
      number: [''],
      complement: ['']
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
      
      this._service.updateAddress(idAdress, this.form.value).subscribe({
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
    this._service.getAddressByDoctorId(this.data.id).subscribe({
      next:(res)=>{
        this.doctorAddress = res
        this.form.patchValue(this.doctorAddress);
      }, 
      error: console.error
    })
  }

  getAllAddressByCEP(cep: string) {
    this._cepService.completeAddress(cep).subscribe(
      (data) => {
        this.form.patchValue({
          state: (data as any).uf,
          city: (data as any).cidade,
          street: (data as any).endereco,
          zipCode: (data as any).cep,
          neighborhood: (data as any).bairro,
          complement: (data as any).complemento
          // Preencha outros campos conforme necessário
        });
      },
      (error) => {
        console.error('Erro ao consultar CEP', error);
      }
    );
  }
  
}