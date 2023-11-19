import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DoctorServiceService } from './services/doctor-service.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatDialog } from '@angular/material/dialog';
import { FormAddEditDoctorComponent } from './components/form-add-edit-doctor/form-add-edit-doctor.component';
import { MatTableDataSource } from '@angular/material/table';
import { EnderecoComponent } from './components/endereco/endereco.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'lista_medicos';

  displayedColumns: string[] = [
    'name',
    'cpf',
    'phone',
    'email',
    'specialty',
    'crm',
    'acceptSample',
    'action'
  ]
  data: any = []
  filter: string = '';
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<any>([]);

  constructor(private _dialog: MatDialog, private _service: DoctorServiceService, private _liveAnnouncer: LiveAnnouncer){}

  openAddDoctor(){
    const dialogRef = this._dialog.open(FormAddEditDoctorComponent, {
      width: '50vw',
      height: '70vh',
    });

    dialogRef.afterClosed().subscribe({
      next: (val)=>{
        if(val) this.getDoctorList();
      }
    })
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
    this.getDoctorList()
  }
  getDoctorList() {
    this._service.getDoctors().subscribe({
      next: (res) => {
        this.data = res;
        this.dataSource.data = this.data;
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  

  deleteDoctor(id:number){
    this._service.deleteDoctor(id).subscribe({
      next:()=>{
        console.log('deletado com sucesso')
        this.getDoctorList()
      },
      error:console.log
    })
  }

  openEditForm(data:any){
    const dialogRef = this._dialog.open(FormAddEditDoctorComponent, {
      data,
      width: '50vw',
      height: '70vh'
    })
    dialogRef.afterClosed().subscribe({
      next:(val)=>{
        if (val){
          this.getDoctorList();
        }
      }
    })
  }

  verEndereco(data:any){
    const dialogRef = this._dialog.open(EnderecoComponent, {
      data,
      width: '50vw',
      height: '70vh'
    })
    dialogRef.afterClosed().subscribe({
      next:(val)=>{
        if (val){
          this.getDoctorList();
        }
      }
    })
  }
}
