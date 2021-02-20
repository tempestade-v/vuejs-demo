<template>
  <div class="usuarios">
    <b-list-group-item class="mt-2" v-for="(usuario, id) in usuarios" :key="id">
      <div class="row">
        <div class="col-md-4 dados-cliente">
          <h4>{{ usuario.nome }}</h4>
          <br />
          <span><strong>tel:</strong>{{ usuario.tel }}</span>
        </div>
        <div class="col-md-5 endereco-cliente">
          <span>
            <strong>{{ usuario.endereco.bairro }}</strong>
          </span>
          <br />
          <span>
            {{
              `${usuario.endereco.logradouro}${
                usuario.endereco.numero == ""
                  ? ""
                  : ", " + usuario.endereco.numero
              }`
            }}
          </span>
          <br />
          <span>{{ usuario.endereco.complemento }}</span>
          <br />
          <span>taxa:{{ usuario.endereco.taxa | moneyBRL }}</span>
        </div>
        <div class="col-md-3 editar-cliente">
          <b-button variant="danger" class="w-100" @click="excluirFn(id)">
            Excluir
          </b-button>
          <b-button
            variant="warning"
            class="w-100 mt-2"
            @click="editarFn(usuario, id)"
          >
            Editar
          </b-button>
        </div>
      </div>
    </b-list-group-item>
  </div>
</template>

<script>
export default {
  props: {
    usuarios: {
      required: true,
    },
    excluirFn: {
      required: true,
    },
    editarFn: {
      required: true,
    },
  },
};
</script>

<style>
.usuarios strong {
  font-size: 20px;
}
</style>
