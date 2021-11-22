import { Group } from "../entity/Group";
const mjml2html = require("mjml");

export class WeeklyTemplate {


    constructor(private groups: Group[]) {
    }

    private htmlSoftware(group: Group): string {
        let html = '';

        let versions = group.versions;
        versions = versions.sort((a, b) => {
            if(a.isUpdated == b.isUpdated){
                return a.software.name.localeCompare(b.software.name);
            }
            if(a.isUpdated){
                return 1;
            }
            return -1;
        });

        for (let i = 0; i < versions.length; i++) {
            let version = versions[i];
            let color = version.isUpdated ? 'green' : 'orange';
            let updatedText = version.isUpdated ? 'Updated' : 'Update available';
            html += `
            <mj-section>
                <mj-column>
                    <mj-text font-size="18px" font-family="Roboto" font-weight="bold">${version.software.name}</mj-text>
                </mj-column>
                <mj-column>
                    <mj-button align="right" background-color="transparent" color="${color}" border="1px solid ${color}">${updatedText}</mj-button>
                </mj-column>
            </mj-section>
            <mj-section>
                <mj-column>
                    <mj-text> Current version : ${version.version ? version.version.toString() : 'N/A'} </mj-text>
                </mj-column>
                <mj-column>
                    <mj-text> Latest version : ${version.software.latestVersion ? version.software.latestVersion.toString() : 'N/A'} </mj-text>
                </mj-column>
            </mj-section>
            `
            // if not last, add divider
            if (i != versions.length - 1) {
                html += `
                <mj-divider border-width="1px" width="75%"></mj-divider>
                `;
            }
        }
        return html;
    }

    private htmlGroups(): string {
        let html = '';
        for (let group of this.groups) {
            html += `
            <mj-section>
                <mj-column>
                <mj-text font-size="24px" font-family="Roboto" font-weight="bold">
                    ${group.name}
                </mj-text>
                </mj-column>
            </mj-section>
            <mj-wrapper background-color="white">
                ${this.htmlSoftware(group)}
            </mj-wrapper>
            `
        }
        return html;
    }

    render() {
        let template = `
        <mjml>
            <mj-body background-color="#f5f5f5">

                <mj-section>
                    <mj-column>
                        <mj-text font-size="48px" align="center" color="#1976d2" font-family="Roboto" font-weight="bold">Version Checker </mj-text>
                        <mj-divider border-color="#1976d2"></mj-divider>
                    </mj-column>
                </mj-section>
                ${this.htmlGroups()}
            </mj-body>
        </mjml>
        `;
        // console.log(template);
        return mjml2html(template);
    }

}