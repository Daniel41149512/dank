const { execSync } = require('child_process');

function buildWasm(pkg, buildCommand) {
    buildCommand.push(pkg);

    const underscoredName = pkg.replace(/-/g, '_');

    console.log(`Building ${underscoredName}.wasm`);
    execSync(buildCommand.join(' '));

    const optCommand = [
        'ic-cdk-optimizer',
        `target/wasm32-unknown-unknown/release/${underscoredName}.wasm`,
        '-o',
        `target/wasm32-unknown-unknown/release/${underscoredName}-opt.wasm`,
    ];

    console.log(`Running ic-cdk-optimizer on ${underscoredName}.wasm`);
    execSync(optCommand.join(' '));
}

let buildType = (process.env.BUILD_TYPE || "Release").toUpperCase();
console.log(`Building in ** ${buildType} ** mode`);

let buildCommand = "";
switch (buildType)
{
    case "DEBUG":
        buildCommand =
        [
            'cargo',
            'build',
            '--target',
            'wasm32-unknown-unknown',
            '--debug',
            '--package',
        ]
    default:
        buildCommand =
        [
            'cargo',
            'build',
            '--target',
            'wasm32-unknown-unknown',
            '--release',
            '--package',
        ]
}

buildWasm('xtc-history-bucket', [...buildCommand]);
buildWasm('xtc-history-e2e', [...buildCommand]);
buildWasm('xtc', [...buildCommand]);
