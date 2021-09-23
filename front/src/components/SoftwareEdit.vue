<template>
  <v-dialog
    origin="top center"
    ref="dialog"
    :value="software != null"
    @click:outside="close">
    <v-card>
      <v-card-title v-if="dbSoftware != null">
        Edit software
        <v-spacer></v-spacer>
        <v-btn icon @click="close"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>
      <v-card-title v-else>
        Add software
        <v-spacer></v-spacer>
        <v-btn icon @click="close"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>
      <div v-if="dbSoftware != null">
        <v-container>
          <v-row>
            <v-col>
              <h2>
                <v-icon v-if="dbSoftware.type == 'GithubSoftware'">
                  mdi-github
                </v-icon>
                {{ dbSoftware.name }}
              </h2>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-combobox
                label="Version"
                :items="softwareVersions"
                v-model="currentVersion"></v-combobox>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn
                color="primary"
                :disabled="!currentVersion"
                @click="saveSoftware">
                Save
              </v-btn>
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
              <v-combobox
                label="Name"
                v-model="softwareSelected"
                :search-input.sync="searchSoftware"
                :items="softwaresNames"
                item-text="name">
                <template v-slot:item="data">
                  <v-icon v-if="data.item.type == 'GithubSoftware'">
                    mdi-github
                  </v-icon>
                  {{ data.item.name }}
                </template>
                <template v-slot:selection="data">
                  <span v-if="typeof data.item == 'string'">
                    <v-icon v-if="data.item.indexOf('github:') === 0">
                      mdi-plus
                    </v-icon>
                    {{ data.item }}
                  </span>
                  <span v-else>
                    <v-icon v-if="data.item.type == 'GithubSoftware'">
                      mdi-github
                    </v-icon>
                    {{ data.item.name }}
                  </span>
                </template>
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title
                        v-if="
                          searchSoftware &&
                          searchSoftware.indexOf('github:') == 0
                        ">
                        <span v-if="/(.+)\/(.+)/.test(searchSoftware)">
                          For register github repository
                          <code>
                            {{ searchSoftware.replace("github:", "") }}
                          </code>
                          on Version Checker, Press
                          <kbd>enter</kbd>
                          and click on
                          <v-btn small color="primary">Add</v-btn>
                          button
                        </span>
                        <span v-else>
                          Please use format :
                          <code>
                            github:&lt;github user&gt;/&lt;github repository&gt;
                          </code>
                        </span>
                      </v-list-item-title>
                      <v-list-item-title v-else-if="searchSoftware == null">
                        Please indicate software
                      </v-list-item-title>
                      <v-list-item-title v-else>
                        Software
                        <code>{{ searchSoftware }}</code>
                        is not known
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-combobox>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <p>Missing your software ?</p>
              <ul>
                <li>
                  Your software use github release ? register him with type
                  <code>
                    github:&lt;github user&gt;/&lt;github repository&gt;
                  </code>
                </li>
                <li>
                  Else, you can request an integration on
                  <a
                    target="_blank"
                    href="https://github.com/ralmn/version-checker">
                    Version Checker's github repository
                  </a>
                  (create an issue)
                </li>
              </ul>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn
                color="primary"
                :disabled="addBtnDisabled"
                @click="addSoftware">
                Add
              </v-btn>
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
  private softwareSelected: string | ISoftware | null = null;
  private currentVersion: string | null = null;
  private searchSoftware: string | null = null;

  mounted() {
    this.initSoftware();

    let groupSoftwareName = this.group.softwares.map((s) => s.name);

    axios
      .get("/api/software/list", {
        headers: {
          authorization: `Bearer ${this.$store.state.token}`,
        },
      })
      .then((res) => {
        let { data } = res;
        this.softwaresNames = data.softwares
          .map((s: any) => {
            return { name: s.name, type: s.type };
          })
          .filter((s: ISoftwareSearch) => !groupSoftwareName.includes(s.name))
          .reverse();
      });
  }

  @Watch("software")
  initSoftware() {
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
    if (typeof this.softwareSelected == "string") {
      if (this.softwareSelected.indexOf("github:") == 0) {
        let softwareName = this.softwareSelected.substring(7);

        axios
          .post(
            "/api/software/add/github",
            {
              repo: softwareName,
            },
            {
              headers: {
                authorization: `Bearer ${this.$store.state.token}`,
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => {
            let { data } = res;
            debugger;
            if (data.ok) {
              let s = data.software;
              this.registerSoftware(s.name);
            } else {
              //todo : Handle error
            }
          });
      } else {
        //TODO Handle ?
      }

      return;
    } else {
      this.registerSoftware((this.softwareSelected as ISoftware).name!);
    }
  }

  registerSoftware(name: string) {
    debugger;
    axios
      .post(
        `/api/user/group/${this.group.id}/software/add`,
        {
          name,
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

  saveSoftware() {
    axios
      .post(
        `/api/user/group/${this.group.id}/software/${
          this.dbSoftware!.name
        }/version`,
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
          this.$emit("update", software);
          this.dbSoftware = software;
          this.close();
        } else {
          // TODO : handle error
        }
      })
      .catch((err) => {
        // TODO : handle error
      });
  }

  get softwareVersions() {
    return this.dbSoftware?.versions?.reverse() || [];
  }

  get addBtnDisabled() {
    if (this.softwareSelected == null) return true;
    if (
      typeof this.softwareSelected === "string" &&
      this.softwareSelected.indexOf("github:") != 0
    )
      return true;
    return false;
  }

  close() {
    //this.software = null;
    this.$emit("close");
  }
}
</script>

<style></style>
