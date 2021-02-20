<template>
  <div id="cadastro" class="container mt-3">
    <h1 align="center">CADASTRO</h1>
    <div id="endereco">
      <div class="row">
        <div class="col-md-4">
          <Rotulo nome="CEP">
            <b-form-input
              type="text"
              v-model="usuario.endereco.cep"
              @keydown.enter.prevent=""
              @input="getEnderecoByCep"
              placeholder="ex: 04356-000"
              autocomplete="off"
              v-mask="'#####-###'"
            />
          </Rotulo>
        </div>
        <div class="col-md-8">
          <Rotulo nome="RUA">
            <b-form-input
              type="text"
              v-model.trim="usuario.endereco.logradouro"
              placeholder="Rua Jose Maria da Silva"
              autocomplete="off"
              list="emmet-rua"
              @input="getEnderecoByRua"
              @keydown.enter.prevent="getEnderecoByRua(true)"
            />
            <datalist id="emmet-rua">
              <option
                :value="rua.logradouro"
                v-for="(rua, index) in ruas"
                :key="index"
              ></option>
            </datalist>
          </Rotulo>
        </div>
      </div>
      <Rotulo nome="BAIRRO">
        <b-form-input
          type="text"
          v-model="usuario.endereco.bairro"
          placeholder="calculado ao inserir rua ou cep"
          autocomplete="off"
          @keydown.enter.prevent=""
          disabled
        />
      </Rotulo>
      <div class="row">
        <div class="col-md-4">
          <Rotulo nome="NÚMERO">
            <b-form-input
              type="number"
              v-model="usuario.endereco.numero"
              placeholder="número da residencia"
              autocomplete="off"
              @keydown.enter.prevent=""
            />
          </Rotulo>
        </div>
        <div class="col-md-8">
          <Rotulo nome="COMPLEMENTO" :opcional="true">
            <b-form-input
              type="text"
              v-model="usuario.endereco.complemento"
              placeholder="insira bloco, apartamento, etc..."
              autocomplete="off"
              @keydown.enter.prevent=""
            />
          </Rotulo>
        </div>
      </div>
      <b-button
        size="lg"
        variant="warning"
        class="mt-2 w-100"
        @click="getDistancia"
        >Calcular taxa
      </b-button>
      <div v-show="isDistanciaFilled">
        <b-alert
          show
          class="mt-2"
          variant="danger"
          v-if="usuario.endereco.distancia > 5"
        >
          {{ usuario.endereco.taxa }}
        </b-alert>
        <b-alert
          show
          class="mt-2"
          variant="warning"
          v-if="usuario.endereco.distancia <= 5"
        >
          Taxa: R$ {{ usuario.endereco.taxa }}
        </b-alert>
      </div>
    </div>
    <div id="identificacao" v-show="isDistanciaFilled">
      <div class="row">
        <div class="col-md-8">
          <Rotulo nome="nome">
            <b-form-input
              type="text"
              v-model="usuario.nome"
              placeholder="insira o nome"
              autocomplete="off"
              @keydown.enter.prevent=""
            />
          </Rotulo>
        </div>
        <div class="col-md-4">
          <Rotulo nome="telefone">
            <b-form-input
              type="tel"
              v-model="usuario.tel"
              placeholder="insira o telefone"
              autocomplete="off"
              @keydown.enter.prevent=""
              v-mask="'###########'"
            />
          </Rotulo>
        </div>
      </div>
    </div>
    <b-button
      size="lg"
      variant="primary"
      class="mt-2 w-100"
      @click="salvarUsuario"
      >Salvar
    </b-button>
  </div>
</template>

<script>
import Rotulo from "./Rotulo";
export default {
  components: {
    Rotulo,
  },
  props: {
    usuario: {
      required: true,
    },
    ruas: {
      required: true,
    },
    isDistanciaFilled: {
      required: true,
    },
    limparCampos: {
      required: true,
      type: Function,
    },
    salvarUsuario: {
      required: true,
      type: Function,
    },
    getEnderecoByRua: {
      required: true,
      type: Function,
    },
    getEnderecoByCep: {
      required: true,
      type: Function,
    },
    getDistancia: {
      required: true,
      type: Function,
    },
    queryAdress: {
      required: true,
    },
  },
};
</script>

<style>
#cadastro input{
  font-size: 27px;
  margin-bottom: 20px;
}
#cadastro input:disabled {
  background-color: rgb(218, 218, 218);
}
#cadastro input:disabled::placeholder {
  color: rgb(99, 99, 99);
}
</style>
