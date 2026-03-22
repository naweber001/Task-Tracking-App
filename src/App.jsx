import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { STATUSES, T, LOGO_LIGHT, LOGO_DARK } from './constants';
import { Ctx, useT } from './theme';
import { storageGet, storageSet } from './storage';
import { uid, todayStr, daysUntil } from './utils';

import ErrorBoundary from './components/ErrorBoundary';
import Sheet from './components/Sheet';
import TaskForm from './components/TaskForm';
import ClientForm from './components/ClientForm';
import DealForm from './components/DealForm';
import AssocForm from './components/AssocForm';
import ReminderForm from './components/ReminderForm';
import SearchPanel from './components/SearchPanel';
import MonthCal from './components/MonthCal';
import QuickTasks from './components/QuickTasks';
import FlatTaskRow from './components/FlatTaskRow';
import ReorderTaskList from './components/ReorderTaskList';
import DueBadge from './components/DueBadge';
import Toggle from './components/Toggle';
import ConfirmBtn from './components/ConfirmBtn';

const EMPTY = { clients: [], deals: [], tasks: [], associates: [], reminders: [], quickTasks: [] };

function Header({ dark, setDark, onSearch, onSettings, logo }) {
  const t = useT();
  return (
    <div style={{
      background: t.hdr, padding: "16px 20px", display: "flex",
      alignItems: "center", justifyContent: "space-between",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {logo && <img src={logo} alt="logo" style={{ height: 28, borderRadius: 6 }} />}
        <span style={{ color: t.hdrNum, fontWeight: 700, fontSize: 18 }}>Firm Tasks</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onSearch} style={iconBtn(t)} title="Search">🔍</button>
        <button onClick={onSettings} style={iconBtn(t)} title="Settings">⚙️</button>
        <Toggle value={dark} onChange={setDark} />
      </div>
    </div>
  );
}

function iconBtn(t) {
  return {
    background: "none", border: "none", fontSize: 18, cursor: "pointer",
    padding: 4, borderRadius: 6, color: t.hdrNum,
  };
}

const TABS = [
  { key: "tasks", label: "Tasks" },
  { key: "calendar", label: "Calendar" },
  { key: "clients", label: "Clients" },
  { key: "quick", label: "Quick" },
];

function TabBar({ tab, setTab }) {
  const t = useT();
  return (
    <div style={{
      display: "flex", background: t.tab, borderBottom: `1px solid ${t.tabBrd}`,
    }}>
      {TABS.map(tb => (
        <button key={tb.key} onClick={() => setTab(tb.key)} style={{
          flex: 1, padding: "10px 0", border: "none", cursor: "pointer",
          background: "none", fontWeight: 600, fontSize: 13,
          color: tab === tb.key ? t.tabA : t.tabI,
          borderBottom: tab === tb.key ? `2px solid ${t.tabA}` : "2px solid transparent",
        }}>{tb.label}</button>
      ))}
    </div>
  );
}

function ChipBar({ items, active, onSelect, allLabel = "All" }) {
  const t = useT();
  return (
    <div style={{
      display: "flex", gap: 6, padding: "10px 16px", overflowX: "auto",
      WebkitOverflowScrolling: "touch",
    }}>
      <Chip t={t} active={active === null} onClick={() => onSelect(null)}>{allLabel}</Chip>
      {items.map(it => (
        <Chip key={it.id} t={t} active={active === it.id} onClick={() => onSelect(it.id)}>
          {it.name}
        </Chip>
      ))}
    </div>
  );
}

function Chip({ t, active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: "5px 12px", borderRadius: 16, border: "none", cursor: "pointer",
      fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
      background: active ? t.chipA : t.chip,
      color: active ? t.chipTxA : t.chipTx,
    }}>{children}</button>
  );
}

function StatusFilter({ status, setStatus }) {
  const t = useT();
  return (
    <div style={{ display: "flex", gap: 6, padding: "0 16px 8px" }}>
      <Chip t={t} active={status === null} onClick={() => setStatus(null)}>All</Chip>
      {Object.entries(STATUSES).map(([k, v]) => (
        <Chip key={k} t={t} active={status === k} onClick={() => setStatus(k)}>
          {v.icon} {v.label}
        </Chip>
      ))}
    </div>
  );
}

