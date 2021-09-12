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
          <v-col cols="auto"  :class="!(soft.groupVersion && soft.latestVersion) ? 'mr-auto' : '' ">
            <h2>
              <v-icon v-if="soft.type == 'GithubSoftware'">mdi-github</v-icon>
              {{ soft.name }}
            </h2>
          </v-col>
          <v-col cols="auto"  class="mr-auto" v-if="soft.groupVersion && soft.latestVersion">
            <v-chip v-if="softwareIsUpdated(soft)" color="green" outlined label
              >Updated</v-chip
            >
            <v-chip v-else color="orange" outlined label
              >Update available</v-chip
            >
          </v-col>
          <v-col cols="auto" order="-1">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on" @click="editSoftware(soft)">
                  <v-icon> mdi-update </v-icon>
                </v-btn>
              </template>
              Change version
            </v-tooltip>
          </v-col>
        </v-row>
        <v-row>
          <v-col>Current version : {{ soft.groupVersion || "Unknowed" }}</v-col>
          <v-col>Latest version : {{ soft.latestVersion || "Unknowed" }}</v-col>
        </v-row>
        <v-row>
          
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
    <SoftwareEdit
      v-if="softwareEdit"
      v-model="softwareEdit"
      :group="group"
      @close="softwareEdit = null"
      @update="updateFromSoftwareEdit"
    />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Model, Watch, ModelSync } from "vue-property-decorator";
import {
  IGroup,
  ISoftware,
  softwareIsUpdated as _softwareIsUpdated,
} from "../object/IGroup";
import SoftwareEdit from "./SoftwareEdit.vue";

@Component({
  components: { SoftwareEdit },
})
export default class Group extends Vue {
  @ModelSync('_group', 'update') group!: IGroup;

  softwareEdit: ISoftware | null = null;

  softwareIsUpdated(soft: ISoftware) {
    return _softwareIsUpdated(soft);
  }

  addSoftware() {
    this.softwareEdit = {};
  }

  editSoftware(soft: ISoftware){
    this.softwareEdit = soft;
  }

  updateFromSoftwareEdit(software: ISoftware){
    if(software?.name){
      let index = this.group.softwares.findIndex(s => s.name == software.name)
      if(index != -1 ){
        this.group.softwares[index] = software;
      }else{
        this.group.softwares.push(software);
      }
      this.$emit('update', this.group);
    }
  }

}
</script>

<style>
</style>