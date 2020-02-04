import { Command, flags } from "@oclif/command";
import * as fs from "fs";
import * as nodePath from "path";
import * as yaml from "js-yaml";
// import * as simplegit from "simple-git/promise";
// import { spawn } from "child_process";

const ENCODING = "utf8"; // string
// const NEWLINE = '\n';
// const EQUALS = '=';
// const REMOTE = process.env.REMOTE;

/**
 * Command for helping developers to trigger CI/CD pipeline.
 * Step 1. Update Chart.yaml and values.yaml's appVersion and image.tag values.
 * Step 2. Upload new chart to chartmuseum.
 * Step 3. Execute git tag and git tag push to trigger Drone CI build.
 *
 * Note: Chart version should be updated manually.
 */
export default class Release extends Command {
  static description = `
  This command updates helm chart values.yaml (image.tag) and Chart.yaml (appVersion) to be the version provided as argument.
After updating these values, it also performs upload the new chart and execute git tag and push tag. Note: Chart version should be updated manually.`;

  static examples = [
    `$ ftctl release-stage -v 0.1.0-beta.1 -p ../your-chart/
App versioned '0.1.0-beta.1' build and releasing to staging initiated.
`
  ];

  static flags = {
    help: flags.help({ char: "h" }),
    // flag with a value (-v, --version=VALUE)
    version: flags.string({
      char: "v",
      description: "version to build and release"
    }),
    // flag with a value (-p, --path=VALUE)
    path: flags.string({
      char: "p",
      description: "path to chart's root folder"
    })
  };

  static args = [{ name: "string" }];

  async run() {
    const { flags } = this.parse(Release); // const { args, flags } = this.parse(Release);
    const version: string = flags.version as string;
    // const git = simplegit();

    let path = flags.path;

    if (!version) {
      this.log(
        "Argument version (-v/--version) not found, aborting build trigger."
      );
    }

    if (!path) {
      path = __dirname.concat("/Chart.yaml");
    }

    /**
     * Step 1. Update Chart.yaml and values.yaml's appVersion and image.tag values.
     */
    this.log("Updating charts...");
    // Get Chart.yaml path
    const chartPath = nodePath.resolve(process.cwd(), path + "/Chart.yaml");
    const chartContent = fs.readFileSync(chartPath, ENCODING);
    const chartYaml = yaml.safeLoad(chartContent);

    // Update app version value with the version provided
    chartYaml.appVersion = version;
    // Serialise object
    const chartYamlStr = yaml.safeDump(chartYaml);
    // Save the file (Chart.yaml)
    fs.writeFileSync(chartPath, chartYamlStr, ENCODING);

    // Get values.yaml
    const valuesPath = nodePath.resolve(process.cwd(), path + "/values.yaml");
    const valuesContent = fs.readFileSync(valuesPath, ENCODING);
    const valuesYaml = yaml.safeLoad(valuesContent);

    // Update image tag version value with the version provided
    valuesYaml.image.tag = version;
    // Serialise object
    const valuesYamlStr = yaml.safeDump(valuesYaml);
    this.log(valuesYaml);
    // Save the file (values.yaml)
    fs.writeFileSync(valuesPath, valuesYamlStr, ENCODING);

    /**
     * Step 2. Upload new chart to chartmuseum.
     */
    // this.log("Uploading charts...");
    // const chartFolderPath = nodePath.resolve(process.cwd(), path);
    // spawn("helm", ["push", chartFolderPath, "-f", "chartmuseum"], {
    //   stdio: "inherit" // Will use process .stdout, .stdin, .stderr
    // });

    /**
     * Step 3. Execute git tag and git tag push to trigger Drone CI build.
     */
    // this.log("Git tagging and pushing...");
    // // Perform git tag
    // const tagResult = await git.addTag(version);
    // console.log(tagResult);
    // // Perform git push tag
    // const tagPushRes = await git.pushTags(REMOTE);
    // console.log(tagPushRes);

    // Output about the build
    this.log(`build and release ${version}`);
  }
}
