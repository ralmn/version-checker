<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="auto">
        <h1 class="app-name">Version Checker</h1>
        <h2 class="sub-title">Need to track your software versions?</h2>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="auto">
        <v-sheet>
          <v-container>
            <v-row>
              <v-col cols="12">
                <p>
                  Version Checker helps you keep your cloud infrastructure, or
                  your application list up to date.
                </p>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="auto">
                <v-btn color="primary" to="/register">Start</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-sheet>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="4" sm="12">
        <v-sheet>
          <v-container>
            <v-row align="center">
              <v-col cols="6">
                <v-img src="/landingpage/groups.png" class="grey lighten-2" />
              </v-col>
              <v-col cols="6">
                <p>
                  A kubernetes cluster? A development server? You can add
                  multiple software groups.
                </p>
              </v-col>
            </v-row>
          </v-container>
        </v-sheet>
      </v-col>
      <v-col md="4"  sm="12">
        <v-sheet>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-img
                  src="/landingpage/traefik-available.png"
                  class="grey lighten-2" />
              </v-col>
            </v-row>
            <v-row align="center">
              <v-col cols="12">
                <p>Quickly see the out-of-date software</p>
              </v-col>
            </v-row>
          </v-container>
        </v-sheet>
      </v-col>
      <v-col md="4"  sm="12">
        <v-sheet>
          <v-container>
            <v-row align="center">
              <v-col cols="12">
                <p>Quickly see the out-of-date software</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-img
                  src="/landingpage/grafana-fast-select.png"
                  aspect-ratio="2.5"
                  class="grey lighten-2" />
              </v-col>
            </v-row>
          </v-container>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component
export default class LandingPage extends Vue {}
</script>

<style>
.app-name {
  font-size: 5rem;
  text-align: center;
}

.sub-title {
  font-size: 1rem;
  text-align: center;
}
</style>
