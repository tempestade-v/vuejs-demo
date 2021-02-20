<template>
  <div id="app">
    <nav id="nav-bar">
      <ul>
        <li class="nav-page" @click="navegacaoFn('Cadastro')">
          <img src="./assets/navIcons/cadastro.png" alt="Cadastro" />
          <div class="currentPageDot" v-show="navegacao == 'Cadastro'"></div>
        </li>
        <li class="nav-page" @click="navegacaoFn('ListaUsuarios')">
          <img
            src="./assets/navIcons/listaUsuarios.png"
            alt="Lista de usuarios"
          />
          <div
            class="currentPageDot"
            v-show="navegacao == 'ListaUsuarios'"
          ></div>
        </li>
      </ul>
    </nav>
    <div id="paginaAtual">
      <Cadastro
        v-show="navegacao == 'Cadastro'"
        :usuario="usuario"
        :ruas="ruas"
        :limparCampos="limparCampos"
        :salvarUsuario="salvarUsuario"
        :getEnderecoByCep="getEnderecoByCep"
        :getEnderecoByRua="getEnderecoByRua"
        :getDistancia="getDistancia"
        :queryAdress="queryAdress"
        :isDistanciaFilled="isDistanciaFilled"
      />
      <ListaUsuarios
        v-show="navegacao == 'ListaUsuarios'"
        :busca="busca"
        :usuarios="usuarios"
        :excluirUsuario="excluirUsuario"
        :editarUsuario="editarUsuario"
        :atualizarListaUsuarios="atualizarListaUsuarios"
        :usuariosFiltrados="usuariosFiltrados"
        @inputBuscaAtt="busca = $event"
      />
    </div>
  </div>
</template>

<script>
import Cadastro from "./components/Cadastro.vue";
import ListaUsuarios from "./components/ListaUsuarios.vue";
import axios from "axios";

