<template>
  <div id="listaUsuarios" class="mt-3">
    <h1 align="center">LISTA DE CLIENTES</h1>
    <b-button class="att mt-4 w-100" @click="atualizarListaUsuarios"
      >Atualizar
    </b-button>
    <b-input @input="inputBuscaFN($event)" />
    <b-list-group style="overflow-y: scroll; height: 80vh">
      <Usuarios
        :usuarios="usuariosFiltrados"
        :excluirFn="excluirUsuario"
        :editarFn="editarUsuario"
      />
    </b-list-group>
  </div>
</template>

<script>
import Usuarios from "./Usuarios.vue";
export default {
  components: {
    Usuarios,
  },
  props: {
    busca: {
      required: true,
    },
    usuariosFiltrados: {
      required: true,
    },
    usuarios: {
      required: true,
    },
    excluirUsuario: {
      required: true,
      type: Function,
    },
    editarUsuario: {
      required: true,
      type: Function,
    },
    atualizarListaUsuarios: {
      required: true,
      type: Function,
    },
  },
  methods: {
    inputBuscaFN($event) {
      this.$emit("inputBuscaAtt", $event);
    },
  },
};
</script>

<style>

#listaUsuarios button.att,
#listaUsuarios button.att:hover,
#listaUsuarios button.att:active,
#listaUsuarios button.att:visited,
#listaUsuarios button.att:focus {
  background-color: rgb(44, 4, 44);
}
</style>
