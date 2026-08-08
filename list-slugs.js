const fs = require("fs");
const path = require("path");
const files = fs.readdirSync("data").filter(f => f.endsWith(".json")).sort().reverse();
if (!files.length) { console.log("No data"); process.exit(1); }
const data = JSON.parse(fs.readFileSync(path.join("data", files[0]), "utf8"));
console.log("File:", files[0]);
console.log("\n=== Yesterday (should have Coldtea) ===");
(data.periods.yesterday ?? []).forEach((p, i) => console.log("  " + (i+1) + ". " + p.name + " → slug: \"" + p.slug + "\""));
console.log("\n=== Today ===");
(data.periods.today ?? []).forEach((p, i) => console.log("  " + (i+1) + ". " + p.name + " → slug: \"" + p.slug + "\""));
