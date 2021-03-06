<template>
  <v-container>
    <v-row>
      <v-col cols="auto" class="mr-auto">
        <h1>{{ group.name }}</h1>
      </v-col>
      <v-col cols="auto" >
        <GroupEditor :group="group" />
      </v-col>
    </v-row>
    <v-row>
      <v-col></v-col>
    </v-row>
    <v-row v-for="soft in orderedSoftware" :key="soft.name">
      <v-container>
        <v-row>
          <v-col
            cols="auto"
            :class="
              !(soft.groupVersion && soft.latestVersion) ? 'mr-auto' : ''
            ">
            <h2>
              <a v-if="soft.type == 'GithubSoftware'" target="_blank" class="githubLink" :href="`https://github.com/${soft.repository}`">
                <v-icon >mdi-github</v-icon>
              </a>
              <a v-else-if="soft.type == 'DockerHubSoftware'" target="_blank" class="githubLink" :href="`https://hub.docker.com/r/${soft.repository}`">
                <v-icon >mdi-docker</v-icon>
              </a>
              {{ soft.name }}
            </h2>
          </v-col>
          <v-col
            cols="auto"
            class="mr-auto"
            v-if="soft.groupVersion && soft.latestVersion">
            <v-chip v-if="soft.isUpdated()" color="green" outlined label>
              Updated
            </v-chip>
            <v-chip v-else color="orange" outlined label>
              Update available
            </v-chip>
          </v-col>
          <v-col cols="auto" order="-1">
            <v-tooltip bottom v-if="group.yourRole <= 1">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  v-on="on"
                  @click="editSoftware(soft)">
                  <v-icon>mdi-update</v-icon>
                </v-btn>
              </template>
              Change version
            </v-tooltip>
          </v-col>
        </v-row>
        <v-row>
          <v-col>Current version : {{ (soft.groupVersion ? soft.groupVersion.versionRaw : null) || "Unknowed" }}</v-col>
          <v-col>
            Latest version : {{ (soft.latestVersionWithRequirements? soft.latestVersionWithRequirements.versionRaw : null) || "Unknowed" }}
            <span v-if="soft.latestVersionWithRequirements != soft.latestVersion">({{soft.latestVersion.versionRaw}})</span>

          </v-col>
        </v-row>
        <v-row></v-row>
        <v-divider
          v-if="
            group.softwares.indexOf(soft) < group.softwares.length - 1
          "></v-divider>
      </v-container>
    </v-row>

    <v-tooltip top v-if="group.yourRole <= 1">
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
          @click="addSoftware">
          <v-icon dark>mdi-plus</v-icon>
        </v-btn>
      </template>
      <span>Add software</span>
    </v-tooltip>
    <SoftwareEdit
      v-if="softwareEdit"
      v-model="softwareEdit"
      :group="_group"
      @close="softwareEdit = null"
      @update="updateFromSoftwareEdit" 
      @remove="removeSoftware"
      />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {
  Component,
  ModelSync
} from "vue-property-decorator";
import {
  IGroup,
  ISoftware
} from "../object/IGroup";
import SoftwareEdit from "./SoftwareEdit.vue";
import GroupEditor from "./GroupEditor.vue";

@Component({
  components: { SoftwareEdit, GroupEditor },
})
export default class Group extends Vue {
  @ModelSync("_group", "update") group!: IGroup;

  softwareEdit: ISoftware | null = null;

  addSoftware() {
    this.softwareEdit = new ISoftware();
  }

  editSoftware(soft: ISoftware) {
    this.softwareEdit = soft;
  }


  get orderedSoftware(): ISoftware[] {
    return this.group.softwares.sort((a, b) => {
      if( a.isUpdated() != b.isUpdated() ){
        return a.isUpdated() ? 1 : -1;
      }

      return a.name!.localeCompare(b.name!);
    })
  }

  updateFromSoftwareEdit(software: ISoftware) {
    if (software?.name) {
      let index = this.group.softwares.findIndex(
        (s) => s.name == software.name
      );
      if (index != -1) {
        this.group.softwares[index] = software;
      } else {
        this.group.softwares.push(software);
      }
      this.$emit("update", this.group);
    }
  }

  removeSoftware(software: ISoftware){
    let index = this.group.softwares.findIndex(
        (s) => s.name == software.name
      );
      if (index != -1) {
        this.group.softwares.splice(index, 1);
        this.$emit("update", this.group);
      }
      
  }
}
</script>

<style>

.githubLink {
  text-decoration: none;
}

</style>
