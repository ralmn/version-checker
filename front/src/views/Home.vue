<template>
  <div>
    <LandingPage v-if="!isLogged" />
    <Dashboard v-if="isLogged" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import LandingPage from "../components/LandingPage.vue";
import Dashboard from "../components/Dashboard.vue";

@Component({
  components: { LandingPage, Dashboard },
})
export default class Home extends Vue {
  @Watch("$store.state")
  get isLogged() {
    return this.$store.getters.isLogged;
  }
}
</script>
