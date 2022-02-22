import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { ConsultaCepService } from '../shared/services/consulta-cep.service';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.scss']
})
export class TemplateFormComponent implements OnInit {

  usuario: any = {
    curso: null,
    nome: null,
    email: null,
    celular: null,
    cep: null,
    complemento: null,
    rua: null,
    bairro: null,
    cidade: null,
    estado: null
  }

  onSubmit(form: any) {
    console.log(form);

    //console.log(this.usuario);

    this.http.post('https://httpbin.org/post', JSON.stringify(form.value))
      .pipe(map((res: any) => res))
      .subscribe(res => this.populaDadosForm(res, form));
  }

  constructor(
    private http: HttpClient,
    private cepService: ConsultaCepService
  ) { }

  ngOnInit(): void {

  }

  verificaValidTouched(campo: { valid: any; touched: any; }) {
    return campo.valid && campo.touched;
  }

  verificaIsValidTouched(campo: { valid: any; touched: any; }) {
    return !campo.valid && campo.touched;
  }

  aplicaCssError(campo: { valid: any; touched: any; }) {
    return {
      'is-valid': this.verificaValidTouched(campo),
      'is-invalid': this.verificaIsValidTouched(campo)
    }
  }

  // API CEP
  consultaCEP(cep: any, form: any) {
    //Nova variável "cep" somente com dígitos.
    cep = cep.replace(/\D/g, '');

    if (cep != null && cep !== '') {
      this.cepService.consultaCEP(cep)
        .subscribe(dados => this.populaDadosForm(dados, form));
    }
  }

  populaDadosForm(dados: any, formulario: any) {
    formulario.setValue({
      area: {
        curso: ""
      },
      nome: formulario.value.nome,
      email: formulario.value.email,
      celular: null,
      endereco: {
        cep: dados.cep,
        complemento: dados.complemento,
        rua: dados.logradouro,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    });

    formulario.form.patchValue({
      endereco: {
        complemento: dados.complemento,
        rua: dados.logradouro,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    });
  }

  resetaDadosForm(formulario: any) {
    formulario.form.patchValue({
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
