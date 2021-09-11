<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>{{ group.name }}</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-container>
        <v-row v-for="soft in group.softwares" :key="soft.name">
          <v-container>
            <v-row>
              <v-col>
                <v-icon v-if="soft.type == 'GithubSoftware'">mdi-github</v-icon>
                {{ soft.name }}
              </v-col>
            </v-row>
            <v-row>
              <v-col> Your version : {{ soft.groupVersion }} </v-col>
              <v-col> Latest version : {{ soft.latestVersion }} </v-col>
            </v-row>
          </v-container>
        </v-row>
      </v-container>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Model, Watch } from "vue-property-decorator";
import { IGroup } from "../object/IGroup";

@Component
export default class Group extends Vue {
  @Prop() group!: IGroup;
}
</script>

<style>
</style>