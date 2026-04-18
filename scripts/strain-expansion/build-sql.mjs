// Convert strain tuples into SQL INSERT batch with ON CONFLICT DO NOTHING
import { BATCHES } from './strain-data.mjs';

function esc(s) { return String(s).replace(/'/g, "''"); }

function toPgArray(csv) {
  return '{' + csv.split(',').map(x => `"${esc(x.trim())}"`).join(',') + '}';
}

function toTerpJson(csv) {
  const arr = csv.split(',').map(pair => {
    const [name, pct] = pair.split(':');
    return { name: name.trim(), percentage: parseFloat(pct) };
  });
  return JSON.stringify(arr);
}

export function buildSql(batchKey) {
  const rows = BATCHES[batchKey];
  const values = rows.map(r => {
    const [id, name, type, thcMin, thcMax, cbdMin, cbdMax, desc, effects, flavors, terpenes, genetics, difficulty, flowering, yld, source] = r;
    return `('${esc(id)}','${esc(name)}','${type}',${thcMin},${thcMax},${cbdMin},${cbdMax},'${esc(desc)}','${toPgArray(effects)}','${toPgArray(flavors)}','${esc(toTerpJson(terpenes))}'::jsonb,'${esc(genetics)}','${difficulty}','${flowering}','${yld}',0,0,'${esc(source)}')`;
  });
  return `INSERT INTO public.strains (id,name,type,thc_min,thc_max,cbd_min,cbd_max,description,effects,flavors,terpenes,genetics,difficulty,flowering_time,yield,rating,rating_count,source) VALUES\n${values.join(',\n')}\nON CONFLICT (id) DO NOTHING;`;
}

if (process.argv[2]) {
  console.log(buildSql(process.argv[2]));
}
