# 📦 Exemplos de Uso - Gerenciamento de Orders

## 🔍 Filtros por Data

### Exemplo 1: Filtrar por Período Específico

#### cURL
```bash
curl -X GET "http://localhost:3000/orders/by-date?date_from=2024-07-01T00:00:00.000Z&date_to=2024-07-31T23:59:59.000Z"
```

#### JavaScript
```javascript
async function getOrdersByPeriod() {
    const dateFrom = '2024-07-01T00:00:00.000Z';
    const dateTo = '2024-07-31T23:59:59.000Z';
    
    const response = await fetch(`/orders/by-date?date_from=${dateFrom}&date_to=${dateTo}`);
    const data = await response.json();
    
    console.log(`Encontradas ${data.results.length} orders no período`);
    return data;
}
```

#### Python
```python
import requests
from datetime import datetime

def get_orders_by_period(date_from, date_to):
    url = f"http://localhost:3000/orders/by-date"
    params = {
        'date_from': date_from,
        'date_to': date_to
    }
    
    response = requests.get(url, params=params)
    data = response.json()
    
    print(f"Encontradas {len(data['results'])} orders no período")
    return data

# Exemplo de uso
orders = get_orders_by_period(
    '2024-07-01T00:00:00.000Z',
    '2024-07-31T23:59:59.000Z'
)
```

### Exemplo 2: Orders do Mês Atual

#### cURL
```bash
curl -X GET "http://localhost:3000/orders/current-month"
```

#### JavaScript
```javascript
async function getCurrentMonthOrders() {
    const response = await fetch('/orders/current-month');
    const data = await response.json();
    
    console.log(`Orders do mês ${data.period_info.month}/${data.period_info.year}:`);
    console.log(`Total: ${data.results.length} orders`);
    
    return data;
}
```

### Exemplo 3: Filtrar com Status Específico

#### cURL
```bash
curl -X GET "http://localhost:3000/orders/by-date?date_from=2024-08-01T00:00:00.000Z&date_to=2024-08-07T23:59:59.000Z&status=paid"
```

#### JavaScript
```javascript
async function getPaidOrdersThisWeek() {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const params = new URLSearchParams({
        date_from: weekAgo.toISOString(),
        date_to: now.toISOString(),
        status: 'paid'
    });
    
    const response = await fetch(`/orders/by-date?${params}`);
    const data = await response.json();
    
    return data;
}
```

## 📊 Análise de Dados

### Exemplo 4: Calcular Faturamento por Período

#### JavaScript
```javascript
async function calculateRevenue(dateFrom, dateTo) {
    const response = await fetch(`/orders/by-date?date_from=${dateFrom}&date_to=${dateTo}&status=paid`);
    const data = await response.json();
    
    const totalRevenue = data.results.reduce((sum, order) => {
        return sum + (order.total_amount || 0);
    }, 0);
    
    const averageOrderValue = totalRevenue / data.results.length;
    
    return {
        period: { from: dateFrom, to: dateTo },
        total_orders: data.results.length,
        total_revenue: totalRevenue,
        average_order_value: averageOrderValue,
        orders: data.results
    };
}

// Exemplo de uso
const revenue = await calculateRevenue(
    '2024-08-01T00:00:00.000Z',
    '2024-08-07T23:59:59.000Z'
);

console.log(`Faturamento: R$ ${revenue.total_revenue.toFixed(2)}`);
console.log(`Ticket médio: R$ ${revenue.average_order_value.toFixed(2)}`);
```

### Exemplo 5: Comparar Períodos

#### JavaScript
```javascript
async function comparePeriods() {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    
    // Mês atual
    const currentMonth = await fetch(`/orders/current-month`);
    const currentData = await currentMonth.json();
    
    // Mês anterior
    const lastMonthResponse = await fetch(
        `/orders/by-date?date_from=${lastMonth.toISOString()}&date_to=${lastMonthEnd.toISOString()}`
    );
    const lastMonthData = await lastMonthResponse.json();
    
    const comparison = {
        current_month: {
            orders: currentData.results.length,
            revenue: currentData.results.reduce((sum, order) => sum + (order.total_amount || 0), 0)
        },
        last_month: {
            orders: lastMonthData.results.length,
            revenue: lastMonthData.results.reduce((sum, order) => sum + (order.total_amount || 0), 0)
        }
    };
    
    comparison.growth = {
        orders: ((comparison.current_month.orders - comparison.last_month.orders) / comparison.last_month.orders * 100).toFixed(2),
        revenue: ((comparison.current_month.revenue - comparison.last_month.revenue) / comparison.last_month.revenue * 100).toFixed(2)
    };
    
    return comparison;
}
```

## 🚀 Casos de Uso Avançados

