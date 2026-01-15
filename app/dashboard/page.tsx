"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, TrendingUp, Activity, FileText } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Mock data (será substituído por dados reais do Supabase)
const stats = [
  {
    title: "Clientes Ativos",
    value: "24",
    change: "+12% vs mês passado",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "MRR (Receita Recorrente)",
    value: formatCurrency(9528),
    change: "+R$ 1.188 este mês",
    icon: DollarSign,
    color: "text-green-600",
  },
  {
    title: "ARR (Receita Anual)",
    value: formatCurrency(114336),
    change: "Projeção baseada em MRR",
    icon: TrendingUp,
    color: "text-purple-600",
  },
  {
    title: "Taxa de Churn",
    value: "4.2%",
    change: "-1.2% vs mês passado",
    icon: Activity,
    color: "text-orange-600",
  },
];

const recentClients = [
  {
    name: "Maria Silva",
    email: "maria@email.com",
    status: "active",
    joined: "15/01/2026",
  },
  {
    name: "João Santos",
    email: "joao@email.com",
    status: "active",
    joined: "14/01/2026",
  },
  {
    name: "Ana Costa",
    email: "ana@email.com",
    status: "active",
    joined: "13/01/2026",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Visão geral do seu negócio de assinaturas
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Clientes Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Clientes Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentClients.map((client) => (
                <div
                  key={client.email}
                  className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-gray-900">{client.name}</p>
                    <p className="text-sm text-gray-500">{client.email}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                      Ativo
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{client.joined}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Próximas Cobranças */}
        <Card>
          <CardHeader>
            <CardTitle>Próximas Cobranças</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <p className="font-medium text-gray-900">20 clientes</p>
                  <p className="text-sm text-gray-500">Vencimento: 15/01/2026</p>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(7940)}
                </p>
              </div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <p className="font-medium text-gray-900">4 clientes</p>
                  <p className="text-sm text-gray-500">Vencimento: 20/01/2026</p>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(1588)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <button className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors">
              <Users className="h-8 w-8 text-gray-400 mb-2" />
              <span className="font-medium text-gray-700">Novo Cliente</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors">
              <FileText className="h-8 w-8 text-gray-400 mb-2" />
              <span className="font-medium text-gray-700">Gerar Fatura</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors">
              <TrendingUp className="h-8 w-8 text-gray-400 mb-2" />
              <span className="font-medium text-gray-700">Ver Relatórios</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
