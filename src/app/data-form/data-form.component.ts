import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { EstadoBr } from '../shared/models/estado-br';
import { ConsultaCepService } from '../shared/services/consulta-cep.service';
import { DropdownService } from '../shared/services/dropdown.service';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.scss']
})
export class DataFormComponent implements OnInit {

  formulario!: FormGroup;
  estados!: EstadoBr[];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropdownService: DropdownService,
    private cepService: ConsultaCepService
  ) { }

  ngOnInit(): void {

    this.dropdownService.getEstadosBr()
      .subscribe(dados => {
        !this.estados;
        console.log(dados);
      });

    this.formulario = this.formBuilder.group({

      area: this.formBuilder.group({
        curso: ["", Validators.required]
      }),

      nome: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      celular: [null, Validators.required],

      endereco: this.formBuilder.group({
        cep: [null, Validators.required],
        complemento: [null, Validators.required],
        numero: [null, Validators.required],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required]
      })
    });

  }

  onSubmit() {

    console.log(this.formulario);

    if (this.formulario.valid) {
      this.http.post('https://httpbin.org/post',
        JSON.stringify(this.formulario.value))
        .pipe(map((res: any) => res))
        .subscribe(dados => {
          console.log(dados);
          //reseta o formulario
          this.resetar();

        },
          (error: any) => alert('erro')
        );
    } else {
      console.log('formulário inválido!');
      this.verificaValidacoesForm(this.formulario);
    }
  }

  verificaValidacoesForm(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(campo => {
      console.log(campo);
      const controle = formGroup.get(campo);
      controle?.markAsTouched();
      if (controle instanceof FormGroup) {
        this.verificaValidacoesForm(controle);
      }
    });
  }

  resetar() {
    //reseta o formulario
    this.formulario.reset();
  }

  verificaValidTouched(campo: string | (string | number)[]) {
    return this.formulario.get(campo)?.valid && this.formulario.get(campo)?.touched;
  }

  verificaIsValidTouched(campo: string | (string | number)[]) {
    return !this.formulario.get(campo)?.valid && this.formulario.get(campo)?.touched;
  }

  aplicaCssError(campo: string | (string | number)[]) {
    return {
      'is-valid': this.verificaValidTouched(campo),
      'is-invalid': this.verificaIsValidTouched(campo)
    }
  }

  // API CEP
  consultaCEP() {
    const cep = this.formulario.get('endereco.cep')?.value;

    if (cep != null && cep !== '') {
      this.cepService.consultaCEP(cep)
        .subscribe(dados => this.populaDadosForm(dados));
    }
  }

  populaDadosForm(dados: any) {

    this.formulario.patchValue({
      endereco: {
        complemento: dados.complemento,
        rua: dados.logradouro,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    });

    //this.formulario.get('nome')?.setValue('Márcio');

  }

  resetaDadosForm() {
    this.formulario.patchValue({
      endereco: {
        complemento: null,
        rua: null,
        bairro: null,
        cidade: null,
        estado: null
      }
    });
  }

}
function subscribe(arg0: (dados: any) => void) {
  throw new Error('Function not implemented.');
}

