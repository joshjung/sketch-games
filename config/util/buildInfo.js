let pkg = require('../../package.json');
let fs = require('fs');

let exec = require('child_process').exec;
let gitBranchCmd = 'git branch | grep \\* | cut -d \' \' -f2';
let gitHashCmd = 'git rev-parse --short HEAD';
let gitLastCommit = 'git log --name-status HEAD^..HEAD';

module.exports = function(callback) {
  let build = {
    git: {}
  };

  // 1) Inject package.json
  build.version = pkg.version;
  build.package = pkg;

  // 2) Inject git branch
  exec(gitBranchCmd, function(error, stdout, stderr) {
    build.git.branch = stdout.replace('\n', '');

    // 3) Inject git hash
    exec(gitHashCmd, function(error, stdout, stderr) {
      build.git.commitHash = stdout.replace('\n', '');

      // 3) Inject commit details
      exec(gitLastCommit, function(error, stdout, stderr) {
        build.git.commitDetails = stdout.split('\n');

        callback(build);
      });
    });
  });
};