### Exemplo 6: Relatório Diário Automatizado

#### JavaScript
```javascript
class OrdersReporter {
    constructor(apiBase = 'http://localhost:3000') {
        this.apiBase = apiBase;
    }
    
    async getDailyReport(date = new Date()) {
        const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
        
        const response = await fetch(
            `${this.apiBase}/orders/by-date?date_from=${startOfDay.toISOString()}&date_to=${endOfDay.toISOString()}`
        );
        
        const data = await response.json();
        
        return {
            date: date.toISOString().split('T')[0],
            total_orders: data.results.length,
            total_revenue: data.results.reduce((sum, order) => sum + (order.total_amount || 0), 0),
            status_breakdown: this.getStatusBreakdown(data.results),
            orders: data.results
        };
    }
    
    getStatusBreakdown(orders) {
        return orders.reduce((breakdown, order) => {
            breakdown[order.status] = (breakdown[order.status] || 0) + 1;
            return breakdown;
        }, {});
    }
    
    async getWeeklyReport() {
        const reports = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
            const report = await this.getDailyReport(date);
            reports.push(report);
        }
        
        return {
            period: 'last_7_days',
            daily_reports: reports,
            summary: {
                total_orders: reports.reduce((sum, day) => sum + day.total_orders, 0),
                total_revenue: reports.reduce((sum, day) => sum + day.total_revenue, 0),
                average_daily_orders: reports.reduce((sum, day) => sum + day.total_orders, 0) / 7,
                average_daily_revenue: reports.reduce((sum, day) => sum + day.total_revenue, 0) / 7
            }
        };
    }
}

// Uso
const reporter = new OrdersReporter();

// Relatório de hoje
const todayReport = await reporter.getDailyReport();
console.log('Relatório de hoje:', todayReport);

// Relatório semanal
const weeklyReport = await reporter.getWeeklyReport();
console.log('Relatório semanal:', weeklyReport);
```

### Exemplo 7: Monitor de Orders em Tempo Real

#### JavaScript
```javascript
class OrdersMonitor {
    constructor(apiBase = 'http://localhost:3000') {
        this.apiBase = apiBase;
        this.lastCheck = new Date();
    }
    
    async checkNewOrders() {
        const now = new Date();
        const response = await fetch(
            `${this.apiBase}/orders/by-date?date_from=${this.lastCheck.toISOString()}&date_to=${now.toISOString()}`
        );
        
        const data = await response.json();
        this.lastCheck = now;
        
        if (data.results.length > 0) {
            console.log(`🔔 ${data.results.length} nova(s) order(s) encontrada(s)!`);
            data.results.forEach(order => {
                console.log(`📦 Order ${order.id} - R$ ${order.total_amount} - ${order.status}`);
            });
        }
        
        return data.results;
    }
    
    startMonitoring(intervalMinutes = 5) {
        console.log(`🚀 Iniciando monitoramento a cada ${intervalMinutes} minutos...`);
        
        setInterval(async () => {
            try {
                await this.checkNewOrders();
            } catch (error) {
                console.error('❌ Erro no monitoramento:', error);
            }
        }, intervalMinutes * 60 * 1000);
    }
}

// Uso
const monitor = new OrdersMonitor();
monitor.startMonitoring(5); // Verifica a cada 5 minutos
```

## 📅 Formatos de Data Suportados

### Timezone Brasil (GMT-3)
```javascript
// Formato correto para o Brasil
const dateFrom = '2024-08-01T00:00:00.000-03:00';
const dateTo = '2024-08-31T23:59:59.000-03:00';
```

### UTC (Recomendado)
```javascript
// Formato UTC (mais confiável)
const dateFrom = '2024-08-01T03:00:00.000Z'; // 00:00 no Brasil
const dateTo = '2024-08-31T02:59:59.000Z';   // 23:59 no Brasil
```

### Usando JavaScript Date
```javascript
// Converter Date para ISO string
const startDate = new Date('2024-08-01');
const endDate = new Date('2024-08-31');

const dateFrom = startDate.toISOString();
const dateTo = endDate.toISOString();
```

## 🔧 Dicas de Performance

1. **Use limit**: Sempre defina um limite para evitar respostas muito grandes
2. **Paginação**: Use offset para navegar por muitos resultados
3. **Filtros específicos**: Combine data + status para consultas mais eficientes
4. **Cache local**: Armazene resultados temporariamente para evitar requisições repetidas

```javascript
// Exemplo otimizado
const params = new URLSearchParams({
    date_from: '2024-08-01T00:00:00.000Z',
    date_to: '2024-08-07T23:59:59.000Z',
    status: 'paid',
    limit: '50',
    offset: '0'
});
```