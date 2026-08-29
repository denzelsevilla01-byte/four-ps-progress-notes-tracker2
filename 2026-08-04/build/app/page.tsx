"use client";

import { useMemo, useState } from "react";

const households = [
  { id: "•••• 6725", family: "Santos Family", barangay: "Alacan", set: "12A", status: "Active", members: 5, children: 2, grantee: "Marites S.", updated: "May 28" },
  { id: "•••• 1835", family: "Dela Cruz Family", barangay: "Alacan", set: "12A", status: "Active", members: 5, children: 3, grantee: "Elena D.", updated: "May 27" },
  { id: "•••• 3563", family: "Rivera Family", barangay: "Ambalangan-Dalin", set: "9B", status: "On hold", members: 4, children: 2, grantee: "Carmen R.", updated: "May 25" },
  { id: "•••• 8247", family: "Mendoza Family", barangay: "Anonang", set: "11C", status: "Active", members: 6, children: 4, grantee: "Luz M.", updated: "May 24" },
  { id: "•••• 4092", family: "Garcia Family", barangay: "Binday", set: "8A", status: "For review", members: 3, children: 1, grantee: "Rosa G.", updated: "May 22" },
  { id: "•••• 7710", family: "Reyes Family", barangay: "Bolaoen", set: "10B", status: "Active", members: 7, children: 4, grantee: "Nena R.", updated: "May 21" },
];

const statusData = [
  ["Active", 2415, "#1c7c62"], ["Graduated", 2500, "#81a88a"], ["No eligible child", 664, "#d7a84c"],
  ["Not registered", 631, "#b96e58"], ["Other statuses", 333, "#b9b9ae"]
] as const;

