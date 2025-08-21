import { getProducts } from './product-data';
import { getOrders } from './data';
import { Product, Order } from './types';
import { safeDecimal } from './utils';

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  conversionRate: number;
  revenueGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
  conversionGrowth: number;
}

export interface SalesData {
  month: string;
  sales: number;
  orders: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export interface RecentOrder {
  id: string;
  customer: string;
  amount: number;
  status: string;
  date: string;
}

export interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  stock: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const orders = await getOrders();
    const products = await getProducts();

    // Calculate current month stats
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const currentMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    });

    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    const lastMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate.getMonth() === lastMonth && orderDate.getFullYear() === lastMonthYear;
    });

    // Calculate revenue
    const totalRevenue = orders.reduce((sum, order) => sum + safeDecimal(order.total), 0);
    const currentMonthRevenue = currentMonthOrders.reduce((sum, order) => sum + safeDecimal(order.total), 0);
    const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + safeDecimal(order.total), 0);

    // Calculate unique customers
    const uniqueCustomers = new Set(orders.map(order => order.customer?.email || order.id)).size;
    const currentMonthCustomers = new Set(currentMonthOrders.map(order => order.customer?.email || order.id)).size;
    const lastMonthCustomers = new Set(lastMonthOrders.map(order => order.customer?.email || order.id)).size;

    // Calculate growth rates
    const revenueGrowth = lastMonthRevenue > 0 ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;
    const ordersGrowth = lastMonthOrders.length > 0 ? ((currentMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100 : 0;
    const customersGrowth = lastMonthCustomers > 0 ? ((currentMonthCustomers - lastMonthCustomers) / lastMonthCustomers) * 100 : 0;

    // Simple conversion rate calculation (orders per unique customer)
    const conversionRate = uniqueCustomers > 0 ? (orders.length / uniqueCustomers) * 100 : 0;
    const lastMonthConversionRate = lastMonthCustomers > 0 ? (lastMonthOrders.length / lastMonthCustomers) * 100 : 0;
    const conversionGrowth = lastMonthConversionRate > 0 ? ((conversionRate - lastMonthConversionRate) / lastMonthConversionRate) * 100 : 0;

    return {
      totalRevenue,
      totalOrders: orders.length,
      totalCustomers: uniqueCustomers,
      conversionRate,
      revenueGrowth,
      ordersGrowth,
      customersGrowth,
      conversionGrowth,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      conversionRate: 0,
      revenueGrowth: 0,
      ordersGrowth: 0,
      customersGrowth: 0,
      conversionGrowth: 0,
    };
  }
}

export async function getSalesData(): Promise<SalesData[]> {
  try {
    const orders = await getOrders();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.getMonth();
      const year = date.getFullYear();
      
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getMonth() === month && orderDate.getFullYear() === year;
      });
      
      const monthRevenue = monthOrders.reduce((sum, order) => sum + safeDecimal(order.total), 0);
      
      last6Months.push({
        month: monthNames[month],
        sales: monthRevenue,
        orders: monthOrders.length,
      });
    }
    
    return last6Months;
  } catch (error) {
    console.error('Error fetching sales data:', error);
    return [];
  }
}

export async function getCategoryData(): Promise<CategoryData[]> {
  try {
    const products = await getProducts();
    const orders = await getOrders();
    
    // Count sales by category
    const categoryStats: { [key: string]: number } = {};
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316'];
    
    orders.forEach(order => {
      order.items?.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          const category = product.category || 'Others';
          categoryStats[category] = (categoryStats[category] || 0) + item.quantity;
        }
      });
    });
    
    const totalSales = Object.values(categoryStats).reduce((sum, count) => sum + count, 0);
    
    return Object.entries(categoryStats)
      .map(([name, count], index) => ({
        name,
        value: totalSales > 0 ? Math.round((count / totalSales) * 100) : 0,
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.value - a.value);
  } catch (error) {
    console.error('Error fetching category data:', error);
    return [];
  }
}

export async function getRecentOrders(): Promise<RecentOrder[]> {
  try {
    const orders = await getOrders();
    
    return orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(order => ({
        id: order.id,
        customer: order.customer?.fullName || order.customer?.email || 'Guest Customer',
        amount: safeDecimal(order.total),
        status: order.status || 'Pending',
        date: new Date(order.createdAt).toLocaleDateString(),
      }));
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    return [];
  }
}

export async function getTopProducts(): Promise<TopProduct[]> {
  try {
    const products = await getProducts();
    const orders = await getOrders();
    
    // Calculate sales for each product
    const productStats: { [key: string]: { sales: number; revenue: number } } = {};
    
    orders.forEach(order => {
      order.items?.forEach(item => {
        const productId = item.productId;
        if (!productStats[productId]) {
          productStats[productId] = { sales: 0, revenue: 0 };
        }
        productStats[productId].sales += item.quantity;
        productStats[productId].revenue += item.quantity * safeDecimal(item.price);
      });
    });
    
    return products
      .map(product => ({
        id: product.id,
        name: product.name,
        sales: productStats[product.id]?.sales || 0,
        revenue: productStats[product.id]?.revenue || 0,
        stock: product.stock,
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
  } catch (error) {
    console.error('Error fetching top products:', error);
    return [];
  }
}
