import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Copy, Download, Eye, Loader2, Mail, MessageCircle, RefreshCw, Undo2 } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

type ApplicationRow = {
  id: string;
  created_at: string;
  supermarket: string;
  position: string;
  full_name: string;
  email: string | null;
  phone: string;
  whatsapp_number: string | null;
  location: string;
  start_time: string;
  willing_to_train: string;
  work_type: string;
  interview_mode: string;
  employment_type: string;
  salary_range: string;
  education_level: string;
  experience_level: string;
  interview_date: string;
  interview_time: string;
  contact_method: string;
  contact_value: string;
  mpesa_number: string | null;
  processing_fee: number | null;
  payment_status: string | null;
  checkout_request_id: string | null;
  replied_at: string | null;
};

type AutoReplyRow = {
  id: string;
  created_at: string;
  send_at: string;
  sent_at: string | null;
  status: string;
  last_error: string | null;
  application_id: string | null;
  applicant_name: string | null;
  to_email: string;
  subject: string;
};

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  // Force Day-Month-Year display (e.g. 02 Jun 2026)
  return d.toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatISODateDMY = (isoDate: string) => {
  // isoDate expected: YYYY-MM-DD
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-").map((x) => Number(x));
  if (!y || !m || !d) return isoDate;
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getTodayLocalISODate = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const normalizePhoneForWhatsApp = (raw?: string | null) => {
  if (!raw) return null;
  // Keep digits only
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return null;

  // Kenya defaults (common in this app): 07XXXXXXXX, 01XXXXXXXX, 7XXXXXXXX, 1XXXXXXXX, 2547XXXXXXXX, 2541XXXXXXXX
  if (digits.startsWith("254") && digits.length >= 12) return digits;
  if (digits.startsWith("0") && digits.length === 10) return `254${digits.slice(1)}`;
  if ((digits.startsWith("7") || digits.startsWith("1")) && digits.length === 9) return `254${digits}`;

  // Fallback: return what we have (WhatsApp may still accept it depending on country).
  return digits;
};

const buildWhatsAppMessage = (r: ApplicationRow) => {
  const name = r.full_name?.trim() || "there";
  return (
    `Hello ${name},\n\n` +
    `Congratulations! You have qualified for the ${r.position} position at ${r.supermarket}.\n\n` +
    `Because we had a few applicants for this position, the interview will not take place and you have been automatically selected.\n\n` +
    `Salary: ${r.salary_range}\n\n` +
    `Next step: you are required to attend an 8-hour physical training and orientation session.\n\n` +
    `Kindly reply to confirm receipt.\n\n\n\n` +
    `Next step: you are required to attend an 8-hour physical training and orientation session.dates and venue will be sent after we send your staff number and confirm branch placement\n\n` +
    `Kindly reply to confirm`
  );
};

export default function Admin() {
  const [loadingData, setLoadingData] = useState(false);
  const [rows, setRows] = useState<ApplicationRow[]>([]);
  const [search, setSearch] = useState("");
  const [paidOnly, setPaidOnly] = useState(false);
  const [unrepliedOnly, setUnrepliedOnly] = useState(false);
  const [supermarketFilter, setSupermarketFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});
  const [updatingReplyId, setUpdatingReplyId] = useState<string | null>(null);
  const [sortByInterviewDate, setSortByInterviewDate] = useState(true);
  const [interviewFrom, setInterviewFrom] = useState<string>("");
  const [interviewTo, setInterviewTo] = useState<string>("");
  const todayISO = useMemo(() => getTodayLocalISODate(), []);

  // Auto-replies (loaded directly from Supabase like applications)
  const [autoRepliesLoading, setAutoRepliesLoading] = useState(false);
  const [autoReplies, setAutoReplies] = useState<AutoReplyRow[]>([]);
  const [autoReplyStatusFilter, setAutoReplyStatusFilter] = useState<string>("all");
  const [autoReplySearch, setAutoReplySearch] = useState("");
  const [adminTab, setAdminTab] = useState<"applications" | "emails">("applications");

  const supermarkets = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => {
      const s = (r.supermarket ?? "").trim();
      if (s) set.add(s);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let base = unrepliedOnly ? rows.filter((r) => !r.replied_at) : rows;

    if (supermarketFilter !== "all") {
      base = base.filter((r) => (r.supermarket ?? "").trim() === supermarketFilter);
    }

    // Interview date filtering (YYYY-MM-DD, safe for string compare)
    if (interviewFrom) base = base.filter((r) => (r.interview_date ?? "") >= interviewFrom);
    if (interviewTo) base = base.filter((r) => (r.interview_date ?? "") <= interviewTo);

    if (q) {
      base = base.filter((r) => {
      const hay = [
        r.full_name,
        r.email ?? "",
        r.phone,
        r.whatsapp_number ?? "",
        r.location,
        r.position,
        r.supermarket,
        r.contact_value,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
      });
    }

    if (sortByInterviewDate) {
      base = [...base].sort((a, b) => {
        const ad = a.interview_date ?? "";
        const bd = b.interview_date ?? "";
        if (ad !== bd) return ad.localeCompare(bd);
        // Tie-breaker: interview_time (string)
        return (a.interview_time ?? "").localeCompare(b.interview_time ?? "");
      });
    }

    return base;
  }, [rows, search, unrepliedOnly, supermarketFilter, interviewFrom, interviewTo, sortByInterviewDate]);

  const todayStats = useMemo(() => {
    const todayRows = rows.filter((r) => (r.interview_date ?? "") === todayISO);
    return {
      totalToday: todayRows.length,
      unrepliedToday: todayRows.filter((r) => !r.replied_at).length,
    };
  }, [rows, todayISO]);

  const getRowMeta = (r: ApplicationRow) => {
    const message = buildWhatsAppMessage(r);
    const waPhone = normalizePhoneForWhatsApp(r.whatsapp_number ?? r.phone);
    const replied = !!r.replied_at;
    const isToday = (r.interview_date ?? "") === todayISO;
    return { message, waPhone, replied, isToday };
  };

  const selectedRows = useMemo(() => rows.filter((r) => !!selectedIds[r.id]), [rows, selectedIds]);
  const selectedCount = selectedRows.length;

  const setAllSelected = (ids: string[], next: boolean) => {
    setSelectedIds((prev) => {
      const copy = { ...prev };
      ids.forEach((id) => {
        copy[id] = next;
      });
      return copy;
    });
  };

  const exportRecipientsXlsx = (source: ApplicationRow[], filenameBase: string) => {
    const recipients: Array<{ Number: string; Name: string }> = [];
    const seen = new Set<string>(); // de-dupe numbers across all rows
    let skippedRows = 0;

    for (const r of source) {
      const name = (r.full_name ?? "").trim();
      // Use international-style normalization (e.g., 2547XXXXXXXX) as originally implemented.
      const phone = normalizePhoneForWhatsApp(r.phone);
      const whatsapp = normalizePhoneForWhatsApp(r.whatsapp_number);

      // If both exist and are different, export BOTH as separate rows.
      // This keeps a single required "Number" column while allowing multiple numbers per person.
      const candidates = [phone, whatsapp].filter(Boolean) as string[];
      const uniqueCandidates = [...new Set(candidates)];

      if (uniqueCandidates.length === 0) {
        skippedRows += 1;
        continue;
      }

      for (const number of uniqueCandidates) {
        if (seen.has(number)) continue;
        seen.add(number);
        recipients.push({ Number: String(number), Name: name });
      }
    }
    if (recipients.length === 0) {
      toast.error("No recipients with valid numbers to export");
      return;
    }


    // 1 worksheet only, unique non-empty headers (Number, Name)
    const worksheet = XLSX.utils.json_to_sheet(recipients, {
      header: ["Number", "Name"],
      skipHeader: false,
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Recipients");

    const file = `${filenameBase}.xlsx`;
    XLSX.writeFile(workbook, file, { bookType: "xlsx" });

    const extra = skippedRows > 0 ? ` (skipped ${skippedRows} without numbers)` : "";
    toast.success(`Downloaded ${recipients.length} recipients${extra}`);
  };

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  const openWhatsApp = (phone: string | null, message: string) => {
    if (!phone) return;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const toggleReplied = async (r: ApplicationRow) => {
    const next = r.replied_at ? null : new Date().toISOString();
    setUpdatingReplyId(r.id);
    try {
      const { error } = await supabase.from("applications").update({ replied_at: next }).eq("id", r.id);
      if (error) throw error;

      setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, replied_at: next } : x)));
      toast.success(next ? "Marked as replied" : "Marked as not replied");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to update reply status");
    } finally {
      setUpdatingReplyId(null);
    }
  };

  const loadApplications = async () => {
    setLoadingData(true);
    try {
      let query = supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(2000);

      if (paidOnly) {
        query = query.eq("payment_status", "completed");
      }

      const { data, error } = await query;
      if (error) throw error;
      setRows((data ?? []) as ApplicationRow[]);
      setSelectedIds({});
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to load applications");
    } finally {
      setLoadingData(false);
    }
  };

  const loadAutoReplies = async () => {
    setAutoRepliesLoading(true);
    try {
      const { data, error } = await supabase
        .from("pending_auto_replies")
        .select(
          "id,created_at,send_at,sent_at,status,last_error,application_id,applicant_name,to_email,subject"
        )
        .order("created_at", { ascending: false })
        .limit(200);

      if (error) throw error;
      setAutoReplies((data ?? []) as AutoReplyRow[]);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to load auto-replies");
    } finally {
      setAutoRepliesLoading(false);
    }
  };

  const queueSelectionEmail = async (r: ApplicationRow) => {
    const toEmail = (r.email || "").trim();
    if (!toEmail) {
      toast.error("This applicant has no email address");
      return;
    }
    setAutoRepliesLoading(true);
    try {
      const res = await fetch("/api/admin-queue-selection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toEmail,
          applicantName: r.full_name,
          position: r.position,
          supermarket: r.supermarket,
          applicationId: null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(String(data?.detail || data?.error || "Failed to queue selection email"));
      toast.success("Selection email queued");
      await loadAutoReplies();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to queue selection email");
    } finally {
      setAutoRepliesLoading(false);
    }
  };

  const resendAutoReply = async (id: string) => {
    setAutoRepliesLoading(true);
    try {
      const res = await fetch("/api/admin-auto-replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(String(data?.detail || data?.error || "Failed to resend"));
      toast.success("Auto-reply sent");
      await loadAutoReplies();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to resend");
      await loadAutoReplies();
    } finally {
      setAutoRepliesLoading(false);
    }
  };

  const filteredAutoReplies = useMemo(() => {
    const status = autoReplyStatusFilter.trim().toLowerCase();
    const q = autoReplySearch.trim().toLowerCase();
    let base = autoReplies;
    if (status !== "all") {
      base = base.filter((r) => (r.status || "pending").toLowerCase() === status);
    }
    if (q) {
      base = base.filter((r) => {
        const hay = [r.to_email, r.subject, r.application_id ?? "", r.applicant_name ?? "", r.status, r.last_error ?? ""]
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });
    }
    return base;
  }, [autoReplies, autoReplyStatusFilter, autoReplySearch]);

  const autoReplyStats = useMemo(() => {
    const stats = { pending: 0, sent: 0, failed: 0, total: autoReplies.length };
    for (const r of autoReplies) {
      const s = (r.status || "pending").toLowerCase();
      if (s === "sent") stats.sent += 1;
      else if (s === "failed") stats.failed += 1;
      else stats.pending += 1;
    }
    return stats;
  }, [autoReplies]);

  const handleAdminTabChange = (value: string) => {
    const nextTab = value === "emails" ? "emails" : "applications";
    setAdminTab(nextTab);
    if (nextTab === "emails") {
      void loadAutoReplies();
    }
  };

  useEffect(() => {
    loadApplications();
    void loadAutoReplies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paidOnly]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="container py-10">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-300 mt-2">
              View applications and track automatic confirmation emails (sent, pending, failed).
            </p>
          </div>
        </div>

        <Tabs value={adminTab} onValueChange={handleAdminTabChange} className="space-y-4">
          <TabsList className="bg-white/10 border border-white/10 text-slate-200">
            <TabsTrigger
              value="applications"
              className="data-[state=active]:bg-white/15 data-[state=active]:text-white"
            >
              Applications
            </TabsTrigger>
            <TabsTrigger
              value="emails"
              className="data-[state=active]:bg-white/15 data-[state=active]:text-white gap-2"
            >
              <Mail className="h-4 w-4" />
              Auto Emails
              {autoReplyStats.failed > 0 ? (
                <Badge className="bg-red-500/20 text-red-200 border-red-500/30">{autoReplyStats.failed} failed</Badge>
              ) : null}
              {autoReplyStats.pending > 0 && autoReplyStats.failed === 0 ? (
                <Badge className="bg-yellow-500/15 text-yellow-200 border-yellow-500/30">{autoReplyStats.pending} pending</Badge>
              ) : null}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="mt-0">
        <div className="space-y-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, phone, WhatsApp, email, location…"
                className="sm:w-[420px] bg-white/10 border-white/10 text-slate-100 placeholder:text-slate-400"
              />
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5">
                    <span className="text-xs font-semibold text-slate-200">Supermarket</span>
                    <Select value={supermarketFilter} onValueChange={setSupermarketFilter}>
                      <SelectTrigger className="h-8 w-[200px] bg-white/10 border-white/10 text-slate-100">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-950 border-white/10 text-slate-100">
                        <SelectItem value="all">All</SelectItem>
                        {supermarkets.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5">
                    <Switch checked={paidOnly} onCheckedChange={setPaidOnly} />
                    <span className="text-xs font-semibold text-slate-200">Paid only</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5">
                    <Switch checked={unrepliedOnly} onCheckedChange={setUnrepliedOnly} />
                    <span className="text-xs font-semibold text-slate-200">Unreplied only</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5">
                    <Switch checked={sortByInterviewDate} onCheckedChange={setSortByInterviewDate} />
                    <span className="text-xs font-semibold text-slate-200">Sort by interview date</span>
                  </div>
                  <Badge className="bg-emerald-500/15 text-emerald-200 border-emerald-500/20">
                    Today: {todayStats.totalToday}
                  </Badge>
                  <Badge className="bg-emerald-500/10 text-emerald-100 border-emerald-500/20">
                    Today unreplied: {todayStats.unrepliedToday}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/10 text-slate-100 border-white/10">
                    {filtered.length} / {rows.length}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-xs text-slate-300">Interview from</span>
                  <Input
                    type="date"
                    value={interviewFrom}
                    onChange={(e) => setInterviewFrom(e.target.value)}
                    className="bg-white/10 border-white/10 text-slate-100"
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-xs text-slate-300">to</span>
                  <Input
                    type="date"
                    value={interviewTo}
                    onChange={(e) => setInterviewTo(e.target.value)}
                    className="bg-white/10 border-white/10 text-slate-100"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    className="bg-white/10 border-white/10 hover:bg-white/15"
                    onClick={() => {
                      setInterviewFrom("");
                      setInterviewTo("");
                    }}
                  >
                    Clear dates
                  </Button>
                  <Button
                    variant="secondary"
                    className="bg-white/10 border-white/10 hover:bg-white/15"
                    onClick={loadApplications}
                    disabled={loadingData}
                  >
                    {loadingData ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Refresh
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    className="bg-white/10 border-white/10 hover:bg-white/15"
                    onClick={() => {
                      const stamp = getTodayLocalISODate();
                      exportRecipientsXlsx(rows, `recipients_all_${stamp}`);
                    }}
                    disabled={rows.length === 0}
                    title="Download all recipients"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export all
                  </Button>
                  <Button
                    variant="secondary"
                    className="bg-white/10 border-white/10 hover:bg-white/15"
                    onClick={() => {
                      const from = interviewFrom || "any";
                      const to = interviewTo || "any";
                      exportRecipientsXlsx(filtered, `recipients_filtered_${from}_to_${to}`);
                    }}
                    disabled={filtered.length === 0}
                    title="Download currently filtered list (includes your date range)"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export filtered
                  </Button>
                  <Button
                    variant="secondary"
                    className="bg-white/10 border-white/10 hover:bg-white/15"
                    onClick={() => exportRecipientsXlsx(selectedRows, `recipients_selected_${selectedCount}`)}
                    disabled={selectedCount === 0}
                    title="Download checkbox-selected recipients"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export selected ({selectedCount})
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* MOBILE VIEW */}
          <div className="md:hidden space-y-3">
            {loadingData ? (
              <Card className="bg-white/5 border-white/10 backdrop-blur p-6">
                <div className="flex items-center justify-center gap-3 text-slate-300">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading…
                </div>
              </Card>
            ) : filtered.length === 0 ? (
              <Card className="bg-white/5 border-white/10 backdrop-blur p-6 text-center text-slate-300">
                No results.
              </Card>
            ) : (
              filtered.map((r) => {
                const { message, waPhone, replied, isToday } = getRowMeta(r);
                return (
                  <Card key={r.id} className="bg-white/5 border-white/10 backdrop-blur p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-100 truncate">{r.full_name}</div>
                        <div className="text-xs text-slate-300">
                          {r.position} • {r.supermarket}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          Interview: <span className="text-slate-200">{formatISODateDMY(r.interview_date)}</span>{" "}
                          <span className="text-slate-300">{r.interview_time}</span>{" "}
                          {isToday ? (
                            <span className="ml-2 font-semibold text-emerald-300">TODAY</span>
                          ) : null}
                        </div>
                      </div>
                      {replied ? (
                        <Badge className="bg-emerald-500/15 text-emerald-200 border-emerald-500/20">Replied</Badge>
                      ) : (
                        <Badge className="bg-white/10 text-slate-200 border-white/10">Not replied</Badge>
                      )}
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-300">
                      <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                        <div className="text-slate-400">Phone</div>
                        <div className="text-slate-200 break-all">{r.phone}</div>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                        <div className="text-slate-400">WhatsApp</div>
                        <div className="text-slate-200 break-all">{r.whatsapp_number ?? r.phone}</div>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/10 border-white/10 hover:bg-white/15"
                        onClick={() => copyText(message)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/10 border-white/10 hover:bg-white/15"
                        onClick={() => openWhatsApp(waPhone, message)}
                        disabled={!waPhone}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        WhatsApp
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/10 border-white/10 hover:bg-white/15"
                        onClick={() => toggleReplied(r)}
                        disabled={updatingReplyId === r.id}
                      >
                        {replied ? (
                          <>
                            <Undo2 className="h-4 w-4 mr-2" />
                            Not replied
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Mark replied
                          </>
                        )}
                      </Button>
                    </div>

                    <Accordion type="single" collapsible className="mt-3">
                      <AccordionItem value="details" className="border-white/10">
                        <AccordionTrigger className="text-slate-200 hover:no-underline">
                          <span className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            View details & message
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 text-sm">
                            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                              <div className="text-xs text-slate-400 mb-2">WhatsApp message</div>
                              <Textarea value={message} readOnly className="min-h-[170px] bg-white/5 border-white/10 text-slate-100" />
                              <div className="flex flex-wrap gap-2 mt-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="bg-white/10 border-white/10 hover:bg-white/15"
                                  onClick={() => copyText(message)}
                                >
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="bg-white/10 border-white/10 hover:bg-white/15"
                                  onClick={() => openWhatsApp(waPhone, message)}
                                  disabled={!waPhone}
                                >
                                  <MessageCircle className="h-4 w-4 mr-2" />
                                  Open WhatsApp
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                                <div className="text-xs text-slate-400 mb-1">Candidate</div>
                                <div className="text-slate-200">Location: {r.location}</div>
                                {r.email ? <div className="text-slate-200">Email: {r.email}</div> : null}
                              </div>
                              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                                <div className="text-xs text-slate-400 mb-1">Preferences</div>
                                <div className="text-slate-200">Salary: {r.salary_range}</div>
                                <div className="text-slate-200">Education: {r.education_level}</div>
                                <div className="text-slate-200">Experience: {r.experience_level}</div>
                                <div className="text-slate-200">Start time: {r.start_time}</div>
                                <div className="text-slate-200">Training: {r.willing_to_train}</div>
                              </div>
                              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                                <div className="text-xs text-slate-400 mb-1">Payment</div>
                                <div className="text-slate-200">
                                  Status:{" "}
                                  <Badge className="bg-white/10 border-white/10 text-slate-100">
                                    {r.payment_status ?? "unknown"}
                                  </Badge>
                                </div>
                                {r.processing_fee != null ? <div className="text-slate-200">Fee: KES {r.processing_fee}</div> : null}
                                {r.mpesa_number ? <div className="text-slate-200">M-Pesa: {r.mpesa_number}</div> : null}
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </Card>
                );
              })
            )}
          </div>

          {/* DESKTOP/TABLET VIEW */}
          <Card className="hidden md:block bg-white/5 border-white/10 backdrop-blur">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="w-[40px]">
                    {(() => {
                      const ids = filtered.map((r) => r.id);
                      const all = ids.length > 0 && ids.every((id) => !!selectedIds[id]);
                      const some = ids.some((id) => !!selectedIds[id]);
                      const checked: boolean | "indeterminate" = all ? true : some ? "indeterminate" : false;
                      return (
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(v) => setAllSelected(ids, v === true)}
                          aria-label="Select all filtered rows"
                        />
                      );
                    })()}
                  </TableHead>
                  <TableHead className="text-slate-300">Created</TableHead>
                  <TableHead className="text-slate-300">Candidate</TableHead>
                  <TableHead className="text-slate-300">Position</TableHead>
                  <TableHead className="text-slate-300">Supermarket</TableHead>
                  <TableHead className="text-slate-300">Interview</TableHead>
                  <TableHead className="text-slate-300">Contacts</TableHead>
                  <TableHead className="text-slate-300">Reply</TableHead>
                  <TableHead className="text-slate-300 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingData ? (
                  <TableRow className="border-white/10">
                    <TableCell colSpan={9} className="py-10">
                      <div className="flex items-center justify-center gap-3 text-slate-300">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Loading…
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow className="border-white/10">
                    <TableCell colSpan={9} className="py-10 text-center text-slate-300">
                      No results.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((r) => {
                    const { message, waPhone, replied, isToday } = getRowMeta(r);
                    return (
                      <TableRow key={r.id} className="border-white/10">
                        <TableCell>
                          <Checkbox
                            checked={!!selectedIds[r.id]}
                            onCheckedChange={(v) =>
                              setSelectedIds((prev) => ({ ...prev, [r.id]: v === true }))
                            }
                            aria-label={`Select ${r.full_name}`}
                          />
                        </TableCell>
                        <TableCell className="text-slate-200">{formatDateTime(r.created_at)}</TableCell>
                        <TableCell>
                          <div className="font-semibold text-slate-100">{r.full_name}</div>
                          <div className="text-xs text-slate-300">{r.location}</div>
                        </TableCell>
                        <TableCell className="text-slate-200">{r.position}</TableCell>
                        <TableCell className="text-slate-200">{r.supermarket}</TableCell>
                        <TableCell className="text-slate-200">
                          <div className="font-medium flex items-center gap-2">
                            <span>{formatISODateDMY(r.interview_date)}</span>
                            {isToday ? (
                              <Badge className="bg-emerald-500/15 text-emerald-200 border-emerald-500/20">
                                TODAY
                              </Badge>
                            ) : null}
                          </div>
                          <div className="text-xs text-slate-300">{r.interview_time}</div>
                        </TableCell>
                        <TableCell className="text-slate-200">
                          <div className="text-sm">Phone: {r.phone}</div>
                          {r.whatsapp_number ? <div className="text-xs text-slate-300">WhatsApp: {r.whatsapp_number}</div> : null}
                        </TableCell>
                        <TableCell>
                          {replied ? (
                            <Badge className="bg-emerald-500/15 text-emerald-200 border-emerald-500/20">Replied</Badge>
                          ) : (
                            <Badge className="bg-white/10 text-slate-200 border-white/10">Not replied</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              className="bg-white/10 border-white/10 hover:bg-white/15"
                              onClick={() => copyText(message)}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copy
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="bg-white/10 border-white/10 hover:bg-white/15"
                              onClick={() => openWhatsApp(waPhone, message)}
                              disabled={!waPhone}
                            >
                              <MessageCircle className="h-4 w-4 mr-2" />
                              WhatsApp
                            </Button>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="secondary" className="bg-white/10 border-white/10 hover:bg-white/15">
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl bg-slate-950 border-white/10 text-slate-100">
                                <DialogHeader>
                                  <DialogTitle className="text-slate-50">Application details</DialogTitle>
                                </DialogHeader>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                                    <div className="text-xs text-slate-400 mb-2">Candidate</div>
                                    <div className="font-semibold">{r.full_name}</div>
                                    <div className="text-slate-300 mt-1">Location: {r.location}</div>
                                    <div className="text-slate-300 mt-1">Phone: {r.phone}</div>
                                    {r.whatsapp_number ? <div className="text-slate-300 mt-1">WhatsApp: {r.whatsapp_number}</div> : null}
                                    {r.email ? <div className="text-slate-300 mt-1">Email: {r.email}</div> : null}
                                    <div className="mt-3 flex flex-wrap gap-2">
                                      <Button
                                        size="sm"
                                        variant="secondary"
                                        className="bg-white/10 border-white/10 hover:bg-white/15"
                                        onClick={() => queueSelectionEmail(r)}
                                        disabled={autoRepliesLoading || !r.email}
                                        title={r.email ? "Queue selection email" : "No applicant email"}
                                      >
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        Send selection email
                                      </Button>
                                    </div>
                                  </div>

                                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                                    <div className="text-xs text-slate-400 mb-2">Job</div>
                                    <div className="font-semibold">{r.position}</div>
                                    <div className="text-slate-300 mt-1">Supermarket: {r.supermarket}</div>
                                    <div className="text-slate-300 mt-1">Work type: {r.work_type}</div>
                                    <div className="text-slate-300 mt-1">Employment: {r.employment_type}</div>
                                    <div className="text-slate-300 mt-1">Interview mode: {r.interview_mode}</div>
                                  </div>

                                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                                    <div className="text-xs text-slate-400 mb-2">WhatsApp message</div>
                                    <Textarea value={message} readOnly className="min-h-[160px] bg-white/5 border-white/10 text-slate-100" />
                                    <div className="flex flex-wrap gap-2 mt-3">
                                      <Button
                                        size="sm"
                                        variant="secondary"
                                        className="bg-white/10 border-white/10 hover:bg-white/15"
                                        onClick={() => copyText(message)}
                                      >
                                        <Copy className="h-4 w-4 mr-2" />
                                        Copy message
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="secondary"
                                        className="bg-white/10 border-white/10 hover:bg-white/15"
                                        onClick={() => openWhatsApp(waPhone, message)}
                                        disabled={!waPhone}
                                      >
                                        <MessageCircle className="h-4 w-4 mr-2" />
                                        Open WhatsApp
                                      </Button>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between gap-3">
                                      <div className="text-xs text-slate-400">
                                        Reply status:{" "}
                                        {replied ? <span className="text-emerald-200">Replied</span> : <span className="text-slate-200">Not replied</span>}
                                      </div>
                                      <Button
                                        size="sm"
                                        variant="secondary"
                                        className="bg-white/10 border-white/10 hover:bg-white/15"
                                        onClick={() => toggleReplied(r)}
                                        disabled={updatingReplyId === r.id}
                                      >
                                        {replied ? (
                                          <>
                                            <Undo2 className="h-4 w-4 mr-2" />
                                            Mark not replied
                                          </>
                                        ) : (
                                          <>
                                            <CheckCircle2 className="h-4 w-4 mr-2" />
                                            Mark replied
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                    {r.replied_at ? <div className="text-xs text-slate-400 mt-2">Replied at: {formatDateTime(r.replied_at)}</div> : null}
                                  </div>

                                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                                    <div className="text-xs text-slate-400 mb-2">Preferences</div>
                                    <div className="text-slate-300 mt-1">Salary: {r.salary_range}</div>
                                    <div className="text-slate-300 mt-1">Education: {r.education_level}</div>
                                    <div className="text-slate-300 mt-1">Experience: {r.experience_level}</div>
                                    <div className="text-slate-300 mt-1">Start time: {r.start_time}</div>
                                    <div className="text-slate-300 mt-1">Training: {r.willing_to_train}</div>
                                  </div>

                                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                                    <div className="text-xs text-slate-400 mb-2">Interview & payment</div>
                                    <div className="text-slate-300 mt-1">Date: {r.interview_date}</div>
                                    <div className="text-slate-300 mt-1">Time: {r.interview_time}</div>
                                    <div className="text-slate-300 mt-1">Contact method: {r.contact_method}</div>
                                    <div className="text-slate-300 mt-1">Contact value: {r.contact_value}</div>
                                    <div className="text-slate-300 mt-3">
                                      Status:{" "}
                                      <Badge className="bg-white/10 border-white/10 text-slate-100">{r.payment_status ?? "unknown"}</Badge>
                                    </div>
                                    {r.processing_fee != null ? <div className="text-slate-300 mt-1">Fee: KES {r.processing_fee}</div> : null}
                                    {r.mpesa_number ? <div className="text-slate-300 mt-1">M-Pesa: {r.mpesa_number}</div> : null}
                                    {r.checkout_request_id ? <div className="text-slate-400 mt-1 break-all">Checkout ID: {r.checkout_request_id}</div> : null}
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
          </TabsContent>

          <TabsContent value="emails" className="mt-0">
          <Card className="bg-white/5 border-white/10 backdrop-blur p-6">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-4">
              <div>
                <div className="text-lg font-extrabold text-slate-100">Automatic email log</div>
                <div className="text-sm text-slate-300 mt-1">
                  Track confirmation, selection, and onboarding emails — pending, sent, and failed.
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-end gap-2">
                <Button
                  variant="secondary"
                  className="bg-white/10 border-white/10 hover:bg-white/15"
                  onClick={loadAutoReplies}
                  disabled={autoRepliesLoading}
                >
                  {autoRepliesLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                  Refresh
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <button
                type="button"
                onClick={() => setAutoReplyStatusFilter("pending")}
                className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                  autoReplyStatusFilter === "pending"
                    ? "border-yellow-500/40 bg-yellow-500/15"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="text-xs uppercase tracking-wide text-slate-400">Pending</div>
                <div className="text-2xl font-extrabold text-yellow-200">{autoReplyStats.pending}</div>
              </button>
              <button
                type="button"
                onClick={() => setAutoReplyStatusFilter("sent")}
                className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                  autoReplyStatusFilter === "sent"
                    ? "border-emerald-500/40 bg-emerald-500/15"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="text-xs uppercase tracking-wide text-slate-400">Sent</div>
                <div className="text-2xl font-extrabold text-emerald-200">{autoReplyStats.sent}</div>
              </button>
              <button
                type="button"
                onClick={() => setAutoReplyStatusFilter("failed")}
                className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                  autoReplyStatusFilter === "failed"
                    ? "border-red-500/40 bg-red-500/15"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="text-xs uppercase tracking-wide text-slate-400">Failed</div>
                <div className="text-2xl font-extrabold text-red-200">{autoReplyStats.failed}</div>
              </button>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5">
                  <span className="text-xs font-semibold text-slate-200">Status</span>
                  <Select value={autoReplyStatusFilter} onValueChange={setAutoReplyStatusFilter}>
                    <SelectTrigger className="h-8 w-[160px] bg-white/10 border-white/10 text-slate-100">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-950 border-white/10 text-slate-100">
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  value={autoReplySearch}
                  onChange={(e) => setAutoReplySearch(e.target.value)}
                  placeholder="Search email, subject, error…"
                  className="sm:w-[360px] bg-white/10 border-white/10 text-slate-100 placeholder:text-slate-400"
                />
              </div>
              <Badge variant="secondary" className="bg-white/10 text-slate-100 border-white/10">
                Showing {filteredAutoReplies.length} / {autoReplies.length}
              </Badge>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-slate-300">To</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">Created</TableHead>
                    <TableHead className="text-slate-300">Send at</TableHead>
                    <TableHead className="text-slate-300">Sent at</TableHead>
                    <TableHead className="text-slate-300">Subject</TableHead>
                    <TableHead className="text-slate-300">Last error</TableHead>
                    <TableHead className="text-slate-300 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAutoReplies.length === 0 ? (
                    <TableRow className="border-white/10">
                      <TableCell colSpan={8} className="text-slate-300">
                        {autoReplies.length === 0
                          ? "No automatic emails found yet."
                          : "No emails match this filter."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAutoReplies.map((r) => {
                      const s = (r.status || "").toLowerCase();
                      const badgeClass =
                        s === "sent"
                          ? "bg-emerald-500/15 text-emerald-200 border-emerald-500/20"
                          : s === "failed"
                          ? "bg-red-500/15 text-red-200 border-red-500/20"
                          : "bg-yellow-500/15 text-yellow-200 border-yellow-500/20";
                      const canResend = s !== "sent";

                      return (
                        <TableRow key={r.id} className="border-white/10">
                          <TableCell className="text-slate-100 break-all">{r.to_email}</TableCell>
                          <TableCell>
                            <Badge className={badgeClass}>{s || "pending"}</Badge>
                          </TableCell>
                          <TableCell className="text-slate-300">{r.created_at ? formatDateTime(r.created_at) : ""}</TableCell>
                          <TableCell className="text-slate-300">{r.send_at ? formatDateTime(r.send_at) : ""}</TableCell>
                          <TableCell className="text-slate-300">{r.sent_at ? formatDateTime(r.sent_at) : ""}</TableCell>
                          <TableCell className="text-slate-100">{r.subject}</TableCell>
                          <TableCell className="text-slate-300 max-w-[280px]">
                            {r.last_error ? (
                              <span className="text-red-200 break-words">{String(r.last_error)}</span>
                            ) : (
                              ""
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="secondary"
                              className="bg-white/10 border-white/10 hover:bg-white/15"
                              disabled={!canResend || autoRepliesLoading}
                              onClick={() => resendAutoReply(r.id)}
                              title={canResend ? "Resend now" : "Already sent"}
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Resend
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
