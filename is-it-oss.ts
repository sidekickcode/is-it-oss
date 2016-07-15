import { exec } from "child_process";

/**
 * ls-remote works fine for HTTPS repos. otherwise
 * the public/priv key is rejected.
 *
 * could just use HTTPS.
 */

export interface OssStatus {
  oss: boolean;
}

export default function(repoUrl: string): Promise<OssStatus> {
  return new Promise((resolve, reject) => {

    const keyPath = "/tmp/key";
    exec([
      `printf '%s' "$PRIVATE_KEY" > ${keyPath}`,
      `&& chmod u=r,o=,g= ${keyPath}`,
      `&& GIT_SSH_COMMAND='ssh -i ${keyPath}' git ls-remote '${repoUrl}'`,
      `; rm -f ${keyPath}`
    ].join(" "), {
      shell: "/bin/sh",
      env: {
        HOME: "/tmp",
        PRIVATE_KEY: process.env.PRIVATE_KEY
      },
    }, (err, stdout) => {
      if(err) {
        resolve({ oss: false });
      } else if(/HEAD/.test(stdout)) {
        resolve({ oss: true });
      } else {
        resolve({ oss: false });
      }
    });

  });
};

const validRe = /^(https:\/\/|git@)\S+$/;

export function validRepoUrl(url: string) {
  return validRe.test(url);
}