/* ─── Settings Panel ─── */
function SettingsPanel({ data, setData, onClose }) {
  const t = useT();
  const [editingClient, setEditingClient] = useState(null);
  const [showAssocForm, setShowAssocForm] = useState(false);
  const [showDealForm, setShowDealForm] = useState(false);
  const [dealEditId, setDealEditId] = useState(null);

  const addClient = (name) => {
    setData(d => ({ ...d, clients: [...d.clients, { id: uid(), name }] }));
  };
  const updateClient = (id, name) => {
    setData(d => ({ ...d, clients: d.clients.map(c => c.id === id ? { ...c, name } : c) }));
    setEditingClient(null);
  };
  const deleteClient = (id) => {
    setData(d => ({
      ...d,
      clients: d.clients.filter(c => c.id !== id),
      deals: d.deals.filter(dl => dl.clientId !== id),
      tasks: d.tasks.filter(tk => tk.clientId !== id),
    }));
  };
  const addAssociate = (name) => {
    setData(d => ({ ...d, associates: [...d.associates, name] }));
    setShowAssocForm(false);
  };
  const removeAssociate = (idx) => {
    setData(d => ({ ...d, associates: d.associates.filter((_, i) => i !== idx) }));
  };
  const addDeal = (deal) => {
    setData(d => ({ ...d, deals: [...d.deals, { id: uid(), ...deal }] }));
    setShowDealForm(false);
  };
  const updateDeal = (deal) => {
    setData(d => ({ ...d, deals: d.deals.map(dl => dl.id === dealEditId ? { ...dl, ...deal } : dl) }));
    setDealEditId(null);
    setShowDealForm(false);
  };
  const deleteDeal = (id) => {
    setData(d => ({
      ...d,
      deals: d.deals.filter(dl => dl.id !== id),
      tasks: d.tasks.map(tk => tk.dealId === id ? { ...tk, dealId: null } : tk),
    }));
  };

  const sectionStyle = { padding: "12px 16px", borderBottom: `1px solid ${t.brd}` };
  const hStyle = { fontSize: 14, fontWeight: 700, color: t.tx, marginBottom: 8 };
  const itemStyle = {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "8px 12px", background: t.card2, borderRadius: 8, marginBottom: 4,
    border: t.cardBorder,
  };

  return (
    <Sheet title="Settings" onClose={onClose}>
      {/* Clients */}
      <div style={sectionStyle}>
        <div style={hStyle}>Clients</div>
        {data.clients.map(c => (
          <div key={c.id} style={itemStyle}>
            {editingClient === c.id ? (
              <ClientForm initial={c.name} onSave={(n) => updateClient(c.id, n)} onCancel={() => setEditingClient(null)} />
            ) : (
              <>
                <span style={{ color: t.tx, fontSize: 13 }}>{c.name}</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => setEditingClient(c.id)} style={smallBtn(t)}>Edit</button>
                  <ConfirmBtn onConfirm={() => deleteClient(c.id)} label="Del" />
                </div>
              </>
            )}
          </div>
        ))}
        <ClientForm onSave={addClient} onCancel={() => {}} />
      </div>

      {/* Deals / Matters */}
      <div style={sectionStyle}>
        <div style={hStyle}>Matters</div>
        {data.deals.map(dl => {
          const client = data.clients.find(c => c.id === dl.clientId);
          return (
            <div key={dl.id} style={itemStyle}>
              {dealEditId === dl.id ? (
                <DealForm clients={data.clients} initial={dl} onSave={updateDeal} onCancel={() => setDealEditId(null)} />
              ) : (
                <>
                  <div>
                    <div style={{ color: t.tx, fontSize: 13, fontWeight: 600 }}>{dl.name}</div>
                    {client && <div style={{ color: t.tx2, fontSize: 11 }}>{client.name}</div>}
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => { setDealEditId(dl.id); setShowDealForm(true); }} style={smallBtn(t)}>Edit</button>
                    <ConfirmBtn onConfirm={() => deleteDeal(dl.id)} label="Del" />
                  </div>
                </>
              )}
            </div>
          );
        })}
        {showDealForm && !dealEditId ? (
          <DealForm clients={data.clients} onSave={addDeal} onCancel={() => setShowDealForm(false)} />
        ) : (
          <button onClick={() => { setDealEditId(null); setShowDealForm(true); }}
            style={{ ...smallBtn(t), marginTop: 6 }}>+ Add Matter</button>
        )}
      </div>

      {/* Associates */}
      <div style={sectionStyle}>
        <div style={hStyle}>Associates</div>
        {data.associates.map((a, i) => (
          <div key={i} style={itemStyle}>
            <span style={{ color: t.tx, fontSize: 13 }}>{a}</span>
            <ConfirmBtn onConfirm={() => removeAssociate(i)} label="Del" />
          </div>
        ))}
        {showAssocForm ? (
          <AssocForm onAdd={addAssociate} onClose={() => setShowAssocForm(false)} />
        ) : (
          <button onClick={() => setShowAssocForm(true)} style={{ ...smallBtn(t), marginTop: 6 }}>+ Add Associate</button>
        )}
      </div>

      {/* Data management */}
      <div style={sectionStyle}>
        <div style={hStyle}>Data</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "firm-tasks-backup.json";
            a.click();
          }} style={smallBtn(t)}>Export</button>
          <button onClick={() => {
            const input = document.createElement("input");
            input.type = "file"; input.accept = ".json";
            input.onchange = (e) => {
              const file = e.target.files[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (ev) => {
                try {
                  const parsed = JSON.parse(ev.target.result);
                  if (parsed.clients && parsed.tasks) setData(parsed);
                } catch {}
              };
              reader.readAsText(file);
            };
            input.click();
          }} style={smallBtn(t)}>Import</button>
        </div>
      </div>
    </Sheet>
  );
}

