import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { quotesStore } from "@/lib/quotes-store";
import { posStore } from "@/lib/pos-store";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET(request: Request) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.isAdmin) {
      return NextResponse.json(
        { success: false, error: authResult.error || "Unauthorized: Admin access required" },
        { status: 401 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const isMockEnv =
      !supabaseUrl ||
      supabaseUrl.includes("your-project") ||
      supabaseUrl.includes("placeholder") ||
      supabaseUrl.includes("mock");

    if (isMockEnv) {
      const allQuotes = quotesStore.getAll(true);
      const newQuotesCount = allQuotes.filter((q) => q.status === "new").length;
      const activeQuotesCount = allQuotes.filter(
        (q) => !["completed", "closed", "archived"].includes(q.status || "")
      ).length;

      const posStats = posStore.getStats({
        newCount: newQuotesCount,
        activeCount: activeQuotesCount,
        totalCount: allQuotes.length,
      });

      const recentQuotes = allQuotes.slice(0, 5);
      const recentCustomers = posStore.getCustomers().slice(0, 5);
      const activeProjects = posStore.getProjects().filter((p) => p.status !== "completed" && p.status !== "cancelled").slice(0, 5);
      const outstandingInvoices = posStore.getInvoices().filter((i) => i.status !== "paid" && i.status !== "cancelled").slice(0, 5);

      return NextResponse.json({
        success: true,
        data: {
          ...posStats,
          recentQuotes,
          recentCustomers,
          activeProjects,
          outstandingInvoices,
        },
      });
    }

    // Attempt real database metrics from Supabase with fallback to posStore
    try {
      const [
        quotesRes,
        customersRes,
        estimatesRes,
        invoicesRes,
        paymentsRes,
        projectsRes,
      ] = await Promise.all([
        supabaseAdmin.from("quotes").select("*"),
        supabaseAdmin.from("customers").select("*"),
        supabaseAdmin.from("estimates").select("*"),
        supabaseAdmin.from("invoices").select("*"),
        supabaseAdmin.from("payments").select("*"),
        supabaseAdmin.from("pos_projects").select("*"),
      ]);

      const quotes = quotesRes.data || quotesStore.getAll(true);
      const customers = customersRes.data || posStore.getCustomers();
      const estimates = estimatesRes.data || posStore.getEstimates();
      const invoices = invoicesRes.data || posStore.getInvoices();
      const payments = paymentsRes.data || posStore.getPayments();
      const projects = projectsRes.data || posStore.getProjects();

      const newQuotesCount = quotes.filter((q) => q.status === "new").length;
      const activeQuotesCount = quotes.filter(
        (q) => !["completed", "closed", "archived"].includes(q.status || "")
      ).length;
      const completedProjectsCount = projects.filter((p) => p.status === "completed").length;
      const unpaidInvoices = invoices.filter((i) => i.status !== "paid" && i.status !== "cancelled");
      const outstandingAmount = unpaidInvoices.reduce((acc, curr) => acc + (Number(curr.balance_due) || 0), 0);
      const totalRevenue = payments.reduce((acc, curr) => acc + (curr.status === "completed" ? Number(curr.amount) || 0 : 0), 0);

      return NextResponse.json({
        success: true,
        data: {
          totalLeads: quotes.length,
          newQuotes: newQuotesCount,
          activeQuotes: activeQuotesCount,
          completedProjects: completedProjectsCount,
          totalEstimates: estimates.length,
          unpaidInvoicesCount: unpaidInvoices.length,
          outstandingAmount: Math.round(outstandingAmount * 100) / 100,
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          totalCustomers: customers.length,
          recentQuotes: quotes.slice(0, 5),
          recentCustomers: customers.slice(0, 5),
          activeProjects: projects.filter((p) => p.status !== "completed" && p.status !== "cancelled").slice(0, 5),
          outstandingInvoices: unpaidInvoices.slice(0, 5),
          recentActivity: posStore.getActivityLogs(5),
        },
      });
    } catch {
      const allQuotes = quotesStore.getAll(true);
      const posStats = posStore.getStats({
        newCount: allQuotes.filter((q) => q.status === "new").length,
        activeCount: allQuotes.filter((q) => !["completed", "closed", "archived"].includes(q.status || "")).length,
        totalCount: allQuotes.length,
      });
      return NextResponse.json({
        success: true,
        data: {
          ...posStats,
          recentQuotes: allQuotes.slice(0, 5),
          recentCustomers: posStore.getCustomers().slice(0, 5),
          activeProjects: posStore.getProjects().slice(0, 5),
          outstandingInvoices: posStore.getInvoices().filter((i) => i.status !== "paid").slice(0, 5),
        },
      });
    }
  } catch (err) {
    console.error("Dashboard stats error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
