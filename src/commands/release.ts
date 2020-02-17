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
  This command updates .drone.yaml docker tag value, helm chart values.yaml (image.tag) and Chart.yaml (appVersion) to be the version provided as argument.
  Note: Chart version should be updated manually.`;

  static examples = [
    `$ ftctl release -v 0.1.0-beta.1 -p <path-to-chart> -f <values.yaml filename> -d ."
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
    }),
    // flag with a value (-f, --file=VALUE)
    file: flags.string({
      char: "f",
      description: "file name of values.yaml "
    }),
    // flag with a value (-d, --drone=VALUE)
    drone: flags.string({
      char: "d",
      description: "path to .drone.yaml folder"
    })
    // flag with a value (-m, --msg=VALUE)
    // msg: flags.string({
    //   char: "m",
    //   description: "git commit message"
    // })
  };

  static args = [{ name: "string" }];

  async run() {
    const { flags } = this.parse(Release); // const { args, flags } = this.parse(Release);
    const version: string = flags.version as string;

    const path = flags.path;
    const file = flags.file;
    const drone = flags.drone;
    // const msg = flags.msg;
    // this.log("Path: ", nodePath.resolve(process.cwd(), String(path), ".."));
    // const git = simplegit(nodePath.resolve(process.cwd(), String(path), "..")); // set up git command in the working directory

    if (!version) {
      this.log(
        "Argument version (-v/--version) not found, aborting build trigger."
      );
      return;
    }

    if (!path) {
      this.log(
        "Argument version (-p/--path) not found, aborting build trigger."
      );
      return;
      // path = __dirname.concat("/Chart.yaml");
    }

    if (!file) {
      this.log(
        "Argument version (-f/--file) not found, aborting build trigger."
      );
    }

    if (!drone) {
      this.log(
        "Argument version (-d/--drone) not found, aborting build trigger."
      );
      return;
    }

    // if (!msg) {
    //   this.log(
    //     "Argument version (-m/--msg) not found, aborting build trigger."
    //   );
    //   return;
    // }

    /**
     * Step 1. Update .drone.yaml image tag values.
     */
    this.log("Updating .drone.yaml...");
    const dronePath = nodePath.resolve(process.cwd(), drone + "/.drone.yaml");
    this.log(dronePath);
    // const droneContent = fs.readFileSync(dronePath, ENCODING);
    fs.readFile(dronePath, function(err, data) {
      if (err) throw err;
      let fileData = data.toString();
      const regex = /-\s+echo\s-n\s.+\s>\s\.tags/i;
      fileData = fileData.replace(regex, `- echo -n "${version}" > .tags`);
      fs.writeFile(dronePath, fileData, function(err) {
        // eslint-disable-next-line no-console
        if (err) console.log(err);
      });
    });

    /**
     * Step 2. Update Chart.yaml and values.yaml's appVersion and image.tag values.
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
    const valuesPath = nodePath.resolve(process.cwd(), path + "/" + file); // values.yaml");
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
     * Step N. Upload new chart to chartmuseum. (Deprecated)
     */
    // this.log("Uploading charts...");
    // const chartFolderPath = nodePath.resolve(process.cwd(), path);
    // spawn("helm", ["push", chartFolderPath, "-f", "chartmuseum"], {
    //   stdio: "inherit" // Will use process .stdout, .stdin, .stderr
    // });

    /**
     * Step N. Execute git tag and git tag push to trigger Drone CI build. (deprecated)
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
