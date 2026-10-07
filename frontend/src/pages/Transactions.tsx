import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import api from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

export default function Transactions() {
  const [search, setSearch] = useState("");

  const { data: accountsData } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => api.get("/accounts/user_accounts").then((res) => res.data),
  });

  const { data: txData, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => api.get("/transactions/history").then((res) => res.data),
  });

  const accounts = accountsData?.accounts || [];
  let transactions = txData?.transactions || [];

  // Multi-attribute search: Search by Account Number, Name, Account ID, or Category
  if (search.trim()) {
    const q = search.toLowerCase().trim();
    transactions = transactions.filter((tx: any) => {
      const fromAccNo = tx.fromAccount?.accountNumber?.toLowerCase() || "";
      const toAccNo = tx.toAccount?.accountNumber?.toLowerCase() || "";
      const fromId = tx.fromAccount?._id?.toLowerCase() || "";
      const toId = tx.toAccount?._id?.toLowerCase() || "";
      const fromName = (tx.fromAccount?.user?.name || tx.fromAccount?.accountName || "").toLowerCase();
      const toName = (tx.toAccount?.user?.name || tx.toAccount?.accountName || "").toLowerCase();
      const category = (tx.category || "").toLowerCase();
      const status = (tx.status || "").toLowerCase();

      return (
        fromAccNo.includes(q) ||
        toAccNo.includes(q) ||
        fromId.includes(q) ||
        toId.includes(q) ||
        fromName.includes(q) ||
        toName.includes(q) ||
        category.includes(q) ||
        status.includes(q)
      );
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-[13px] font-semibold text-foreground tracking-tight">Transaction History</h2>
          <p className="text-[13px] text-muted-foreground mt-1">View and filter your ledger movements.</p>
        </div>
        <div className="w-full sm:w-80">
          <Input 
            placeholder="Search by name, A/C no, ID, or category..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border border-border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="w-[180px] text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Date</TableHead>
              <TableHead className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Type</TableHead>
              <TableHead className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Account Details</TableHead>
              <TableHead className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-right text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border">
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-[13px] text-muted-foreground">
                  Loading transactions...
                </TableCell>
              </TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-[13px] text-muted-foreground">
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((tx: any) => {
                const isDebit = accounts.some((a: any) => a._id === tx.fromAccount?._id);
                
                return (
                  <TableRow key={tx._id} className="hover:bg-muted/50 border-none transition-colors group">
                    <TableCell className="font-medium text-[13px] text-foreground">
                      {new Date(tx.createdAt).toLocaleString(undefined, { 
                        month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {isDebit ? (
                          <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        ) : (
                          <ArrowDownLeft className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        )}
                        <span className="text-[13px] text-muted-foreground group-hover:text-foreground transition-colors">
                          {isDebit ? "Transfer Out" : "Transfer In"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-[13px] text-foreground font-medium">
                        {isDebit 
                          ? `${tx.toAccount?.user?.name || tx.toAccount?.accountName || 'Recipient'} (${tx.toAccount?.accountNumber ? `...${tx.toAccount.accountNumber.slice(-4)}` : tx.toAccount?._id ? `...${tx.toAccount._id.slice(-4)}` : 'N/A'})`
                          : `${tx.fromAccount?.user?.name || tx.fromAccount?.accountName || 'Sender'} (${tx.fromAccount?.accountNumber ? `...${tx.fromAccount.accountNumber.slice(-4)}` : tx.fromAccount?._id ? `...${tx.fromAccount._id.slice(-4)}` : 'N/A'})`
                        }
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-sm text-[11px] font-medium uppercase tracking-wider border",
                        tx.status === "COMPLETE" || tx.status === "COMPLETED" 
                          ? "bg-secondary text-secondary-foreground border-border/50"
                          : "bg-secondary text-secondary-foreground border-border/50"
                      )}>
                        {tx.status}
                      </span>
                    </TableCell>
                    <TableCell className={cn(
                      "text-right tabular-nums text-[13px] font-medium",
                      isDebit ? "text-foreground" : "text-green-600 dark:text-emerald-400"
                    )}>
                      {isDebit ? "-" : "+"}₹{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