function smallBtn(t) {
  return {
    background: t.btn2, color: t.btn2Tx, border: "none", borderRadius: 6,
    padding: "5px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer",
  };
}

/* ─── Tasks View ─── */
function TasksView({ data, setData }) {
  const t = useT();
  const [filterClient, setFilterClient] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterFlag, setFilterFlag] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // "list" | "board"

  const filtered = useMemo(() => {
    let tasks = [...data.tasks];
    if (filterClient) tasks = tasks.filter(tk => tk.clientId === filterClient);
    if (filterStatus) tasks = tasks.filter(tk => tk.status === filterStatus);
    if (filterFlag) tasks = tasks.filter(tk => tk.flagged);
    tasks.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return tasks;
  }, [data.tasks, filterClient, filterStatus, filterFlag]);

  const saveTask = (task) => {
    if (editTask) {
      setData(d => ({ ...d, tasks: d.tasks.map(tk => tk.id === editTask.id ? { ...tk, ...task } : tk) }));
    } else {
      setData(d => ({ ...d, tasks: [...d.tasks, { id: uid(), order: d.tasks.length, ...task }] }));
    }
    setShowTaskForm(false);
    setEditTask(null);
  };

  const deleteTask = (id) => {
    setData(d => ({ ...d, tasks: d.tasks.filter(tk => tk.id !== id) }));
  };

  const updateTask = (id, updates) => {
    setData(d => ({ ...d, tasks: d.tasks.map(tk => tk.id === id ? { ...tk, ...updates } : tk) }));
  };

  const reorderTasks = (fromIdx, toIdx) => {
    setData(d => {
      const ids = filtered.map(tk => tk.id);
      const [moved] = ids.splice(fromIdx, 1);
      ids.splice(toIdx, 0, moved);
      const orderMap = {};
      ids.forEach((id, i) => { orderMap[id] = i; });
      return { ...d, tasks: d.tasks.map(tk => orderMap[tk.id] != null ? { ...tk, order: orderMap[tk.id] } : tk) };
    });
  };

  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      <ChipBar items={data.clients} active={filterClient} onSelect={setFilterClient} allLabel="All Clients" />
      <StatusFilter status={filterStatus} setStatus={setFilterStatus} />
      <div style={{ padding: "0 16px 8px", display: "flex", gap: 6, alignItems: "center" }}>
        <Chip t={t} active={filterFlag} onClick={() => setFilterFlag(f => !f)}>⚑ Flagged</Chip>
        <div style={{ flex: 1 }} />
        <button onClick={() => setViewMode(v => v === "list" ? "board" : "list")}
          style={smallBtn(t)}>{viewMode === "list" ? "Board" : "List"}</button>
      </div>

      {viewMode === "board" ? (
        <div style={{ display: "flex", gap: 8, padding: "0 12px", overflowX: "auto" }}>
          {Object.entries(STATUSES).map(([key, st]) => {
            const col = filtered.filter(tk => tk.status === key);
            return (
              <div key={key} style={{ minWidth: 240, flex: 1 }}>
                <div style={{
                  padding: "8px 12px", fontWeight: 700, fontSize: 13, color: st.color,
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  {st.icon} {st.label} <span style={{ color: t.tx3, fontWeight: 400 }}>({col.length})</span>
                </div>
                <ReorderTaskList
                  tasks={col}
                  clients={data.clients}
                  deals={data.deals}
                  associates={data.associates}
                  onUpdate={(id, u) => updateTask(id, u)}
                  onEdit={(tk) => { setEditTask(tk); setShowTaskForm(true); }}
                  onDelete={deleteTask}
                  onReorder={reorderTasks}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ padding: "0 12px" }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: 40, color: t.tx3, fontSize: 13 }}>
              No tasks found. Tap + to add one.
            </div>
          )}
          {filtered.map(tk => (
            <FlatTaskRow
              key={tk.id}
              task={tk}
              clients={data.clients}
              deals={data.deals}
              associates={data.associates}
              onUpdate={(u) => updateTask(tk.id, u)}
              onEdit={() => { setEditTask(tk); setShowTaskForm(true); }}
              onDelete={() => deleteTask(tk.id)}
            />
          ))}
        </div>
      )}

      {/* FAB */}
      <button onClick={() => { setEditTask(null); setShowTaskForm(true); }} style={{
        position: "fixed", bottom: 24, right: 24, width: 52, height: 52, borderRadius: 26,
        background: t.btn, color: t.btnTx, border: "none", fontSize: 24, fontWeight: 700,
        cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.2)", zIndex: 10,
      }}>+</button>

      {showTaskForm && (
        <Sheet title={editTask ? "Edit Task" : "New Task"} onClose={() => { setShowTaskForm(false); setEditTask(null); }}>
          <TaskForm
            clients={data.clients}
            deals={data.deals}
            associates={data.associates}
            initial={editTask}
            onSave={saveTask}
            onCancel={() => { setShowTaskForm(false); setEditTask(null); }}
          />
        </Sheet>
      )}
    </div>
  );
}

