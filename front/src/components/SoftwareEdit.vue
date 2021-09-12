<template>
  <v-dialog origin="top center" ref="dialog" :value="software != null" @click:outside="close" >
    <v-card>
      <v-card-title v-if="dbSoftware != null"
        >Edit software <v-spacer></v-spacer>
        <v-btn icon @click="close"><v-icon>mdi-close</v-icon></v-btn></v-card-title
      >
      <v-card-title v-else
        >Add software <v-spacer></v-spacer>
        <v-btn icon @click="close"
          ><v-icon>mdi-close</v-icon></v-btn
        ></v-card-title
      >
      <div v-if="dbSoftware != null">
        <v-container>
          <v-row>
            <v-col>
              <h2>
                <v-icon v-if="dbSoftware.type == 'GithubSoftware'"
                  >mdi-github</v-icon
                >{{ dbSoftware.name }}
              </h2>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-combobox
                label="Version"
                :items="softwareVersions"
                v-model="currentVersion"
              ></v-combobox>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn
                color="primary"
                :disabled="!currentVersion"
                @click="saveSoftware"
                >Save</v-btn
              >
            </v-col>
          </v-row>
        </v-container>
      </div>
      <div v-else>
        <v-container>
          <v-row>
            <v-col>
              <h2>Select software</h2>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-autocomplete
                label="Name"
                v-model="softwareSelected"
                :items="softwaresNames"
                item-text="name"
              >
                <template v-slot:item="data">
                  <!-- HTML that describe how select should render items when the select is open -->
                  <v-icon v-if="data.item.type == 'GithubSoftware'"
                    >mdi-github</v-icon
                  >{{ data.item.name }}
                </template>
                <template v-slot:selection="data">
                  <!-- HTML that describe how select should render items when the select is open -->
                  <v-icon v-if="data.item.type == 'GithubSoftware'"
                    >mdi-github</v-icon
                  >{{ data.item.name }}
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn
                color="primary"
                :disabled="softwareSelected == null"
                @click="addSoftware"
                >Add</v-btn
              >
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
import { Component, Model, Prop, Watch } from "vue-property-decorator";
import { IGroup, ISoftware } from "../object/IGroup";

interface ISoftwareSearch {
  name: string;
  type: string;
}

@Component
export default class SoftwareEdit extends Vue {
  private dbSoftware: ISoftware | null = null;
  @Model() software!: ISoftware | null;
  @Prop({ required: true }) group!: IGroup;

  private softwaresNames: ISoftwareSearch[] = [];
  private softwareSelected: string | null = null;
  private currentVersion : string | null = null;

  mounted() {

    this.initSoftware();

    let groupSoftwareName = this.group.softwares.map((s) => s.name);

    axios.get("/api/software/list").then((res) => {
      let { data } = res;
      this.softwaresNames = data.softwares
        .map((s: any) => {
          return { name: s.name, type: s.type };
        })
        .filter((s: ISoftwareSearch) => !groupSoftwareName.includes(s.name))
        .reverse();
    });
  }

  @Watch('software')
  initSoftware(){
    if (this.software != null && this.software.name != null) {
      //call server

      axios
        .get(
          `/api/user/group/${this.group.id}/software/${this.software.name}`,
          {
            headers: {
              authorization: `Bearer ${this.$store.state.token}`,
            },
          }
        )
        .then((res) => {
          let { data } = res;
          let gv = data.gv;
          let software: ISoftware = {
            name: gv.software.name,
            type: gv.software.type,
            versions: gv.software.versions,
            latestVersion: gv.software.latestVersion,
            groupVersion: gv.version,
          };
          this.dbSoftware = software;
          this.currentVersion = software.groupVersion || null;
        });
    }
  }

  searchNameValue(value: ISoftwareSearch) {
    return value.name;
  }

  addSoftware() {
    axios
      .post(
        `/api/user/group/${this.group.id}/software/add`,
        {
          name: this.softwareSelected!,
        },
        {
          headers: {
            authorization: `Bearer ${this.$store.state.token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        const { data } = res;
        if (data.ok) {
          let gv = data.gv;
          let software: ISoftware = {
            name: gv.software.name,
            type: gv.software.type,
            versions: gv.software.versions,
            latestVersion: gv.software.latestVersion,
            groupVersion: gv.version,
          };
          this.$emit("update:software", software);
          this.dbSoftware = software;
        }
      });
  }

  saveSoftware(){
    axios
      .post(
        `/api/user/group/${this.group.id}/software/${this.dbSoftware!.name}/version`,
        {
          version: this.currentVersion!,
        },
        {
          headers: {
            authorization: `Bearer ${this.$store.state.token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        const { data } = res;
        if (data.ok) {
          let gv = data.gv;
          let software: ISoftware = {
            name: gv.software.name,
            type: gv.software.type,
            versions: gv.software.versions,
            latestVersion: gv.software.latestVersion,
            groupVersion: gv.version,
          };
          //this.$emit("update:software", software);
          this.$emit('update', software);
          this.dbSoftware = software;
          this.close();
        }else{
          // TODO : handle error
        }
      }).catch(err => {
        // TODO : handle error
      });
  }

  get softwareVersions(){
    return this.dbSoftware?.versions?.reverse() || []
  }

  close() {
    //this.software = null;
    this.$emit("close");
  }
}
</script>

<style>
</style>