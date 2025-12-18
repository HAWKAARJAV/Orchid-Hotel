import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  IndianRupee, 
  ShoppingBag, 
  Clock, 
  CheckCircle,
  Loader2,
  TrendingUp
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';

interface DashboardStats {
  todayRevenue: number;
  todayOrders: number;
  pendingOrders: number;
  completedOrders: number;
}

interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

interface PopularItem {
  name: string;
  quantity: number;
}

const CHART_COLORS = [
  'hsl(340, 45%, 45%)',
  'hsl(340, 40%, 55%)',
  'hsl(15, 55%, 55%)',
  'hsl(150, 20%, 55%)',
  'hsl(30, 35%, 60%)',
];

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    todayRevenue: 0,
    todayOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [popularItems, setPopularItems] = useState<PopularItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([
        fetchStats(),
        fetchRevenueData(),
        fetchPopularItems(),
      ]);
      setIsLoading(false);
    };

    fetchAllData();
  }, []);

  const fetchStats = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: todayOrdersData } = await supabase
      .from('orders')
      .select('total_amount, status')
      .gte('created_at', today.toISOString());

    if (todayOrdersData) {
      const paidOrders = todayOrdersData.filter(o => o.status === 'paid');
      const pendingOrders = todayOrdersData.filter(o => o.status === 'pending');

      setStats({
        todayRevenue: paidOrders.reduce((sum, o) => sum + Number(o.total_amount), 0),
        todayOrders: todayOrdersData.length,
        pendingOrders: pendingOrders.length,
        completedOrders: paidOrders.length,
      });
    }
  };

  const fetchRevenueData = async () => {
    const days = 7;
    const startDate = startOfDay(subDays(new Date(), days - 1));

    const { data: orders } = await supabase
      .from('orders')
      .select('total_amount, created_at, status')
      .gte('created_at', startDate.toISOString())
      .eq('status', 'paid');

    // Group by day
    const dailyData: Record<string, { revenue: number; orders: number }> = {};
    
    // Initialize all days
    for (let i = 0; i < days; i++) {
      const date = format(subDays(new Date(), days - 1 - i), 'MMM d');
      dailyData[date] = { revenue: 0, orders: 0 };
    }

    // Fill in actual data
    orders?.forEach((order) => {
      const date = format(new Date(order.created_at!), 'MMM d');
      if (dailyData[date]) {
        dailyData[date].revenue += Number(order.total_amount);
        dailyData[date].orders += 1;
      }
    });

    setRevenueData(
      Object.entries(dailyData).map(([date, data]) => ({
        date,
        revenue: Math.round(data.revenue),
        orders: data.orders,
      }))
    );
  };

  const fetchPopularItems = async () => {
    const { data: orderItems } = await supabase
      .from('order_items')
      .select('name, quantity');

    if (orderItems) {
      // Aggregate quantities by item name
      const itemTotals: Record<string, number> = {};
      orderItems.forEach((item) => {
        itemTotals[item.name] = (itemTotals[item.name] || 0) + item.quantity;
      });

      // Sort and take top 5
      const sorted = Object.entries(itemTotals)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, quantity]) => ({ name, quantity }));

      setPopularItems(sorted);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Today's Revenue",
      value: `₹${Math.round(stats.todayRevenue).toLocaleString()}`,
      icon: IndianRupee,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: "Today's Orders",
      value: stats.todayOrders.toString(),
      icon: ShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders.toString(),
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Completed Orders',
      value: stats.completedOrders.toString(),
      icon: CheckCircle,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your operations and analytics
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-display text-3xl font-bold text-foreground">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-display text-xl">Revenue Trend</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                Last 7 days
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">
              ₹{totalRevenue.toLocaleString()}
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(340, 45%, 45%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(340, 45%, 45%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 20%, 88%)" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12, fill: 'hsl(340, 10%, 45%)' }}
                    axisLine={{ stroke: 'hsl(30, 20%, 88%)' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: 'hsl(340, 10%, 45%)' }}
                    axisLine={{ stroke: 'hsl(30, 20%, 88%)' }}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(30, 30%, 99%)',
                      border: '1px solid hsl(30, 20%, 88%)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 20px -4px rgba(0,0,0,0.1)',
                    }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(340, 45%, 45%)"
                    strokeWidth={2}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Popular Items Chart */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="font-display text-xl">Most Popular Items</CardTitle>
            <p className="text-sm text-muted-foreground">
              Top 5 items by order quantity
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              {popularItems.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={popularItems} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 20%, 88%)" />
                    <XAxis 
                      type="number" 
                      tick={{ fontSize: 12, fill: 'hsl(340, 10%, 45%)' }}
                      axisLine={{ stroke: 'hsl(30, 20%, 88%)' }}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      tick={{ fontSize: 12, fill: 'hsl(340, 10%, 45%)' }}
                      axisLine={{ stroke: 'hsl(30, 20%, 88%)' }}
                      width={120}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(30, 30%, 99%)',
                        border: '1px solid hsl(30, 20%, 88%)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 20px -4px rgba(0,0,0,0.1)',
                      }}
                      formatter={(value: number) => [`${value} orders`, 'Quantity']}
                    />
                    <Bar dataKey="quantity" radius={[0, 4, 4, 0]}>
                      {popularItems.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No order data available yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders by Day Chart */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="font-display text-xl">Orders by Day</CardTitle>
          <p className="text-sm text-muted-foreground">
            Number of orders per day (last 7 days)
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 20%, 88%)" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12, fill: 'hsl(340, 10%, 45%)' }}
                  axisLine={{ stroke: 'hsl(30, 20%, 88%)' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: 'hsl(340, 10%, 45%)' }}
                  axisLine={{ stroke: 'hsl(30, 20%, 88%)' }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(30, 30%, 99%)',
                    border: '1px solid hsl(30, 20%, 88%)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px -4px rgba(0,0,0,0.1)',
                  }}
                  formatter={(value: number) => [`${value} orders`, 'Orders']}
                />
                <Bar 
                  dataKey="orders" 
                  fill="hsl(15, 55%, 55%)" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;