export default {
  components: {
    Cadastro,
    ListaUsuarios,
  },
  data() {
    return {
      /* usuario */
      usuarios: [],
      usuario: {
        id: "",
        nome: "",
        tel: "",
        endereco: {
          cep: "",
          bairro: "",
          logradouro: "",
          numero: "",
          complemento: "",
          distancia: "",
          taxa: "",
        },
      },
      /* sistema */
      navegacao: "Cadastro",
      busca: "",
      ruas: [],
      isEditing: false,
      isDistanciaFilled: false,
    };
  },
  computed: {
    /* Cadastro */
    queryAdress() {
      let objEndereco = {
        cep: this.usuario.endereco.cep,
        bairro: this.usuario.endereco.bairro,
        logradouro: this.usuario.endereco.logradouro,
        numero: this.usuario.endereco.numero,
      };

      let getKey = (key) => [objEndereco[key]];
      let removeParentesis = (string) =>
        string.toString().replace(/\([^(]*\)/g, "");
      let ifVazio = (info) => (info == "" ? `` : `${info}+`);
      let concat = (acumulador, valorAtual) => acumulador + valorAtual;

      let query = Object.keys(objEndereco)
        .map(getKey)
        .map(removeParentesis)
        .map(ifVazio)
        .reduce(concat);

      return { query, objEndereco };
    },
    /* Lista */
    usuariosFiltrados() {
      let obj = {};

      for (let usuario in this.usuarios) {
        if (this.usuarios[usuario].tel.includes(this.busca)) {
          obj[usuario] = this.usuarios[usuario];
        }
      }

      return obj;
    },
  },
  methods: {
    /* APP */
    navegacaoFn(param) {
      this.navegacao = param;
    },

    /* Cadastro*/
    limparCampos() {
      /* usuario */
      this.usuario.id = "";
      this.usuario.nome = "";
      this.usuario.tel = "";
      this.usuario.endereco.cep = "";
      this.usuario.endereco.bairro = "";
      this.usuario.endereco.logradouro = "";
      this.usuario.endereco.numero = "";
      this.usuario.endereco.complemento = "";
      this.usuario.endereco.distancia = "";
      this.usuario.endereco.taxa = "";

      /* sistema */
      this.ruas = "";
      this.isDistanciaFilled = false;
    },
    async salvarUsuario() {
      try {
        let usuarioOBJ = {
          nome: this.usuario.nome,
          telefone: this.usuario.tel,
          ...this.queryAdress.objEndereco,
        };

        const getKey = (key) => [usuarioOBJ[key]];
        const isVazio = (campo) => campo.toString().replace(/\s/g, "") == "";
        const someVazio = (acumulador, valorAtual) => acumulador || valorAtual;

        let isCamposVazios = Object.keys(usuarioOBJ)
          .map(getKey)
          .map(isVazio)
          .reduce(someVazio);

        if (isCamposVazios) {
          alert("campo vazio.");
        } else if (this.usuario.endereco.distancia > 5) {
          alert("distancia maior que 5KM");
        } else {
          let metodo = "";
          let listaUsuarios = "";
          let idAtual = this.usuario.id;

          if (this.usuarios == undefined || this.usuarios == null) {
            metodo = "post";
          } else {
            listaUsuarios = Object.keys(this.usuarios);
            metodo = listaUsuarios.includes(idAtual) ? "patch" : "post";
          }

          let url =
            metodo == "post" ? `usuarios.json` : `/usuarios/${idAtual}.json`;

          /* put user id inside the object to easy some manipulations */
          let addIdUser = (idUsuario) => {
            let id = idUsuario.data.name;

            if (metodo == "post") {
              this.usuario.id = id;
              metodo = "patch";
              this.$http[metodo](`/usuarios/${id}.json`, this.usuario).then();
            }
          };

          this.$http[metodo](url, this.usuario).then((id) => {
            addIdUser(id);
            this.limparCampos();
            this.atualizarListaUsuarios();
          });
        }
      } catch (err) {
        console.log(`message: ${err.message},code: ${err.code}`);
      }
    },
    async getEnderecoByRua(select) {
      try {
        let inputRua = this.usuario.endereco.logradouro;

        let selectRua = (res) => {
          this.usuario.endereco.cep = res.data[0].cep;
          this.usuario.endereco.bairro = res.data[0].bairro;
          this.usuario.endereco.logradouro = res.data[0].logradouro;
          this.ruas = "";
        };

        if (inputRua.length > 3) {
          const res = await this.$http.get(
            `https://viacep.com.br/ws/SP/Sao Paulo/${inputRua}/json/`
          );

          let listaRuas = res.data;
          listaRuas.forEach((rua) => {
            rua.logradouro = rua.logradouro
              .replace(/[ÀÁÂÃÄÅ]/, "A")
              .replace(/[àáâãäå]/, "a")
              .replace(/[ÈÉÊË]/, "E")
              .replace(/[èéêë]/, "e")
              .replace(/[Ç]/, "C")
              .replace(/[ç]/, "c");
          });
          this.ruas = listaRuas;

          let comparaString = (a, b) => {
            return a.toLowerCase() == b.toLowerCase();
          };

          if (select == true) {
            selectRua(res);
          } else if (comparaString(inputRua, res.data[0].logradouro)) {
            selectRua(res);
          }
        }
      } catch (err) {
        console.log(`message: ${err.message},code: ${err.code}`);
      }
    },
    async getEnderecoByCep() {
      if (this.usuario.endereco.cep.length == 9) {
        try {
          const resJSON = await axios(
            `https://viacep.com.br/ws/${this.usuario.endereco.cep}/json/`
          );

          this.usuario.endereco.logradouro = resJSON.data.logradouro;
          this.usuario.endereco.complemento = resJSON.data.complemento;
          this.usuario.endereco.bairro = resJSON.data.bairro;
        } catch (err) {
          console.log(`message: ${err.message},code: ${err.code}`);
        }
      }
    },
    async getDistancia() {
      try {
        axios({
          method: "post",
          url: "http://localhost:7070/",
          data: {
            query: this.queryAdress.query,
          },
        }).then((res) => {
          let distancia = res.data.distancia;

          if (distancia == undefined) {
            this.usuario.endereco.distancia = "insira um endereco valido";
          } else {
            let isDistanciaEmMetros = distancia.indexOf(" m") > -1;
            let isDistanciaEmKm = distancia.indexOf(" km") > -1;
            if (isDistanciaEmMetros) {
              distancia = (parseFloat(distancia) / 1000).toFixed(2);
            } else if (isDistanciaEmKm) {
              distancia = parseFloat(distancia).toFixed(1);
            }

            this.usuario.endereco.distancia = distancia;

            if (this.usuario.endereco.distancia > 5) {
              this.usuario.endereco.taxa = "excede o limite de 5km";
            } else if (this.usuario.endereco.distancia > 1.0) {
              this.usuario.endereco.taxa = 5.0;
            } else {
              this.usuario.endereco.taxa = 3.0;
            }
            this.isDistanciaFilled = true;
          }
        });
      } catch (err) {
        console.log(`message: ${err.message},code: ${err.code}`);
      }
    },

    /* ListaUsuarios */
    async atualizarListaUsuarios() {
      try {
        const res = await this.$http.get("usuarios.json");
        this.usuarios = res.data;
      } catch (err) {
        console.log(`message: ${err.message},code: ${err.code}`);
      }
    },
    async excluirUsuario(id) {
      try {
        this.$http.delete(`usuarios/${id}.json`).then(() => {
          this.atualizarListaUsuarios();
        });
      } catch (err) {
        console.log(`message:${err.message}, code: ${err.code}`);
      }
    },
    editarUsuario(user, id) {
      this.limparCampos();
      this.navegacao = "Cadastro";
      this.usuario.id = id;
      this.usuario.nome = user.nome;
      this.usuario.tel = user.tel;
      this.usuario.endereco.cep = user.endereco.cep;
      this.usuario.endereco.bairro = user.endereco.bairro;
      this.usuario.endereco.logradouro = user.endereco.logradouro;
      this.usuario.endereco.numero = user.endereco.numero;
      this.usuario.endereco.complemento = user.endereco.complemento;
      this.usuario.endereco.taxa = user.endereco.taxa;
      this.isDistanciaFilled = true;
    },
  },
  created() {
    this.atualizarListaUsuarios();
  },
};
</script>

<style>
#app {
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 80px 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: "nav pagina";
  overflow: hidden;
}
#nav-bar {
  height: 100%;
  background-color: rgb(24, 17, 27);
  z-index: 10;
  display: flex;
  justify-content: center;
  grid-area: nav;
}
#nav-bar ul {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
#nav-bar ul .nav-page {
  width: 70px;
  height: 70px;
  background-color: rgb(223, 223, 223);
  margin-bottom: 3px;
  border-bottom: 3px solid gray;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
#nav-bar ul .nav-page:active {
  border-bottom: hidden;
}
#nav-bar ul .nav-page:hover {
  transform: scale(0.9);
  background-color: rgb(197, 151, 196);
  border-bottom: 3px solid rgb(88, 66, 88);
  transition: 0.5s;
}
#nav-bar .nav-page img {
  width: 40px;
}
#nav-bar .nav-page:hover > img {
  transform: rotate(360deg);
  transition: 0.5s ease-in-out;
}
#nav-bar ul .nav-page .currentPageDot {
  height: 10px;
  width: 10px;

  background-color: rgb(78, 11, 109);
  border-radius: 5px;
  position: absolute;
  right: 5px;
  bottom: 5px;
}
#paginaAtual {
  grid-area: pagina;
  width: 1600px;
  margin: 0 auto;
}
</style>