export default function Home() {
  return <main style={{margin:0,padding:0,width:"100vw",height:"100vh",overflow:"hidden"}}><iframe title="San Fabian Family Roster Workspace" src="/roster/san-fabian-roster-prototype.html" style={{border:0,width:"100%",height:"100%"}} /></main>;
  /*
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All statuses");
  const [selected, setSelected] = useState(households[0]);
  const [tab, setTab] = useState<"Overview" | "Households">("Overview");
  const filtered = useMemo(() => households.filter(h =>
    (filter === "All statuses" || h.status === filter) &&
    `${h.family} ${h.barangay} ${h.id}`.toLowerCase().includes(query.toLowerCase())
  ), [query, filter]);
  const total = 6543;

  return <main>
    <aside className="sidebar">
      <div className="brand"><span className="seal">SF</span><div><strong>Family Roster</strong><small>MOO San Fabian</small></div></div>
      <nav>
        <button className={tab === "Overview" ? "active" : ""} onClick={() => setTab("Overview")}><span>⌂</span> Overview</button>
        <button className={tab === "Households" ? "active" : ""} onClick={() => setTab("Households")}><span>⌕</span> Households <b>6,543</b></button>
        <button onClick={() => setTab("Households")}><span>♙</span> Members <b>41,427</b></button>
        <button><span>◫</span> Reports</button>
      </nav>
      <div className="side-note"><span>●</span><div><strong>Roster current</strong><small>As of 31 May 2026</small></div></div>
      <div className="profile"><div className="avatar">MO</div><div><strong>MOO Officer</strong><small>San Fabian Office</small></div><span>⋯</span></div>
    </aside>

    <section className="content">
      <header><div><p className="eyebrow">MUNICIPAL OPERATIONS OFFICE</p><h1>{tab === "Overview" ? "Good morning, San Fabian" : "Household directory"}</h1><p>{tab === "Overview" ? "Here’s the family roster at a glance." : "Search and review masked household records."}</p></div><div className="header-actions"><button className="icon-btn" aria-label="Notifications">♢<i></i></button><button className="primary" onClick={() => setTab("Households")}>⌕ Find a household</button></div></header>

      <div className="privacy">◉ <span><strong>Prototype privacy mode</strong> — Household IDs are masked and all displayed names are fictional.</span></div>

      <section className="metrics">
        <article><div className="metric-top"><span>Registered households</span><em className="green">+1.8%</em></div><strong>6,543</strong><small>Across San Fabian barangays</small><div className="spark"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></article>
        <article><div className="metric-top"><span>Active households</span><em className="green">36.9%</em></div><strong>2,415</strong><small>Currently monitored</small><div className="progress"><i style={{width:"36.9%"}}></i></div></article>
        <article><div className="metric-top"><span>Family members</span><em>6.3 avg.</em></div><strong>41,427</strong><small>Roster member records</small><div className="people">● ● ● ● ● ●</div></article>
        <article className="attention"><div className="metric-top"><span>Needs attention</span><em>Open</em></div><strong>168</strong><small>On hold, unlocated or processing</small><button onClick={() => { setFilter("On hold"); setTab("Households"); }}>Review cases →</button></article>
      </section>

      <section className="grid">
        <article className="panel status-panel">
          <div className="panel-head"><div><h2>Household status</h2><p>Distribution of all 6,543 households</p></div><button>•••</button></div>
          <div className="status-body"><div className="donut" style={{background:`conic-gradient(${statusData.map((s, i) => `${s[2]} ${statusData.slice(0,i).reduce((a,x)=>a+x[1],0)/total*100}% ${(statusData.slice(0,i).reduce((a,x)=>a+x[1],0)+s[1])/total*100}%`).join(",")})`}}><div><strong>6,543</strong><small>Total</small></div></div>
          <div className="legend">{statusData.map(s => <div key={s[0]}><span style={{background:s[2]}}></span><label>{s[0]}</label><strong>{s[1].toLocaleString()}</strong><small>{Math.round(s[1]/total*100)}%</small></div>)}</div></div>
        </article>

        <article className="panel activity">
          <div className="panel-head"><div><h2>Recent activity</h2><p>Latest roster actions</p></div><button>View all</button></div>
          {[['✓','Roster validated','May 31 • 6,543 households','mint'],['↻','Status updated','May 28 • 14 household records','gold'],['+','Members added','May 24 • 23 new records','blue'],['!','Cases flagged','May 22 • 8 for verification','rose']].map(a => <div className="activity-row" key={a[1]}><span className={a[3]}>{a[0]}</span><div><strong>{a[1]}</strong><small>{a[2]}</small></div><b>›</b></div>)}
        </article>
      </section>

      <section className="panel table-panel">
        <div className="panel-head table-head"><div><h2>Households</h2><p>Quick access to recently reviewed families</p></div><div className="tools"><div className="search">⌕<input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search families…" /></div><select value={filter} onChange={e => setFilter(e.target.value)}><option>All statuses</option><option>Active</option><option>On hold</option><option>For review</option></select></div></div>
        <div className="table-wrap"><table><thead><tr><th>Household</th><th>Barangay</th><th>Set</th><th>Status</th><th>Members</th><th>Updated</th><th></th></tr></thead><tbody>{filtered.map(h => <tr key={h.id} onClick={() => setSelected(h)} className={selected.id === h.id ? "selected" : ""}><td><span className="family-icon">⌂</span><div><strong>{h.family}</strong><small>{h.id}</small></div></td><td>{h.barangay}</td><td>{h.set}</td><td><span className={`pill ${h.status.toLowerCase().replaceAll(' ','-')}`}>● {h.status}</span></td><td>{h.members}</td><td>{h.updated}</td><td>›</td></tr>)}</tbody></table>{filtered.length === 0 && <div className="empty">No fictional sample households match this filter.</div>}</div>
      </section>

      <section className="detail-drawer" aria-live="polite">
        <div><small>SELECTED HOUSEHOLD</small><h3>{selected.family}</h3><p>{selected.id} · {selected.barangay} · Set {selected.set}</p></div>
        <dl><div><dt>Grantee</dt><dd>{selected.grantee}</dd></div><div><dt>Members</dt><dd>{selected.members}</dd></div><div><dt>Children</dt><dd>{selected.children}</dd></div><div><dt>Status</dt><dd>{selected.status}</dd></div></dl>
        <button>Open family profile →</button>
      </section>
      <footer>DSWD · Pantawid Pamilyang Pilipino Program <span>Prototype based on roster structure · No personal data displayed</span></footer>
    </section>
  </main>;
  */
}
