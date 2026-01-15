"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Send, Check, Clock, XCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Mock data
const invoices = [
  {
    id: "INV-001",
    clientName: "Maria Silva",
    amount: 397,
    status: "paid",
    date: "2026-01-15",
    dueDate: "2026-01-20",
    method: "Cartão de Crédito",
  },
  {
    id: "INV-002",
    clientName: "João Santos",
    amount: 297,
    status: "paid",
    date: "2026-01-14",
    dueDate: "2026-01-19",
    method: "PIX",
  },
  {
    id: "INV-003",
    clientName: "Ana Costa",
    amount: 197,
    status: "pending",
    date: "2026-01-13",
    dueDate: "2026-01-18",
    method: "Boleto",
  },
  {
    id: "INV-004",
    clientName: "Pedro Oliveira",
    amount: 397,
    status: "overdue",
    date: "2025-12-20",
    dueDate: "2025-12-25",
    method: "Cartão de Crédito",
  },
  {
    id: "INV-005",
    clientName: "Carla Mendes",
    amount: 297,
    status: "cancelled",
    date: "2025-12-15",
    dueDate: "2025-12-20",
    method: "PIX",
  },
];

const statusConfig = {
  paid: { 
    label: "Paga", 
    color: "bg-green-100 text-green-700",
    icon: Check,
  },
  pending: { 
    label: "Pendente", 
    color: "bg-yellow-100 text-yellow-700",
    icon: Clock,
  },
  overdue: { 
    label: "Vencida", 
    color: "bg-red-100 text-red-700",
    icon: XCircle,
  },
  cancelled: { 
    label: "Cancelada", 
    color: "bg-gray-100 text-gray-700",
    icon: XCircle,
  },
};

export default function InvoicesPage() {
  const paidInvoices = invoices.filter((i) => i.status === "paid");
  const pendingInvoices = invoices.filter((i) => i.status === "pending");
  const overdueInvoices = invoices.filter((i) => i.status === "overdue");
  
  const totalReceived = paidInvoices.reduce((sum, i) => sum + i.amount, 0);
  const totalPending = pendingInvoices.reduce((sum, i) => sum + i.amount, 0);
  const totalOverdue = overdueInvoices.reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Faturas</h1>
          <p className="text-gray-500 mt-1">
            Gerencie e acompanhe todas as faturas
          </p>
        </div>
        <Button className="bg-gold text-black hover:bg-gold/90">
          <FileText size={18} className="mr-2" />
          Nova Fatura
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Recebido
            </CardTitle>
            <Check className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalReceived)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {paidInvoices.length} faturas pagas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pendente
            </CardTitle>
            <Clock className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(totalPending)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {pendingInvoices.length} aguardando pagamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Vencidas
            </CardTitle>
            <XCircle className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalOverdue)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {overdueInvoices.length} faturas vencidas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total
            </CardTitle>
            <FileText className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {invoices.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Faturas emitidas</p>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Todas as Faturas</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download size={16} className="mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fatura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Emissão
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vencimento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Método
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => {
                  const StatusIcon = statusConfig[invoice.status].icon;
                  return (
                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText size={16} className="text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">
                            {invoice.id}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {invoice.clientName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">
                          {formatCurrency(invoice.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${statusConfig[invoice.status].color}`}>
                          <StatusIcon size={14} className="mr-1" />
                          {statusConfig[invoice.status].label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(invoice.date).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(invoice.dueDate).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.method}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" title="Download PDF">
                            <Download size={16} />
                          </Button>
                          <Button variant="ghost" size="sm" title="Enviar por email">
                            <Send size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
