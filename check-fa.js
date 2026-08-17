const fs = require("fs");
const f = fs.readdirSync("data").filter(x => x.endsWith(".json")).sort().reverse()[0];
const d = JSON.parse(fs.readFileSync("data/" + f, "utf8"));
const all = [...(d.periods.today ?? []), ...(d.periods.yesterday ?? [])];
const p = all.find(x => x.slug === "dograh-3") ?? all[0];
console.log("file:", f);
console.log("product:", p.name);
console.log("faComments count:", (p.faComments ?? []).length);
console.log("comments count:", (p.comments ?? []).length);