/* ─── Calendar View ─── */
function CalendarView({ data, setData }) {
  const t = useT();
  const [selectedDate, setSelectedDate] = useState(null);
  const [showReminder, setShowReminder] = useState(false);

  const tasksOnDate = useMemo(() => {
    if (!selectedDate) return [];
    return data.tasks.filter(tk => tk.deadline === selectedDate);
  }, [data.tasks, selectedDate]);

  const remindersOnDate = useMemo(() => {
    if (!selectedDate) return [];
    return data.reminders.filter(r => r.date === selectedDate);
  }, [data.reminders, selectedDate]);

  const saveReminder = (rem) => {
    setData(d => ({ ...d, reminders: [...d.reminders, { id: uid(), ...rem }] }));
    setShowReminder(false);
  };

  const deleteReminder = (id) => {
    setData(d => ({ ...d, reminders: d.reminders.filter(r => r.id !== id) }));
  };

  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      <MonthCal
        tasks={data.tasks}
        reminders={data.reminders}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />
      {selectedDate && (
        <div style={{ padding: "0 16px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: t.tx, marginBottom: 8 }}>
            {selectedDate}
          </div>
          {tasksOnDate.map(tk => (
            <div key={tk.id} style={{
              padding: "8px 12px", background: t.card, borderRadius: 8, marginBottom: 4,
              border: t.cardBorder, display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ color: t.tx, fontSize: 13 }}>{tk.title}</span>
              <DueBadge deadline={tk.deadline} />
            </div>
          ))}
          {remindersOnDate.map(r => (
            <div key={r.id} style={{
              padding: "8px 12px", background: t.card2, borderRadius: 8, marginBottom: 4,
              border: t.cardBorder, display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ color: t.tx2, fontSize: 13 }}>🔔 {r.text}</span>
              <ConfirmBtn onConfirm={() => deleteReminder(r.id)} label="×" />
            </div>
          ))}
          {tasksOnDate.length === 0 && remindersOnDate.length === 0 && (
            <div style={{ color: t.tx3, fontSize: 13, padding: 12 }}>Nothing scheduled.</div>
          )}
          <button onClick={() => setShowReminder(true)} style={{ ...smallBtn(t), marginTop: 8 }}>
            + Reminder
          </button>
        </div>
      )}
      {showReminder && (
        <Sheet title="New Reminder" onClose={() => setShowReminder(false)}>
          <ReminderForm
            initialDate={selectedDate || todayStr()}
            onSave={saveReminder}
            onCancel={() => setShowReminder(false)}
          />
        </Sheet>
      )}
    </div>
  );
}

/* ─── Clients View ─── */
function ClientsView({ data, setData }) {
  const t = useT();
  const [expanded, setExpanded] = useState(null);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
      {data.clients.length === 0 && (
        <div style={{ textAlign: "center", padding: 40, color: t.tx3, fontSize: 13 }}>
          No clients yet. Add clients in Settings.
        </div>
      )}
      {data.clients.map(c => {
        const clientDeals = data.deals.filter(d => d.clientId === c.id);
        const clientTasks = data.tasks.filter(tk => tk.clientId === c.id);
        const activeTasks = clientTasks.filter(tk => tk.status === "active").length;
        const isOpen = expanded === c.id;

        return (
          <div key={c.id} style={{
            background: t.card, borderRadius: 10, marginBottom: 8,
            border: t.cardBorder, boxShadow: t.cardShadow, overflow: "hidden",
          }}>
            <button onClick={() => setExpanded(isOpen ? null : c.id)} style={{
              width: "100%", padding: "12px 16px", border: "none", cursor: "pointer",
              background: "none", display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ color: t.tx, fontWeight: 600, fontSize: 14 }}>{c.name}</span>
              <span style={{ color: t.tx3, fontSize: 12 }}>
                {clientTasks.length} tasks · {activeTasks} active {isOpen ? "▾" : "▸"}
              </span>
            </button>
            {isOpen && (
              <div style={{ padding: "0 16px 12px" }}>
                {clientDeals.length > 0 && (
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 11, color: t.tx2, fontWeight: 600, marginBottom: 4 }}>Matters</div>
                    {clientDeals.map(dl => {
                      const dealTasks = data.tasks.filter(tk => tk.dealId === dl.id);
                      return (
                        <div key={dl.id} style={{
                          padding: "6px 10px", background: t.card2, borderRadius: 6, marginBottom: 3,
                          display: "flex", justifyContent: "space-between",
                        }}>
                          <span style={{ color: t.tx, fontSize: 12 }}>{dl.name}</span>
                          <span style={{ color: t.tx3, fontSize: 11 }}>{dealTasks.length} tasks</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                {clientTasks.map(tk => (
                  <div key={tk.id} style={{
                    padding: "6px 10px", background: t.card2, borderRadius: 6, marginBottom: 3,
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <span style={{
                      color: tk.status === "complete" ? t.tx3 : t.tx, fontSize: 12,
                      textDecoration: tk.status === "complete" ? "line-through" : "none",
                    }}>{tk.title}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ color: STATUSES[tk.status]?.color, fontSize: 10 }}>
                        {STATUSES[tk.status]?.icon}
                      </span>
                      {tk.deadline && tk.deadline !== "N/A" && <DueBadge deadline={tk.deadline} />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Main App ─── */
export default function App() {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("firm_dark") === "1"; } catch { return false; }
  });
  const [data, setDataRaw] = useState(EMPTY);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("tasks");
  const [showSearch, setShowSearch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const theme = dark ? T.dark : T.light;
  const logo = dark ? LOGO_DARK : LOGO_LIGHT;

  // persist dark mode
  useEffect(() => {
    try { localStorage.setItem("firm_dark", dark ? "1" : "0"); } catch {}
  }, [dark]);

  // load data
  useEffect(() => {
    storageGet().then(d => {
      if (d) setDataRaw(prev => ({ ...EMPTY, ...d }));
      setLoaded(true);
    });
  }, []);

  // save data on change
  const setData = useCallback((updater) => {
    setDataRaw(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      storageSet(next);
      return next;
    });
  }, []);

  if (!loaded) {
    return (
      <div style={{
        height: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: theme.bg, color: theme.tx,
      }}>Loading...</div>
    );
  }

  return (
    <Ctx.Provider value={theme}>
      <div style={{
        height: "100vh", display: "flex", flexDirection: "column",
        background: theme.bg, fontFamily: "'DM Sans', sans-serif",
        color: theme.tx,
      }}>
        <Header dark={dark} setDark={setDark} onSearch={() => setShowSearch(true)}
          onSettings={() => setShowSettings(true)} logo={logo} />
        <TabBar tab={tab} setTab={setTab} />

        {tab === "tasks" && <TasksView data={data} setData={setData} />}
        {tab === "calendar" && <CalendarView data={data} setData={setData} />}
        {tab === "clients" && <ClientsView data={data} setData={setData} />}
        {tab === "quick" && (
          <div style={{ flex: 1, overflowY: "auto" }}>
            <QuickTasks
              quickTasks={data.quickTasks}
              onUpdate={(qts) => setData(d => ({ ...d, quickTasks: qts }))}
            />
          </div>
        )}

        {showSearch && (
          <Sheet title="Search" onClose={() => setShowSearch(false)}>
            <SearchPanel
              tasks={data.tasks}
              clients={data.clients}
              deals={data.deals}
              associates={data.associates}
              onSelectTask={(tk) => { setShowSearch(false); setTab("tasks"); }}
              onSelectClient={(c) => { setShowSearch(false); setTab("clients"); }}
              onSelectAssociate={() => { setShowSearch(false); setShowSettings(true); }}
            />
          </Sheet>
        )}

        {showSettings && <SettingsPanel data={data} setData={setData} onClose={() => setShowSettings(false)} />}
      </div>
    </Ctx.Provider>
  );
}
