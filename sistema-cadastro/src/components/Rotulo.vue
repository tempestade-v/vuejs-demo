<template>
  <div class="rotulo">
    <form>
      <strong align="center" v-if="opcional"
        >{{ nome }}<small> (opcional) </small></strong
      >
      <strong align="center" v-if="!opcional">{{ nome + "*" }}</strong>
      <slot />
    </form>
  </div>
</template>

<script>
export default {
  props: {
    nome: String,
    opcional:Boolean,
  },

};
</script>

<style></style>
