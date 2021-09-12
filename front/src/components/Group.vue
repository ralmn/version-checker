<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>{{ group.name }}</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col> </v-col>
    </v-row>
    <v-row v-for="soft in group.softwares" :key="soft.name">
      <v-container>
        <v-row>
          <v-col cols="auto">
            <h2>
              <v-icon v-if="soft.type == 'GithubSoftware'">mdi-github</v-icon>
              {{ soft.name }}
            </h2>
          </v-col>
          <v-col cols="auto" v-if="soft.groupVersion">
            <v-chip v-if="softwareIsUpdated(soft)" color="green" outlined label
              >Updated</v-chip
            >
            <v-chip v-else color="orange" outlined label
              >Update available</v-chip
            >
          </v-col>
        </v-row>
        <v-row>
          <v-col v-if="soft.groupVersion">Current version : {{ soft.groupVersion }}</v-col>
          <v-col v-else>Current version : <i>Unknowned</i></v-col>
          <v-col>Latest version : {{ soft.latestVersion }}</v-col>
        </v-row>
        <v-divider
          v-if="group.softwares.indexOf(soft) < group.softwares.length - 1"
        ></v-divider>
      </v-container>
    </v-row>

    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          elevation="2"
          class="mx-2"
          fab
          bottom
          fixed
          right
          large
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
          @click="addSoftware"
        >
          <v-icon dark> mdi-plus </v-icon></v-btn
        >
      </template>
      <span>Add software</span>
    </v-tooltip>
    <SoftwareEdit v-model="softwareEdit" :group="group"  @close="softwareEdit = null" />
  </v-container>

</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Model, Watch } from "vue-property-decorator";
import {
  IGroup,
  ISoftware,
  softwareIsUpdated as _softwareIsUpdated,
} from "../object/IGroup";
import SoftwareEdit from './SoftwareEdit.vue'

@Component({
  components: {SoftwareEdit}
})
export default class Group extends Vue {
  @Prop() group!: IGroup;

  softwareEdit: ISoftware | null = null;

  softwareIsUpdated(soft: ISoftware) {
    return _softwareIsUpdated(soft);
  }

  addSoftware(){
    this.softwareEdit = {}
  }
}
</script>

<style>
</style>