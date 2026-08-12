const fs = require("fs");
const files = fs.readdirSync("data").filter(f => f.endsWith(".json")).sort().reverse();
console.log("File:", files[0]);
const d = JSON.parse(fs.readFileSync("data/" + files[0], "utf8"));
for (const k of ["today", "yesterday", "week", "month", "year"]) {
  const arr = d.periods[k] ?? [];
  console.log("\n[" + k + "] count=" + arr.length);
  arr.slice(0, 3).forEach((p, i) => console.log("   " + (i + 1) + ". " + p.name + " — " + p.votes));
}
